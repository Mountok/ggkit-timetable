import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  IoArrowBackOutline,
  IoContractOutline,
  IoExpandOutline,
  IoTimeOutline,
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import CampusRoomMap from '../components/CampusRoomMap.jsx'
import scheduleData from '../data/schedule.json'
import bellsData from '../data/bells.json'
import roomsData from '../data/rooms.json'
import { getFreeRoomsAt } from '../utils/freeRooms.js'
import '../App.css'

const getPeriodLabel = (result) => {
  if (!result.currentBell) return result.statusLabel
  const pairNumber = result.currentBell.pairNumber
  const pairLabel = Number.isFinite(Number(pairNumber)) ? `${pairNumber}-я пара` : pairNumber
  return `${pairLabel} · ${result.currentBell.time}`
}

function CampusMapPage() {
  const navigate = useNavigate()
  const [now, setNow] = useState(() => new Date())
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))
  const refresh = useCallback(() => setNow(new Date()), [])

  useEffect(() => {
    const timer = window.setInterval(refresh, 30_000)
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    document.addEventListener('fullscreenchange', handleFullscreen)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', refresh)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('fullscreenchange', handleFullscreen)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  const result = useMemo(
    () => getFreeRoomsAt({ now, scheduleData, bellsData, roomsData }),
    [now],
  )
  const hasData = result.status !== 'no-data'

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await document.documentElement.requestFullscreen()
  }

  return (
    <div className="campus-kiosk-page">
      <header className="campus-kiosk-header">
        <button className="campus-kiosk-back" onClick={() => navigate('/free-rooms')}>
          <IoArrowBackOutline aria-hidden="true" />
          Свободные кабинеты
        </button>

        <div className="campus-kiosk-title">
          <strong>Интерактивная карта ГГКИТ</strong>
          <span>Корпуса, этажи и кабинеты</span>
        </div>

        <div className="campus-kiosk-status">
          <IoTimeOutline aria-hidden="true" />
          <div>
            <strong>{getPeriodLabel(result)}</strong>
            <span>{result.time} · свободно {result.freeRoomsCount} из {result.totalRooms}</span>
          </div>
        </div>

        <button className="campus-fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? <IoContractOutline aria-hidden="true" /> : <IoExpandOutline aria-hidden="true" />}
          {isFullscreen ? 'Выйти из полного экрана' : 'На весь экран'}
        </button>
      </header>

      <main className="campus-kiosk-content">
        <CampusRoomMap roomsData={roomsData} result={result} hasData={hasData} kiosk />
      </main>
    </div>
  )
}

export default CampusMapPage
