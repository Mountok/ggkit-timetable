export const COLLEGE_TIME_ZONE = 'Europe/Moscow'

const BUILDINGS = ['А', 'Б', 'В']

const WEEKDAY_KEYS = {
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
  Sunday: 'sunday',
}

const STATUS_LABELS = {
  lesson: 'Сейчас идут занятия',
  break: 'Сейчас перемена',
  before: 'Занятия ещё не начались',
  after: 'Занятия на сегодня закончились',
  'non-working-day': 'Сегодня выходной',
  'no-data': 'Нет данных о расписании на текущую дату',
}

const getTimeZoneParts = (date, timeZone = COLLEGE_TIME_ZONE) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )
}

const timeToMinutes = (value) => {
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null

  return Number(match[1]) * 60 + Number(match[2])
}

const getBellRange = (bell) => {
  const [startValue, endValue] = String(bell.time || '').split(/[–—-]/).map((value) => value.trim())
  const start = timeToMinutes(startValue)
  const end = timeToMinutes(endValue)

  return start === null || end === null ? null : { start, end }
}

const emptyBuildings = () => Object.fromEntries(BUILDINGS.map((building) => [building, []]))

const normalizeRoomsData = (roomsData) => {
  const normalized = emptyBuildings()

  for (const building of BUILDINGS) {
    const rooms = Array.isArray(roomsData?.[building]) ? roomsData[building] : []
    normalized[building] = [...new Set(rooms.map(normalizeRoom).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'ru', { numeric: true }),
    )
  }

  return normalized
}

const getAllRooms = (roomsByBuilding) => Object.values(roomsByBuilding).flat()

const getLessonNumbers = (bell) =>
  String(bell.lessonNumbers || '')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter(Number.isFinite)

const findDayByDate = (entity, date) => entity.days?.find((day) => day.date === date)

const getRoomOccupancies = (scheduleData, date, lessonNumbers) => {
  const occupancies = {}
  const seen = new Set()
  const activeNumbers = new Set(lessonNumbers)

  for (const group of scheduleData?.groups || []) {
    const day = findDayByDate(group, date)
    if (!day) continue

    for (const lesson of day.lessons || []) {
      const lessonNumber = Number(lesson.lessonNum ?? lesson.number)
      if (!activeNumbers.has(lessonNumber)) continue

      const room = normalizeRoom(lesson.room)
      if (!room) continue

      const occupancy = {
        group: group.name,
        subject: lesson.subject || 'Занятие',
        teacher: lesson.teacher || '',
        lessonNumber,
      }
      const key = `${room}|${occupancy.group}|${occupancy.subject}|${occupancy.teacher}`
      if (seen.has(key)) continue

      seen.add(key)
      if (!occupancies[room]) occupancies[room] = []
      occupancies[room].push(occupancy)
    }
  }

  return occupancies
}

const getNextBell = (bells, currentMinutes) =>
  bells.find((bell) => {
    const range = getBellRange(bell)
    return range && range.start > currentMinutes
  }) || null

export const normalizeRoom = (value) => {
  if (!value) return null

  let room = String(value)
    .trim()
    .toUpperCase()
    .replaceAll(' ', '')
    .replace(/^A/, 'А')
    .replace(/^B/, 'Б')
    .replace(/^V/, 'В')

  const reversedRoom = room.match(/^(\d+)([АБВ])$/)
  if (reversedRoom) room = `${reversedRoom[2]}${reversedRoom[1]}`

  return /^[АБВ]\d+$/.test(room) ? room : null
}

export const getFreeRoomsAt = ({
  now = new Date(),
  scheduleData,
  bellsData,
  roomsData,
  timeZone = COLLEGE_TIME_ZONE,
}) => {
  const parts = getTimeZoneParts(now, timeZone)
  const date = `${parts.day}.${parts.month}.${parts.year}`
  const time = `${parts.hour}:${parts.minute}`
  const currentMinutes = Number(parts.hour) * 60 + Number(parts.minute)
  const weekdayKey = WEEKDAY_KEYS[parts.weekday]
  const roomsByBuilding = normalizeRoomsData(roomsData)
  const allRooms = getAllRooms(roomsByBuilding)

  const baseResult = {
    date,
    time,
    weekdayKey,
    rooms: roomsByBuilding,
    occupiedRooms: [],
    occupancies: {},
    totalRooms: allRooms.length,
    freeRoomsCount: allRooms.length,
    currentBell: null,
    nextBell: null,
  }

  if (weekdayKey === 'sunday') {
    return {
      ...baseResult,
      status: 'non-working-day',
      statusLabel: STATUS_LABELS['non-working-day'],
    }
  }

  const hasScheduleForDate = (scheduleData?.groups || []).some((group) => findDayByDate(group, date))
  if (!hasScheduleForDate) {
    return {
      ...baseResult,
      status: 'no-data',
      statusLabel: STATUS_LABELS['no-data'],
      rooms: emptyBuildings(),
      freeRoomsCount: 0,
    }
  }

  const bells = bellsData?.[weekdayKey]?.schedule || []
  const bellsWithRanges = bells
    .map((bell) => ({ bell, range: getBellRange(bell) }))
    .filter((item) => item.range)
  const current = bellsWithRanges.find(
    ({ range }) => currentMinutes >= range.start && currentMinutes < range.end,
  )

  if (current) {
    const occupancies = getRoomOccupancies(scheduleData, date, getLessonNumbers(current.bell))
    const occupiedRooms = new Set(Object.keys(occupancies))
    const freeRooms = Object.fromEntries(
      BUILDINGS.map((building) => [
        building,
        roomsByBuilding[building].filter((room) => !occupiedRooms.has(room)),
      ]),
    )

    return {
      ...baseResult,
      status: 'lesson',
      statusLabel: STATUS_LABELS.lesson,
      rooms: freeRooms,
      occupiedRooms: [...occupiedRooms].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true })),
      occupancies,
      freeRoomsCount: getAllRooms(freeRooms).length,
      currentBell: current.bell,
      nextBell: getNextBell(bells, currentMinutes),
    }
  }

  const firstRange = bellsWithRanges[0]?.range
  const lastRange = bellsWithRanges[bellsWithRanges.length - 1]?.range
  let status = 'break'

  if (!firstRange || currentMinutes < firstRange.start) status = 'before'
  else if (currentMinutes >= lastRange.end) status = 'after'

  return {
    ...baseResult,
    status,
    statusLabel: STATUS_LABELS[status],
    nextBell: getNextBell(bells, currentMinutes),
  }
}
