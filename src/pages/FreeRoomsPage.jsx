import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  IoArrowBackOutline,
  IoBusinessOutline,
  IoListOutline,
  IoMapOutline,
  IoRefreshOutline,
  IoTimeOutline,
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import scheduleData from '../data/schedule.json'
import bellsData from '../data/bells.json'
import roomsData from '../data/rooms.json'
import { getFreeRoomsAt } from '../utils/freeRooms.js'
import CampusRoomMap from '../components/CampusRoomMap.jsx'
import '../App.css'

const BUILDINGS = ['А', 'Б', 'В']

const getPeriodLabel = (result) => {
  if (!result.currentBell) return result.statusLabel

  const pairNumber = result.currentBell.pairNumber
  const pairLabel = Number.isFinite(Number(pairNumber))
    ? `${pairNumber}-я пара`
    : pairNumber

  return `${pairLabel} · ${result.currentBell.time}`
}

function FreeRoomsPage() {
  const navigate = useNavigate()
  const [now, setNow] = useState(() => new Date())
  const [viewMode, setViewMode] = useState('list')

  const refresh = useCallback(() => setNow(new Date()), [])

  useEffect(() => {
    const timer = window.setInterval(refresh, 30_000)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refresh])

  const result = useMemo(
    () => getFreeRoomsAt({ now, scheduleData, bellsData, roomsData }),
    [now],
  )
  const hasData = result.status !== 'no-data'

  return (
    <div className="free-rooms-page">
      <header className="free-rooms-topbar">
        <div className="free-rooms-topbar-content">
          <button className="free-rooms-back" onClick={() => navigate('/')}>
            <IoArrowBackOutline aria-hidden="true" />
            Расписание
          </button>
          <button className="free-rooms-refresh" onClick={refresh} title="Обновить список">
            <IoRefreshOutline aria-hidden="true" />
            Обновить
          </button>
        </div>
      </header>

      <main className="free-rooms-content">
        <section className="free-rooms-hero">
          <div className="free-rooms-hero-icon" aria-hidden="true">
            <IoBusinessOutline />
          </div>
          <div>
            <h1>Свободные кабинеты</h1>
            <p>Актуальный список по корпусам А, Б и В</p>
          </div>
        </section>

        <section className={`free-rooms-status ${result.status}`} aria-live="polite">
          <div className="free-rooms-status-main">
            <IoTimeOutline aria-hidden="true" />
            <div>
              <strong>{getPeriodLabel(result)}</strong>
              <span>
                Данные на {result.time}, {result.date}
              </span>
            </div>
          </div>
          {hasData && (
            <div className="free-rooms-counter">
              Свободно <strong>{result.freeRoomsCount}</strong> из {result.totalRooms}
            </div>
          )}
        </section>

        <div className="free-rooms-view-toggle" role="group" aria-label="Режим отображения">
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
          >
            <IoListOutline aria-hidden="true" />
            Список
          </button>
          <button
            className={viewMode === 'map' ? 'active' : ''}
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
          >
            <IoMapOutline aria-hidden="true" />
            Карта
          </button>
        </div>

        {viewMode === 'map' ? (
          <CampusRoomMap roomsData={roomsData} result={result} hasData={hasData} />
        ) : !hasData ? (
          <section className="free-rooms-empty">
            <h2>Расписание на эту дату не найдено</h2>
            <p>
              Загрузите актуальный файл расписания. Пока данных нет, кабинеты не помечаются
              свободными, чтобы не показать неверную информацию.
            </p>
          </section>
        ) : (
          <section className="free-rooms-grid" aria-label="Список свободных кабинетов">
            {BUILDINGS.map((building) => {
              const rooms = result.rooms[building] || []

              return (
                <article className="free-rooms-building" key={building}>
                  <div className="free-rooms-building-header">
                    <div>
                      <span>Корпус</span>
                      <h2>{building}</h2>
                    </div>
                    <span className="free-rooms-building-count">{rooms.length}</span>
                  </div>

                  {rooms.length ? (
                    <div className="free-rooms-list">
                      {rooms.map((room) => (
                        <span className="free-room-chip" key={room}>
                          {room}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="free-rooms-none">Свободных кабинетов сейчас нет</p>
                  )}
                </article>
              )
            })}
          </section>
        )}

        <p className="free-rooms-note">
          Список обновляется автоматически. Во время перемены кабинеты считаются свободными.
        </p>
      </main>
    </div>
  )
}

export default FreeRoomsPage
