import { useState } from 'react'
import { CheckSquare, Plus, Trash2, Check, Edit3, X, AlertCircle, Clock, Flag, ChevronDown, ListPlus } from 'lucide-react'
import useStore from '../store/useStore'
import { getCategoryIcon } from '../lib/iconHelper'
import { getTranslation } from '../lib/i18n'

export default function Tasks() {
  const { tasks, taskCategories, couple, addTask, updateTask, toggleTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  
  const PRIORITIES = [
    { value: 'high', label: t('high'), color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
    { value: 'medium', label: t('medium'), color: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-500' },
    { value: 'low', label: t('low'), color: 'bg-green-100 text-green-600', dot: 'bg-green-500' },
  ]
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [newTask, setNewTask] = useState({ title: '', assignee: 'both', dueDate: '', priority: 'medium', notes: '', category: 'other' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [expandedTask, setExpandedTask] = useState(null)
  const [newSubtask, setNewSubtask] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.title.trim()) {
      if (editingId) {
        updateTask(editingId, newTask)
        setEditingId(null)
      } else {
        addTask(newTask)
      }
      setNewTask({ title: '', assignee: 'both', dueDate: '', priority: 'medium', notes: '', category: 'other' })
      setShowForm(false)
    }
  }

  const handleEdit = (task) => {
    setNewTask({ title: task.title, assignee: task.assignee, dueDate: task.dueDate, priority: task.priority, notes: task.notes || '', category: task.category || 'other' })
    setEditingId(task.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteTask(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleAddSubtask = (taskId, e) => {
    e.preventDefault()
    if (newSubtask[taskId]?.trim()) {
      addSubtask(taskId, newSubtask[taskId])
      setNewSubtask({ ...newSubtask, [taskId]: '' })
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewTask({ title: '', assignee: 'both', dueDate: '', priority: 'medium', notes: '', category: 'other' })
  }

  const assigneeLabels = { 
    partner1: couple.partner1.name, 
    partner2: couple.partner2.name, 
    both: t('both')
  }
  const assigneeColors = { 
    partner1: 'bg-pink-100 text-pink-600', 
    partner2: 'bg-purple-100 text-purple-600', 
    both: 'bg-blue-100 text-blue-600' 
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false
    return true
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
  }

  const isOverdue = (date) => date && new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <CheckSquare className="w-8 h-8 text-pink-500" /> {t('sharedTasks')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('trackTodosTogether')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('newTask')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.total}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('total')}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-2xl font-bold text-orange-500">{stats.active}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('pending')}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('completed')}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('overdue')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('all') },
            { value: 'active', label: t('pending') },
            { value: 'completed', label: t('completed') },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === value 
                  ? 'bg-pink-500 text-white' 
                  : isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${
              categoryFilter === 'all' 
                ? 'bg-pink-500 text-white' 
                : isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('all')}
          </button>
          {taskCategories.map(cat => {
            const IconComponent = getCategoryIcon(cat.icon)
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${
                  categoryFilter === cat.id 
                    ? 'bg-pink-500 text-white' 
                    : isDark 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </button>
            )
          })}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editTask') : t('addNewTask')}</h3>
            <button type="button" onClick={cancelForm} className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('taskTitle')}
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
              required
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            />
            <select
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              <option value="both">{t('both')}</option>
              <option value="partner1">{couple.partner1.name}</option>
              <option value="partner2">{couple.partner2.name}</option>
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              {PRIORITIES.map(p => (
                <option key={p.value} value={p.value}>{p.label} {t('priority')}</option>
              ))}
            </select>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 md:col-span-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              {taskCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{t(`taskCat${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}`) || cat.name}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder={t('noteOptional')}
            value={newTask.notes}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
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

      {filteredTasks.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <CheckSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('noTasksFound')}</h3>
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>{filter === 'all' ? t('startByAdding') : t('noneInCategory')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const priority = PRIORITIES.find(p => p.value === task.priority)
            const category = taskCategories.find(c => c.id === task.category)
            const CategoryIcon = category ? getCategoryIcon(category.icon) : null
            const overdue = isOverdue(task.dueDate) && !task.completed
            const isExpanded = expandedTask === task.id
            const subtasksDone = task.subtasks?.filter(st => st.completed).length || 0
            const subtasksTotal = task.subtasks?.length || 0

            return (
              <div
                key={task.id}
                className={`rounded-2xl shadow-sm border transition-all ${
                  isDark 
                    ? task.completed 
                      ? 'opacity-60 bg-gray-800 border-gray-700' 
                      : overdue 
                        ? 'bg-gray-800 border-red-500/50' 
                        : 'bg-gray-800 border-gray-700'
                    : task.completed 
                      ? 'opacity-60 bg-white border-gray-100' 
                      : overdue 
                        ? 'bg-white border-red-200' 
                        : 'bg-white border-gray-100'
                }`}
              >
                <div className="p-4 flex items-center gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : isDark 
                          ? 'border-gray-600 hover:border-pink-500' 
                          : 'border-gray-300 hover:border-pink-500'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {CategoryIcon && <CategoryIcon className="w-5 h-5 text-pink-500" />}
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : isDark ? 'text-white' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      {overdue && (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="w-3 h-3" /> {t('overdue')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${assigneeColors[task.assignee]}`}>
                        {assigneeLabels[task.assignee]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priority.color}`}>
                        <Flag className="w-3 h-3 inline mr-1" />{priority.label}
                      </span>
                      {task.dueDate && (
                        <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3" /> {task.dueDate}
                        </span>
                      )}
                      {subtasksTotal > 0 && (
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {subtasksDone}/{subtasksTotal} {t('subtasks').toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                      className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className={`p-2 transition-colors ${confirmDelete === task.id ? 'text-red-500' : isDark ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      {confirmDelete === task.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className={`px-4 pb-4 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    {task.notes && (
                      <div className={`rounded-xl p-3 text-sm mb-4 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                        {task.notes}
                      </div>
                    )}

                    {/* Subtasks */}
                    <div>
                      <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('subtasks')}</p>
                      <div className="space-y-2 mb-3">
                        {task.subtasks?.map(subtask => (
                          <div key={subtask.id} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <button
                              onClick={() => toggleSubtask(task.id, subtask.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                subtask.completed 
                                  ? 'bg-green-500 border-green-500' 
                                  : isDark 
                                    ? 'border-gray-600' 
                                    : 'border-gray-300'
                              }`}
                            >
                              {subtask.completed && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-400' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {subtask.title}
                            </span>
                            <button
                              onClick={() => deleteSubtask(task.id, subtask.id)}
                              className={`p-1 hover:text-red-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={(e) => handleAddSubtask(task.id, e)} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t('addSubtask')}
                          value={newSubtask[task.id] || ''}
                          onChange={(e) => setNewSubtask({ ...newSubtask, [task.id]: e.target.value })}
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                        />
                        <button type="submit" className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                          <ListPlus className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
