import { useState, useEffect } from 'react'
import { IoSchoolOutline, IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoPersonOutline, IoSearchOutline, IoQrCodeOutline } from 'react-icons/io5'
import './App.css'
import scheduleData from './data/schedule.json'
import { useNavigate } from 'react-router-dom'
import BellsModal from './components/BellsModal'

function App() {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isGroupSelectorOpen, setIsGroupSelectorOpen] = useState(false)
  const [isBellsModalOpen, setIsBellsModalOpen] = useState(false)
  const navigate = useNavigate()

  // Получить текущий день недели
  const getCurrentDay = () => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    const today = new Date().getDay()
    return days[today]
  }

  // Загрузка сохраненной группы из localStorage
  useEffect(() => {
    const savedGroup = localStorage.getItem('selectedGroup')
    if (savedGroup) {
      setSelectedGroup(savedGroup)
    } else {
      setIsGroupSelectorOpen(true)
    }
    setSelectedDay(getCurrentDay())
  }, [])

  // Сохранение выбранной группы в localStorage
  const handleGroupSelect = (groupName) => {
    setSelectedGroup(groupName)
    localStorage.setItem('selectedGroup', groupName)
    setIsGroupSelectorOpen(false)
    setSearchTerm('')
  }

  const openShare = () => {
    navigate('/share')
  }

  // Фильтрация групп по поисковому запросу
  const filteredGroups = scheduleData.groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Получить данные выбранной группы
  const selectedGroupData = scheduleData.groups.find(group => group.name === selectedGroup)

  // Получить расписание для выбранного дня
  const selectedDaySchedule = selectedGroupData?.days.find(day => day.name === selectedDay)

  const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

  return (
    <div className="app">
      {/* Заголовок */}
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <IoSchoolOutline className="header-icon" />
            <h1>Расписание ГГКИТ</h1>
          </div>
          <div className="header-group">
            {selectedGroup && (
              <>
                <span className="current-group">Группа: {selectedGroup}</span>
                <button 
                  className="change-group-btn"
                  onClick={() => setIsGroupSelectorOpen(true)}
                >
                  Изменить
                </button>
                <button
                  className="share-inline-btn"
                  onClick={() => navigate('/share')}
                  title="Поделиться QR"
                >
                  <IoQrCodeOutline style={{ fontSize: '1.1rem' }} />
                  <span>Поделиться</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Селектор группы */}
      {(isGroupSelectorOpen || !selectedGroup) && (
        <div className="group-selector-overlay">
          <div className="group-selector">
            <h2>Выберите группу</h2>
            <div className="search-box">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                placeholder="Поиск группы..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="groups-list">
              {filteredGroups.map(group => (
                <button
                  key={group.name}
                  className="group-item"
                  onClick={() => handleGroupSelect(group.name)}
                >
                  {group.name}
                </button>
              ))}
            </div>
            {selectedGroup && (
              <button 
                className="close-selector-btn"
                onClick={() => setIsGroupSelectorOpen(false)}
              >
                Закрыть
              </button>
            )}
          </div>
        </div>
      )}

      

      {/* Основной контент */}
      {selectedGroup && !isGroupSelectorOpen && (
        <main className="main-content">
          {/* Навигация по дням */}
          <nav className="day-navigation">
            <div className="day-tabs">
              {dayNames.map(day => {
                const isCurrentDay = day === getCurrentDay()
                const isSelectedDay = day === selectedDay
                return (
                  <button
                    key={day}
                    className={`day-tab ${isSelectedDay ? 'active' : ''} ${isCurrentDay ? 'current' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </nav>
          
          {/* Кнопка расписания звонков */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            padding: '0 1rem'
          }}>
            <button
              className="bells-main-btn"
              onClick={() => setIsBellsModalOpen(true)}
              title="Расписание звонков"
              style={{
                backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease-in-out',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.025em'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              Расписание звонков
            </button>
          </div>

          {/* Расписание */}
          <div className="schedule-container">
            <div className="schedule-header">
              <IoCalendarOutline className="schedule-icon" />
              <h2>{selectedDay}</h2>
            </div>
            
            {selectedDaySchedule?.lessons.length > 0 ? (
              <div className="lessons-grid">
                {selectedDaySchedule.lessons.map((lesson, index) => (
                  <div key={index} className="lesson-card">
                    <div className="lesson-content">
                      <h3 className="lesson-subject">{lesson.subject}</h3>
                      <div className="lesson-details">
                        <div className="lesson-detail">
                          <IoPersonOutline className="detail-icon" />
                          <span>{lesson.teacher}</span>
                        </div>
                        <div className="lesson-detail">
                          <IoLocationOutline className="detail-icon" />
                          <span>{lesson.room}</span>
                        </div>
                        {lesson.time && (
                          <div className="lesson-detail">
                            <IoTimeOutline className="detail-icon" />
                            <span>{lesson.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-lessons">
                <IoCalendarOutline className="no-lessons-icon" />
                <h3>Занятий нет</h3>
                <p>В этот день занятия не запланированы</p>
              </div>
            )}
          </div>
        </main>
      )}
      
      {/* Bells Modal */}
      <BellsModal 
        isOpen={isBellsModalOpen}
        onClose={() => setIsBellsModalOpen(false)}
      />
    </div>
  )
}

export default App
