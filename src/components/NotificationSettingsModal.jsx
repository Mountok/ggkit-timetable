import { useEffect, useMemo, useState } from 'react'
import { IoCheckmarkCircle, IoClose, IoDownloadOutline, IoNotificationsOutline } from 'react-icons/io5'
import {
  areLessonNotificationsEnabled,
  getMobilePlatform,
  getNotificationPermission,
  isNotificationSupported,
  isStandaloneApp,
  requestLessonNotificationPermission,
  setLessonNotificationsEnabled,
  showAppNotification,
} from '../utils/lessonNotifications'

const NotificationSettingsModal = ({ isOpen, onClose, installPrompt, onInstall, groupName }) => {
  const [permission, setPermission] = useState('default')
  const [enabled, setEnabled] = useState(false)
  const [standalone, setStandalone] = useState(false)
  const [message, setMessage] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  const platform = useMemo(() => getMobilePlatform(), [])
  const supported = isNotificationSupported()
  const isMobile = platform === 'ios' || platform === 'android'
  const mustInstallFirst = isMobile && !standalone

  useEffect(() => {
    if (!isOpen) return

    setPermission(getNotificationPermission())
    setEnabled(areLessonNotificationsEnabled())
    setStandalone(isStandaloneApp())
    setMessage('')
  }, [isOpen])

  if (!isOpen) return null

  const handleEnable = async () => {
    setIsRequesting(true)
    setMessage('')

    try {
      const result = await requestLessonNotificationPermission()
      setPermission(result)

      if (result === 'granted') {
        setLessonNotificationsEnabled(true)
        setEnabled(true)
        setMessage('Готово! Напоминания для выбранной группы включены.')
        await showAppNotification('Уведомления включены', {
          body: `Группа ${groupName}. Напомним о паре за 5 минут до её начала.`,
          tag: 'notifications-enabled',
          data: { url: '/' },
        })
      } else if (result === 'denied') {
        setLessonNotificationsEnabled(false)
        setEnabled(false)
        setMessage('Доступ запрещён. Разрешите уведомления в настройках браузера или телефона.')
      } else {
        setMessage('Разрешение не было выдано. Нажмите кнопку ещё раз, когда будете готовы.')
      }
    } catch (error) {
      console.error('Не удалось включить уведомления:', error)
      setMessage('Не удалось включить уведомления. Проверьте настройки браузера и повторите попытку.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleDisable = () => {
    setLessonNotificationsEnabled(false)
    setEnabled(false)
    setMessage('Напоминания отключены.')
  }

  const handleInstall = async () => {
    setMessage('')
    const installed = await onInstall()
    if (!installed) {
      setMessage('Если окно установки не появилось, воспользуйтесь инструкцией ниже.')
    }
  }

  return (
    <div className="notification-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="notification-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="notification-modal-header">
          <div className="notification-title-wrap">
            <span className="notification-title-icon"><IoNotificationsOutline /></span>
            <div>
              <h2 id="notification-title">Уведомления о парах</h2>
              <p>Для группы {groupName}</p>
            </div>
          </div>
          <button className="notification-close" onClick={onClose} aria-label="Закрыть">
            <IoClose />
          </button>
        </div>

        <div className="notification-modal-body">
          <div className="notification-benefit">
            <strong>Напомним за 5 минут до начала пары</strong>
            <span>В уведомлении будут указаны номер пары, предмет и аудитория.</span>
          </div>

          <div className="notification-steps">
            <article className={`notification-step ${standalone ? 'complete' : ''}`}>
              <span className="notification-step-number">{standalone ? <IoCheckmarkCircle /> : '1'}</span>
              <div>
                <h3>Добавьте приложение на главный экран</h3>
                {platform === 'ios' ? (
                  <p>
                    В Safari нажмите «Поделиться» <span aria-hidden="true">□↑</span>, выберите
                    «На экран „Домой“», затем нажмите «Добавить».
                  </p>
                ) : platform === 'android' ? (
                  <p>
                    Откройте меню браузера <span aria-hidden="true">⋮</span> и выберите
                    «Установить приложение» или «Добавить на главный экран».
                  </p>
                ) : (
                  <p>Установите приложение через значок установки в адресной строке браузера.</p>
                )}

                {!standalone && installPrompt && (
                  <button className="notification-install-btn" onClick={handleInstall}>
                    <IoDownloadOutline />
                    Установить приложение
                  </button>
                )}
                {standalone && <p className="notification-step-status">Приложение открыто с главного экрана.</p>}
              </div>
            </article>

            <article className={`notification-step ${enabled ? 'complete' : ''}`}>
              <span className="notification-step-number">{enabled ? <IoCheckmarkCircle /> : '2'}</span>
              <div>
                <h3>Разрешите уведомления</h3>
                <p>
                  После установки откройте приложение с нового значка, снова зайдите в этот раздел
                  и нажмите кнопку ниже.
                </p>

                {mustInstallFirst ? (
                  <>
                    <button className="notification-enable-btn" disabled>
                      <IoNotificationsOutline />
                      Разрешить уведомления
                    </button>
                    <p className="notification-hint">
                      Сначала установите приложение и откройте его с главного экрана.
                    </p>
                  </>
                ) : !supported ? (
                  <p className="notification-error">
                    Этот браузер не поддерживает уведомления или сайт открыт без защищённого соединения HTTPS.
                  </p>
                ) : permission === 'denied' ? (
                  <p className="notification-error">
                    Уведомления заблокированы. Разрешите их в настройках сайта или телефона, затем откройте приложение снова.
                  </p>
                ) : enabled ? (
                  <button className="notification-disable-btn" onClick={handleDisable}>Отключить уведомления</button>
                ) : (
                  <button
                    className="notification-enable-btn"
                    onClick={handleEnable}
                    disabled={mustInstallFirst || isRequesting}
                  >
                    <IoNotificationsOutline />
                    {isRequesting ? 'Запрашиваем разрешение…' : 'Разрешить уведомления'}
                  </button>
                )}
              </div>
            </article>
          </div>

          {message && <div className="notification-message" role="status">{message}</div>}

          <div className="notification-limit">
            <strong>Важно</strong>
            <p>
              Сейчас напоминания работают, пока сайт или установленное приложение открыто.
              Для уведомлений при полностью закрытом приложении потребуется подключение push-сервиса.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotificationSettingsModal
