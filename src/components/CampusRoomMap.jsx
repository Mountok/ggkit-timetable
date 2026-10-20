import { useMemo, useState } from 'react'
import {
  IoArrowBackOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoLocationOutline,
} from 'react-icons/io5'

const BUILDINGS = {
  А: { name: 'Большой корпус', slug: 'a', floors: [0, 1, 2, 3, 4], defaultFloor: 1 },
  Б: { name: 'Средний корпус', slug: 'b', floors: [1, 2, 3, 4], defaultFloor: 1 },
  В: { name: 'Малый корпус', slug: 'v', floors: [1, 2, 3], defaultFloor: 1 },
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

function CampusRoomMap({ roomsData, result, hasData, kiosk = false }) {
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

  const changeFloor = (floor) => {
    if (!selectedBuilding || !BUILDINGS[selectedBuilding].floors.includes(floor)) return
    setSelectedFloor(floor)
    setSelectedRoom('')
  }

  const selectedRoomStatus = selectedRoom
    ? getRoomStatus(selectedRoom, result, hasData)
    : null
  const selectedRoomLessons = selectedRoom ? result.occupancies?.[selectedRoom] || [] : []

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

  const renderCampusOverview = () => (
    <>
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
    </>
  )

  const renderOpenedBuilding = () => {
    const building = BUILDINGS[selectedBuilding]
    const currentFloorIndex = building.floors.indexOf(selectedFloor)
    const floorBelow = building.floors[currentFloorIndex - 1]
    const floorAbove = building.floors[currentFloorIndex + 1]
    const topRooms = floorRooms.slice(0, Math.ceil(floorRooms.length / 2))
    const bottomRooms = floorRooms.slice(Math.ceil(floorRooms.length / 2))

    return (
      <div className={`campus-building-expanded campus-building-expanded-${building.slug}`}>
        <div className="expanded-building-header">
          <button
            className="campus-map-back"
            onClick={() => {
              setSelectedBuilding('')
              setSelectedRoom('')
            }}
          >
            <IoArrowBackOutline aria-hidden="true" />
            Карта корпусов
          </button>

          <div className="expanded-building-title">
            <span>Корпус {selectedBuilding}</span>
            <strong>{building.name}</strong>
          </div>

          <div className="building-quick-switch" aria-label="Переключить корпус">
            {Object.keys(BUILDINGS).map((buildingName) => (
              <button
                key={buildingName}
                className={buildingName === selectedBuilding ? 'active' : ''}
                onClick={() => openBuilding(buildingName)}
              >
                {buildingName}
              </button>
            ))}
          </div>
        </div>

        <div className="expanded-floor-bar">
          <button
            onClick={() => changeFloor(floorBelow)}
            disabled={floorBelow === undefined}
            aria-label="Спуститься на этаж ниже"
          >
            <IoChevronDownOutline aria-hidden="true" />
            Ниже
          </button>
          <div>
            <small>Сейчас открыт</small>
            <strong>{getFloorLabel(selectedFloor)}</strong>
          </div>
          <button
            onClick={() => changeFloor(floorAbove)}
            disabled={floorAbove === undefined}
            aria-label="Подняться на этаж выше"
          >
            Выше
            <IoChevronUpOutline aria-hidden="true" />
          </button>
        </div>

        <div className="expanded-building-body">
          <div className="inline-floor-plan">
            {floorRooms.length ? (
              <>
                <div className="inline-room-row top">{topRooms.map(renderRoom)}</div>
                <div className="inline-corridor">
                  <span>Коридор</span>
                  <div className="interactive-stairs">
                    <span className="stair-steps" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    {floorBelow !== undefined && (
                      <button onClick={() => changeFloor(floorBelow)}>
                        <IoChevronDownOutline aria-hidden="true" />
                        На {floorBelow === 0 ? 'цоколь' : `${floorBelow}-й этаж`}
                      </button>
                    )}
                    {floorAbove !== undefined && (
                      <button onClick={() => changeFloor(floorAbove)}>
                        <IoChevronUpOutline aria-hidden="true" />
                        На {floorAbove}-й этаж
                      </button>
                    )}
                  </div>
                  <span>Выход</span>
                </div>
                <div className="inline-room-row bottom">{bottomRooms.map(renderRoom)}</div>
              </>
            ) : (
              <div className="floor-no-rooms">
                На этом этаже пока нет кабинетов в справочнике.
              </div>
            )}
          </div>

          <aside className={`map-room-details ${selectedRoomStatus || 'empty'}`}>
            {selectedRoom ? (
              <>
                <div className="map-room-details-title">
                  <div className="selected-room-icon"><IoLocationOutline aria-hidden="true" /></div>
                  <div>
                    <span>Кабинет</span>
                    <strong>{selectedRoom}</strong>
                  </div>
                </div>
                <div className={`room-status-badge ${selectedRoomStatus}`}>
                  {getStatusLabel(selectedRoomStatus)}
                </div>

                {selectedRoomLessons.length > 0 ? (
                  <div className="room-current-lessons">
                    <h3>Сейчас проходит</h3>
                    {selectedRoomLessons.map((lesson) => (
                      <div
                        className="room-current-lesson"
                        key={`${lesson.group}-${lesson.subject}-${lesson.teacher}`}
                      >
                        <strong>{lesson.subject}</strong>
                        <span>Группа: {lesson.group}</span>
                        {lesson.teacher && <span>Преподаватель: {lesson.teacher}</span>}
                        {result.currentBell && <span>Время: {result.currentBell.time}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="room-details-message">
                    {selectedRoomStatus === 'free'
                      ? 'В кабинете сейчас нет занятий.'
                      : 'Информация о занятии отсутствует.'}
                  </p>
                )}
                <small>{getFloorLabel(selectedFloor)} · корпус {selectedBuilding}</small>
              </>
            ) : (
              <div className="room-details-placeholder">
                <IoLocationOutline aria-hidden="true" />
                <strong>Выберите кабинет</strong>
                <span>Здесь появятся занятие, группа и преподаватель.</span>
              </div>
            )}
          </aside>
        </div>
      </div>
    )
  }

  return (
    <section
      className={`campus-map-section ${kiosk ? 'kiosk' : ''}`}
      aria-label="Интерактивная карта корпусов"
    >
      {!kiosk && !selectedBuilding && (
        <div className="campus-map-heading">
          <div>
            <span className="campus-map-eyebrow">Территория колледжа</span>
            <h2>Выберите корпус</h2>
          </div>
          <p>Нажмите на здание, чтобы раскрыть его этаж прямо на карте.</p>
        </div>
      )}

      <div className={`campus-site-map ${selectedBuilding ? 'building-open' : ''}`}>
        {selectedBuilding ? renderOpenedBuilding() : renderCampusOverview()}
      </div>

      {!selectedBuilding && (
        <div className="campus-map-legend" aria-label="Обозначения карты">
          <span><i className="legend-dot free" />Свободен</span>
          <span><i className="legend-dot occupied" />Занят</span>
          <span><i className="legend-dot unknown" />Нет данных</span>
        </div>
      )}
    </section>
  )
}

export default CampusRoomMap
