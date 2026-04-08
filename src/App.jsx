import { useState, useEffect } from 'react'
import {
  IoSchoolOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoQrCodeOutline,
} from 'react-icons/io5'
import './App.css'
import scheduleData from './data/schedule.json'
import teachersScheduleData from './data/schedule_teachers.json'
import { useNavigate } from 'react-router-dom'
import BellsModal from './components/BellsModal'

const STORAGE_KEYS = {
  role: 'selectedRole',
  group: 'selectedGroup',
  teacher: 'selectedTeacher',
}

const getLessonNumber = (lesson) => lesson.lessonNum || lesson.number || null

const canMergeLessons = (currentLesson, nextLesson, isTeacherMode) => {
  const currentNumber = getLessonNumber(currentLesson)
  const nextNumber = getLessonNumber(nextLesson)

  if (!currentNumber || !nextNumber || nextNumber !== currentNumber + 1) {
    return false
  }

  if (currentLesson.subject !== nextLesson.subject || currentLesson.room !== nextLesson.room) {
    return false
  }

  if (isTeacherMode) {
    return currentLesson.type === nextLesson.type
  }

  return currentLesson.teacher === nextLesson.teacher
}

const mergeLessonsForDisplay = (lessons, isTeacherMode) => {
  if (!lessons?.length) {
    return []
  }

  return lessons.reduce((mergedLessons, lesson) => {
    const lastLesson = mergedLessons[mergedLessons.length - 1]

    if (lastLesson && canMergeLessons(lastLesson.originalLesson, lesson, isTeacherMode)) {
      const nextNumber = getLessonNumber(lesson)
      const nextTime = lesson.time?.trim()

      lastLesson.endNumber = nextNumber
      lastLesson.originalLesson = lesson

      if (nextTime && !lastLesson.times.includes(nextTime)) {
        lastLesson.times.push(nextTime)
      }

      return mergedLessons
    }

    mergedLessons.push({
      ...lesson,
      startNumber: getLessonNumber(lesson),
      endNumber: getLessonNumber(lesson),
      times: lesson.time?.trim() ? [lesson.time.trim()] : [],
      originalLesson: lesson,
    })

    return mergedLessons
  }, [])
}

const getLessonNumberLabel = (lesson) => {
  if (!lesson.startNumber) {
    return ''
  }

  if (lesson.startNumber === lesson.endNumber) {
    return `${lesson.startNumber} пара`
  }

  return `${lesson.startNumber}-${lesson.endNumber} пара`
}

function App() {
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectorStep, setSelectorStep] = useState('role')
  const [isGroupSelectorOpen, setIsGroupSelectorOpen] = useState(false)
  const [isBellsModalOpen, setIsBellsModalOpen] = useState(false)
  const navigate = useNavigate()

  const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

  const getCurrentDay = () => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    return days[new Date().getDay()]
  }

  useEffect(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.role)
    const savedGroup = localStorage.getItem(STORAGE_KEYS.group)
    const savedTeacher = localStorage.getItem(STORAGE_KEYS.teacher)
    const hasSavedGroup = scheduleData.groups.some((group) => group.name === savedGroup)
    const hasSavedTeacher = teachersScheduleData.teachers.some((teacher) => teacher.name === savedTeacher)

    setSelectedDay(getCurrentDay())

    if (savedRole === 'student' && savedGroup && hasSavedGroup) {
      setSelectedRole('student')
      setSelectedGroup(savedGroup)
      setSelectorStep('student')
      return
    }

    if (savedRole === 'teacher' && savedTeacher && hasSavedTeacher) {
      setSelectedRole('teacher')
      setSelectedTeacher(savedTeacher)
      setSelectorStep('teacher')
      return
    }

    setIsGroupSelectorOpen(true)
    setSelectorStep('role')
  }, [])

  const isTeacherMode = selectedRole === 'teacher'
  const activeSelection = isTeacherMode ? selectedTeacher : selectedGroup
  const activeLabel = isTeacherMode ? 'Преподаватель' : 'Группа'
  const activeScheduleData = isTeacherMode ? teachersScheduleData.teachers : scheduleData.groups
  const activeEntityData = activeScheduleData.find((item) => item.name === activeSelection)
  const selectedDaySchedule = activeEntityData?.days.find((day) => day.name === selectedDay)
  const mergedLessons = mergeLessonsForDisplay(selectedDaySchedule?.lessons || [], isTeacherMode)
  const shouldShowSelector = isGroupSelectorOpen || !activeSelection

  const filteredGroups = scheduleData.groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTeachers = teachersScheduleData.teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openSelector = (step) => {
    setSearchTerm('')
    setSelectorStep(step)
    setIsGroupSelectorOpen(true)
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    localStorage.setItem(STORAGE_KEYS.role, role)
    setSearchTerm('')
    setSelectorStep(role)
  }

  const handleGroupSelect = (groupName) => {
    setSelectedRole('student')
    setSelectedGroup(groupName)
    setSelectedTeacher('')
    localStorage.setItem(STORAGE_KEYS.role, 'student')
    localStorage.setItem(STORAGE_KEYS.group, groupName)
    localStorage.removeItem(STORAGE_KEYS.teacher)
    setIsGroupSelectorOpen(false)
    setSearchTerm('')
  }

  const handleTeacherSelect = (teacherName) => {
    setSelectedRole('teacher')
    setSelectedTeacher(teacherName)
    setSelectedGroup('')
    localStorage.setItem(STORAGE_KEYS.role, 'teacher')
    localStorage.setItem(STORAGE_KEYS.teacher, teacherName)
    localStorage.removeItem(STORAGE_KEYS.group)
    setIsGroupSelectorOpen(false)
    setSearchTerm('')
  }

  const roleDescription =
    selectorStep === 'teacher'
      ? 'Выберите преподавателя из списка, чтобы посмотреть его расписание.'
      : 'Выберите группу, чтобы открыть расписание студентов.'

  const searchPlaceholder = selectorStep === 'teacher' ? 'Поиск преподавателя...' : 'Поиск группы...'
  const selectorItems = selectorStep === 'teacher' ? filteredTeachers : filteredGroups

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <IoSchoolOutline className="header-icon" />
            <h1>Расписание ГГКИТ</h1>
          </div>
          <div className="header-group">
            {activeSelection && (
              <>
                <span className="current-role">{isTeacherMode ? 'Преподаватель' : 'Студент'}</span>
                <span className="current-group">
                  {activeLabel}: {activeSelection}
                </span>
                <button className="change-group-btn" onClick={() => openSelector(selectedRole)}>
                  Изменить
                </button>
                <button className="secondary-header-btn" onClick={() => openSelector('role')}>
                  Сменить роль
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

      {shouldShowSelector && (
        <div className="group-selector-overlay">
          <div className="group-selector">
            {selectorStep === 'role' ? (
              <>
                <h2>Кто будет смотреть расписание?</h2>
                <p className="selector-description">
                  Сначала выберите режим приложения: для студентов или для преподавателей.
                </p>

                <div className="role-options">
                  <button
                    className={`role-card ${selectedRole === 'student' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('student')}
                  >
                    <IoSchoolOutline className="role-card-icon" />
                    <span className="role-card-title">Студент</span>
                    <span className="role-card-text">Выбор группы и привычный экран расписания.</span>
                  </button>

                  <button
                    className={`role-card ${selectedRole === 'teacher' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('teacher')}
                  >
                    <IoPersonOutline className="role-card-icon" />
                    <span className="role-card-title">Преподаватель</span>
                    <span className="role-card-text">Выбор ФИО преподавателя и его расписание.</span>
                  </button>
                </div>

                {activeSelection && (
                  <button className="close-selector-btn" onClick={() => setIsGroupSelectorOpen(false)}>
                    Закрыть
                  </button>
                )}
              </>
            ) : (
              <>
                <h2>{selectorStep === 'teacher' ? 'Выберите преподавателя' : 'Выберите группу'}</h2>
                <p className="selector-description">{roleDescription}</p>

                <div className="search-box">
                  <IoSearchOutline className="search-icon" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="groups-list">
                  {selectorItems.length > 0 ? (
                    selectorItems.map((item) => (
                      <button
                        key={item.name}
                        className="group-item"
                        onClick={() =>
                          selectorStep === 'teacher'
                            ? handleTeacherSelect(item.name)
                            : handleGroupSelect(item.name)
                        }
                      >
                        {item.name}
                      </button>
                    ))
                  ) : (
                    <div className="empty-selector-state">Ничего не найдено по текущему запросу.</div>
                  )}
                </div>

                <div className="selector-actions">
                  <button
                    className="secondary-selector-btn"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectorStep('role')
                    }}
                  >
                    Сменить роль
                  </button>
                  {activeSelection && (
                    <button className="close-selector-btn close-selector-btn-inline" onClick={() => setIsGroupSelectorOpen(false)}>
                      Закрыть
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeSelection && !isGroupSelectorOpen && (
        <main className="main-content">
          <nav className="day-navigation">
            <div className="day-tabs">
              {dayNames.map((day) => {
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              padding: '0 1rem',
            }}
          >
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
                letterSpacing: '0.025em',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)'
                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)'
                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              Расписание звонков
            </button>
          </div>

          <div className="schedule-container">
            <div className="schedule-header">
              <IoCalendarOutline className="schedule-icon" />
              <div className="schedule-header-text">
                <h2>{selectedDay}</h2>
                {selectedDaySchedule?.date && <p className="schedule-meta">Дата: {selectedDaySchedule.date}</p>}
                {isTeacherMode && activeEntityData?.period && (
                  <p className="schedule-meta">Период: {activeEntityData.period}</p>
                )}
              </div>
            </div>

            {mergedLessons.length > 0 ? (
              <div className="lessons-grid">
                {mergedLessons.map((lesson, index) => {
                  const lessonNumberLabel = getLessonNumberLabel(lesson)
                  const lessonTime = lesson.times?.join(' / ')

                  return (
                    <div key={index} className="lesson-card">
                      <div className="lesson-content">
                        {lessonNumberLabel && <div className="lesson-number">{lessonNumberLabel}</div>}
                        <h3 className="lesson-subject">{lesson.subject}</h3>
                        <div className="lesson-details">
                          {!isTeacherMode && lesson.teacher && (
                            <div className="lesson-detail">
                              <IoPersonOutline className="detail-icon" />
                              <span>{lesson.teacher}</span>
                            </div>
                          )}
                          {lesson.room && (
                            <div className="lesson-detail">
                              <IoLocationOutline className="detail-icon" />
                              <span>{lesson.room}</span>
                            </div>
                          )}
                          {isTeacherMode && lesson.type && (
                            <div className="lesson-detail">
                              <IoSchoolOutline className="detail-icon" />
                              <span>{lesson.type}</span>
                            </div>
                          )}
                          {!isTeacherMode && lessonTime && (
                            <div className="lesson-detail">
                              <IoTimeOutline className="detail-icon" />
                              <span>{lessonTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
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

      <BellsModal isOpen={isBellsModalOpen} onClose={() => setIsBellsModalOpen(false)} />
    </div>
  )
}

export default App
