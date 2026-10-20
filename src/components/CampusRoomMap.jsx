import { useMemo, useState } from 'react'
import {
  IoArrowBackOutline,
  IoLayersOutline,
  IoLocationOutline,
} from 'react-icons/io5'

const BUILDINGS = {
  А: {
    name: 'Большой корпус',
    slug: 'a',
    floors: [0, 1, 2, 3, 4],
    defaultFloor: 1,
  },
  Б: {
    name: 'Средний корпус',
    slug: 'b',
    floors: [1, 2, 3, 4],
    defaultFloor: 1,
  },
  В: {
    name: 'Малый корпус',
    slug: 'v',
    floors: [1, 2, 3],
    defaultFloor: 1,
  },
}

const getRoomFloor = (room) => Number(String(room).slice(1, 2))

const getFloorLabel = (floor) => (floor === 0 ? 'Цокольный этаж' : `${floor}-й этаж`)

const getRoomStatus = (room, result, hasData) => {
  if (!hasData) return 'unknown'
  if (result.occupiedRooms.includes(room)) return 'occupied'
  if (Object.values(result.rooms).some((rooms) => rooms.includes(room))) return 'free'
  return 'unknown'
}

const getStatusLabel = (status) => {
  if (status === 'free') return 'Свободен сейчас'
  if (status === 'occupied') return 'Занят сейчас'
  return 'Нет данных'
}

function CampusRoomMap({ roomsData, result, hasData }) {
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState('')

  const openBuilding = (building) => {
    setSelectedBuilding(building)
    setSelectedFloor(BUILDINGS[building].defaultFloor)
    setSelectedRoom('')
  }

  const floorRooms = useMemo(() => {
    if (!selectedBuilding) return []
    return (roomsData[selectedBuilding] || []).filter(
      (room) => getRoomFloor(room) === selectedFloor,
    )
  }, [selectedBuilding, selectedFloor, roomsData])

  if (!selectedBuilding) {
    return (
      <section className="campus-map-section" aria-label="Интерактивная карта корпусов">
        <div className="campus-map-heading">
          <div>
            <span className="campus-map-eyebrow">Территория колледжа</span>
            <h2>Выберите корпус</h2>
          </div>
          <p>Нажмите на здание, чтобы открыть этажи и кабинеты.</p>
        </div>

        <div className="campus-site-map">
          <div className="campus-road campus-road-horizontal" aria-hidden="true" />
          <div className="campus-road campus-road-vertical" aria-hidden="true" />
          <div className="campus-yard" aria-hidden="true">Двор колледжа</div>

          {Object.entries(BUILDINGS).map(([building, config]) => {
            const freeCount = hasData ? result.rooms[building]?.length || 0 : null
            const totalCount = roomsData[building]?.length || 0

            return (
              <button
                key={building}
                className={`campus-building campus-building-${config.slug}`}
                onClick={() => openBuilding(building)}
                aria-label={`Открыть корпус ${building}`}
              >
                <span className="campus-building-letter">{building}</span>
                <span className="campus-building-name">{config.name}</span>
                <span className="campus-building-status">
                  {hasData ? `Свободно ${freeCount} из ${totalCount}` : 'Статус неизвестен'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="campus-map-legend" aria-label="Обозначения карты">
          <span><i className="legend-dot free" />Свободен</span>
          <span><i className="legend-dot occupied" />Занят</span>
          <span><i className="legend-dot unknown" />Нет данных</span>
        </div>
      </section>
    )
  }

  const building = BUILDINGS[selectedBuilding]
  const topRooms = floorRooms.slice(0, Math.ceil(floorRooms.length / 2))
  const bottomRooms = floorRooms.slice(Math.ceil(floorRooms.length / 2))
  const selectedRoomStatus = selectedRoom
    ? getRoomStatus(selectedRoom, result, hasData)
    : null

  const renderRoom = (room) => {
    const status = getRoomStatus(room, result, hasData)
    return (
      <button
        key={room}
        className={`floor-room ${status} ${selectedRoom === room ? 'selected' : ''}`}
        onClick={() => setSelectedRoom(room)}
        aria-pressed={selectedRoom === room}
      >
        <span>{room}</span>
        <small>{getStatusLabel(status)}</small>
      </button>
    )
  }

  return (
    <section className="campus-floor-section" aria-label={`Корпус ${selectedBuilding}`}>
      <div className="campus-floor-header">
        <button
          className="campus-map-back"
          onClick={() => {
            setSelectedBuilding('')
            setSelectedRoom('')
          }}
        >
          <IoArrowBackOutline aria-hidden="true" />
          Все корпуса
        </button>
        <div className="campus-floor-title">
          <span>Корпус {selectedBuilding}</span>
          <h2>{building.name}</h2>
        </div>
      </div>

      <div className="floor-tabs" aria-label="Выбор этажа">
        {building.floors.map((floor) => (
          <button
            key={floor}
            className={selectedFloor === floor ? 'active' : ''}
            onClick={() => {
              setSelectedFloor(floor)
              setSelectedRoom('')
            }}
          >
            {floor === 0 ? 'Цоколь' : `${floor}-й этаж`}
          </button>
        ))}
      </div>

      <div className="floor-plan-heading">
        <div>
          <IoLayersOutline aria-hidden="true" />
          <strong>{getFloorLabel(selectedFloor)}</strong>
        </div>
        <span>{floorRooms.length} кабинет(ов)</span>
      </div>

      {floorRooms.length ? (
        <div className="floor-plan">
          <div className="floor-room-row top">{topRooms.map(renderRoom)}</div>
          <div className="floor-corridor">
            <span>Коридор</span>
            <i aria-hidden="true" />
            <span>{selectedFloor === 0 ? 'Лестница наверх' : 'Лестница / выход'}</span>
          </div>
          <div className="floor-room-row bottom">{bottomRooms.map(renderRoom)}</div>
        </div>
      ) : (
        <div className="floor-no-rooms">
          На этом этаже пока нет кабинетов в справочнике.
        </div>
      )}

      {selectedRoom && (
        <div className={`selected-room-card ${selectedRoomStatus}`} aria-live="polite">
          <div className="selected-room-icon"><IoLocationOutline aria-hidden="true" /></div>
          <div>
            <span>Кабинет</span>
            <strong>{selectedRoom}</strong>
            <p>{getStatusLabel(selectedRoomStatus)} · {getFloorLabel(selectedFloor)}</p>
          </div>
          {result.currentBell && selectedRoomStatus === 'occupied' && (
            <small>Текущая пара: {result.currentBell.time}</small>
          )}
        </div>
      )}

      <p className="floor-plan-note">
        Кабинеты расположены по порядку номеров. Точные стороны коридора можно уточнить по
        планам этажей.
      </p>
    </section>
  )
}

export default CampusRoomMap
