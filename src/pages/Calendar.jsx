import { useState } from 'react'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, X, Trash2, Check, Edit3 } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

export default function Calendar() {
  const { events, tasks, addEvent, updateEvent, deleteEvent, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  
  const EVENT_TYPES = [
    { value: 'wedding', label: t('wedding') || 'Wedding', color: '#ec4899' },
    { value: 'appointment', label: t('appointment') || 'Appointment', color: '#8b5cf6' },
    { value: 'birthday', label: t('birthday') || 'Birthday', color: '#f59e0b' },
    { value: 'anniversary', label: t('anniversary') || 'Anniversary', color: '#ef4444' },
    { value: 'travel', label: t('travel') || 'Travel', color: '#06b6d4' },
    { value: 'other', label: t('other') || 'Other', color: '#6b7280' },
  ]
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'other', time: '', allDay: true, notes: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  const monthNames = [t('january'), t('february'), t('march'), t('april'), t('may'), t('june'), t('july'), t('august'), t('september'), t('october'), t('november'), t('december')]
  
  const getDayNames = () => {
    switch(settings.language) {
      case 'es':
        return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      case 'fr':
        return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      case 'de':
        return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
      case 'it':
        return ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
      case 'pt':
        return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
      case 'en':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      default:
        return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    }
  }
  const dayNames = getDayNames()
  
  const getLocale = () => {
    const localeMap = {
      tr: 'tr-TR',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-PT',
      ru: 'ru-RU',
      ar: 'ar-SA',
      zh: 'zh-CN'
    }
    return localeMap[settings.language] || 'tr-TR'
  }

  const getEventsForDate = (date) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    const dayEvents = events.filter(e => e.date === dateStr)
    const dayTasks = tasks.filter(t => t.dueDate === dateStr && !t.completed)
    return { events: dayEvents, tasks: dayTasks }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newEvent.title.trim() && newEvent.date) {
      const eventType = EVENT_TYPES.find(t => t.value === newEvent.type)
      if (editingId) {
        updateEvent(editingId, { ...newEvent, color: eventType.color })
        setEditingId(null)
      } else {
        addEvent({ ...newEvent, color: eventType.color, reminder: true })
      }
      setNewEvent({ title: '', date: '', type: 'other', time: '', allDay: true, notes: '' })
      setShowForm(false)
    }
  }

  const handleEdit = (event) => {
    setNewEvent({ title: event.title, date: event.date, type: event.type, time: event.time || '', allDay: event.allDay, notes: event.notes || '' })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteEvent(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleDateClick = (date) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setNewEvent({ ...newEvent, date: dateStr })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewEvent({ title: '', date: '', type: 'other', time: '', allDay: true, notes: '' })
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const selectedDateEvents = selectedDate ? events.filter(e => e.date === selectedDate) : []
  const selectedDateTasks = selectedDate ? tasks.filter(t => t.dueDate === selectedDate) : []

  // Adjust for Monday start
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <CalendarIcon className="w-8 h-8 text-pink-500" /> {t('calendar')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('trackImportantDates')}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setNewEvent({ ...newEvent, date: selectedDate || today }); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('addEvent')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editEvent') : t('newEvent')}</h3>
            <button type="button" onClick={cancelForm} className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('eventTitle')}
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
              required
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              {EVENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                  className="w-4 h-4 text-pink-500 rounded"
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('allDay')}</span>
              </label>
              {!newEvent.allDay && (
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                />
              )}
            </div>
          </div>
          <textarea
            placeholder={t('notes')}
            value={newEvent.notes}
            onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
            rows={2}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
          />
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {editingId ? t('update') : t('add')}
            </button>
            <button type="button" onClick={cancelForm} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-gray-300' : ''}`} />
            </button>
            <div className="text-center">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{monthNames[month]} {year}</h2>
              <button onClick={goToToday} className="text-sm text-pink-500 hover:underline">{t('today')}</button>
            </div>
            <button onClick={nextMonth} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className={`text-center text-sm font-medium py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
              const { events: dayEvents, tasks: dayTasks } = getEventsForDate(date)
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate

              return (
                <button
                  key={date}
                  onClick={() => handleDateClick(date)}
                  className={`aspect-square p-1 rounded-xl transition-all relative ${
                    isSelected 
                      ? 'bg-pink-500 text-white' 
                      : isToday 
                        ? isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600'
                        : isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">{date}</span>
                  {(dayEvents.length > 0 || dayTasks.length > 0) && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? 'white' : e.color }} />
                      ))}
                      {dayTasks.length > 0 && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {selectedDate ? new Date(selectedDate).toLocaleDateString(getLocale(), { day: 'numeric', month: 'long', year: 'numeric' }) : t('selectDate')}
          </h3>
          
          {selectedDate && (
            <div className="space-y-4">
              {selectedDateEvents.length === 0 && selectedDateTasks.length === 0 ? (
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('noEventsYet')}</p>
              ) : (
                <>
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className={`p-3 rounded-xl border-l-4 ${isDark ? 'bg-gray-700/50' : ''}`} style={{ borderColor: event.color, backgroundColor: isDark ? undefined : `${event.color}10` }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{event.title}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {EVENT_TYPES.find(t => t.value === event.type)?.label}
                            {!event.allDay && event.time && ` • ${event.time}`}
                          </p>
                          {event.notes && <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{event.notes}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(event)} className={`p-1 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}>
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className={`p-1 ${confirmDelete === event.id ? 'text-red-500' : isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            {confirmDelete === event.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedDateTasks.map(task => (
                    <div key={task.id} className={`p-3 rounded-xl border-l-4 border-blue-500 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{task.title}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('tasks')}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
