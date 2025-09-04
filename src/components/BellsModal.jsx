import React, { useState, useEffect } from 'react';
import bellsData from '../data/bells.json';

const BellsModal = ({ isOpen, onClose }) => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterTime, setFilterTime] = useState('');

  // Автоматическое определение текущего дня недели
  const getCurrentDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  useEffect(() => {
    if (isOpen) {
      // Устанавливаем текущий день недели при открытии
      const currentDay = getCurrentDayOfWeek();
      if (currentDay !== 'sunday') { // Воскресенье не входит в расписание
        setSelectedDay(currentDay);
      }
      
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const getCurrentPair = () => {
    const currentSchedule = bellsData[selectedDay];
    if (!currentSchedule) return null;

    const now = currentTime;
    const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (let i = 0; i < currentSchedule.schedule.length; i++) {
      const pair = currentSchedule.schedule[i];
      const [startTime, endTime] = pair.time.split(' – ');
      
      if (currentTimeString >= startTime && currentTimeString <= endTime) {
        return i;
      }
    }
    return null;
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredSchedule = () => {
    if (!filterTime) return bellsData[selectedDay]?.schedule || [];
    
    return bellsData[selectedDay]?.schedule.filter(pair => 
      pair.time.includes(filterTime) || 
      pair.pairNumber === filterTime ||
      pair.lessonNumbers.includes(filterTime)
    ) || [];
  };

  const currentPairIndex = getCurrentPair();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            margin: 0,
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            Расписание звонков
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Current Time Display */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            Текущее время: {formatTime(currentTime)}
          </div>
          {currentPairIndex !== null && (
            <div style={{
              fontSize: '1rem',
              color: '#059669',
              fontWeight: 500
            }}>
              Сейчас идет: {bellsData[selectedDay].schedule[currentPairIndex].pairNumber} пара
            </div>
          )}
        </div>

        {/* Day Selector */}
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            fontSize: '1rem'
          }}>
            Выберите день недели:
          </label>
          <div style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                padding: '0.875rem 3rem 0.875rem 1.25rem',
                borderRadius: '1rem',
                border: '2px solid #e5e7eb',
                fontSize: '1rem',
                minWidth: '280px',
                backgroundColor: 'white',
                color: '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.3s ease-in-out',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2310b981%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem auto',
                paddingRight: '3rem'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15), 0 8px 25px rgba(16, 185, 129, 0.2)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                e.target.style.transform = 'translateY(0)';
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.target) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }
              }}
            >
              <option value="monday" style={{ padding: '0.5rem', fontWeight: '600' }}>Понедельник</option>
              <option value="tuesday" style={{ padding: '0.5rem', fontWeight: '600' }}>Вторник</option>
              <option value="wednesday" style={{ padding: '0.5rem', fontWeight: '600' }}>Среда</option>
              <option value="thursday" style={{ padding: '0.5rem', fontWeight: '600' }}>Четверг</option>
              <option value="friday" style={{ padding: '0.5rem', fontWeight: '600' }}>Пятница</option>
              <option value="saturday" style={{ padding: '0.5rem', fontWeight: '600' }}>Суббота</option>
            </select>
          </div>
        </div>

        {/* Filter Input */}
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#374151'
          }}>
            Фильтр (время, номер пары или урока):
          </label>
          <input
            type="text"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            placeholder="Например: 09:00, 1, 2,3"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '2px solid #e5e7eb',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '350px',
              backgroundColor: 'white',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              ':focus': {
                borderColor: '#10b981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
              }
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#10b981';
              e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}
          />
        </div>

        {/* Schedule Table */}
        <div style={{
          overflow: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  № пары
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  № урока
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Время
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Перерыв
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule().map((pair, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: currentPairIndex === index ? '#fef3c7' : 'white',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                >
                  <td style={{
                    padding: '1rem',
                    fontWeight: currentPairIndex === index ? 700 : 500,
                    color: currentPairIndex === index ? '#92400e' : '#374151'
                  }}>
                    {pair.pairNumber}
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280'
                  }}>
                    {pair.lessonNumbers}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    {pair.time}
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280'
                  }}>
                    {pair.break}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Institution Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <div>ГБПОУ «Грозненский государственный колледж информационных технологий»</div>
          <div>Министерство образования и науки Чеченской Республики</div>
        </div>
      </div>
    </div>
  );
};

export default BellsModal;
