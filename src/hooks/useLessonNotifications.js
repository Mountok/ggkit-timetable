import { useEffect } from 'react'
import {
  checkLessonReminder,
  notificationSettingsChangedEvent,
} from '../utils/lessonNotifications'

const CHECK_INTERVAL_MS = 15_000

const useLessonNotifications = (groupName) => {
  useEffect(() => {
    if (!groupName) return undefined

    let isChecking = false

    const check = async () => {
      if (isChecking) return
      isChecking = true
      try {
        await checkLessonReminder(groupName)
      } catch (error) {
        console.error('Не удалось проверить уведомления о парах:', error)
      } finally {
        isChecking = false
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void check()
    }

    void check()
    const intervalId = window.setInterval(check, CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener(notificationSettingsChangedEvent, check)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener(notificationSettingsChangedEvent, check)
    }
  }, [groupName])
}

export default useLessonNotifications
