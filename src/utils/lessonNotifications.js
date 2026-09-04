import bellsData from '../data/bells.json'
import scheduleData from '../data/schedule.json'

export const NOTIFICATIONS_ENABLED_KEY = 'lessonNotificationsEnabled'
const NOTIFICATION_HISTORY_KEY = 'lessonNotificationHistory'
const SETTINGS_CHANGED_EVENT = 'lesson-notification-settings-changed'
const REMINDER_MINUTES = 5

const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const getDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getScheduleDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

const getStartTime = (timeRange) => timeRange.split(/[–—-]/)[0]?.trim()

const setTime = (date, time) => {
  const [hours, minutes] = time.split(':').map(Number)
  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

const getLessonNumbers = (value) =>
  String(value)
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter(Number.isFinite)

const getPairLabel = (pairNumber) => {
  const number = Number.parseInt(pairNumber, 10)
  return Number.isFinite(number) ? `${number}-я пара` : String(pairNumber).toLowerCase()
}

const readHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem(NOTIFICATION_HISTORY_KEY) || '[]')
    return Array.isArray(history) ? history : []
  } catch {
    return []
  }
}

const hasBeenSent = (id) => readHistory().some((item) => item.id === id)

const rememberNotification = (id, dateKey) => {
  const recentHistory = readHistory().filter((item) => item.dateKey >= dateKey)
  recentHistory.push({ id, dateKey })
  localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(recentHistory.slice(-50)))
}

export const isNotificationSupported = () =>
  'Notification' in window && 'serviceWorker' in navigator && window.isSecureContext

export const isStandaloneApp = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

export const getMobilePlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (isIOS) return 'ios'
  if (/android/.test(userAgent)) return 'android'
  return 'other'
}

export const getNotificationPermission = () => {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export const areLessonNotificationsEnabled = () =>
  localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) === 'true' && getNotificationPermission() === 'granted'

export const setLessonNotificationsEnabled = (enabled) => {
  localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled))
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT))
}

export const requestLessonNotificationPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.requestPermission()
}

export const showAppNotification = async (title, options = {}) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return false

  const registration = await navigator.serviceWorker.ready
  await registration.showNotification(title, {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    ...options,
  })
  return true
}

const getDueReminder = (groupName, now) => {
  const group = scheduleData.groups.find((item) => item.name === groupName)
  const dayKey = dayKeys[now.getDay()]
  const bells = bellsData[dayKey]
  const scheduledDay = group?.days.find((day) => day.name === bells?.day)
  const lessons = scheduledDay?.lessons || []

  if (!group || !bells || lessons.length === 0) return null
  if (scheduledDay.date && scheduledDay.date !== getScheduleDate(now)) return null

  for (const pair of bells.schedule) {
    const startTime = getStartTime(pair.time)
    if (!startTime) continue

    const startsAt = setTime(now, startTime)
    const remindAt = new Date(startsAt.getTime() - REMINDER_MINUTES * 60_000)

    if (now < remindAt || now >= startsAt) continue

    const lessonNumbers = getLessonNumbers(pair.lessonNumbers)
    const lesson = lessonNumbers
      .map((number) => lessons.find((item) => item.lessonNum === number))
      .find(Boolean)

    if (!lesson) continue

    const dateKey = getDateKey(now)
    return {
      id: `${dateKey}|${groupName}|${pair.pairNumber}|${startTime}`,
      dateKey,
      title: `Через 5 минут начнётся ${getPairLabel(pair.pairNumber)}`,
      body: `${lesson.subject}. Аудитория: ${lesson.room || 'не указана'}`,
      tag: `lesson-${dateKey}-${groupName}-${pair.pairNumber}`,
    }
  }

  return null
}

export const checkLessonReminder = async (groupName) => {
  if (!groupName || !areLessonNotificationsEnabled()) return false

  const reminder = getDueReminder(groupName, new Date())
  if (!reminder || hasBeenSent(reminder.id)) return false

  const shown = await showAppNotification(reminder.title, {
    body: reminder.body,
    tag: reminder.tag,
    renotify: false,
    data: { url: '/' },
  })

  if (shown) rememberNotification(reminder.id, reminder.dateKey)
  return shown
}

export const notificationSettingsChangedEvent = SETTINGS_CHANGED_EVENT
