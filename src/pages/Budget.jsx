import { useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, Edit3, X, Check, Receipt } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation, getCurrencySymbol } from '../lib/i18n'

const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6']

export default function Budget() {
  const { budget, updateBudgetTotal, addCategory, updateCategory, deleteCategory, addExpense, deleteExpense, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const currencySymbol = getCurrencySymbol(settings.currency)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingTotal, setEditingTotal] = useState(false)
  const [newTotal, setNewTotal] = useState(budget.total)
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', color: COLORS[0] })
  const [newExpense, setNewExpense] = useState({ categoryId: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const totalSpent = budget.categories.reduce((sum, c) => sum + c.spent, 0)
  const remaining = budget.total - totalSpent
  const usedPercent = (totalSpent / budget.total) * 100

  const formatMoney = (amount) => {
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(locale, { style: 'currency', currency: settings.currency || 'TRY' }).format(amount)
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    if (newCategory.name.trim() && newCategory.budget) {
      if (editingCategory) {
        updateCategory(editingCategory, { name: newCategory.name, budget: Number(newCategory.budget), color: newCategory.color })
        setEditingCategory(null)
      } else {
        addCategory({ ...newCategory, budget: Number(newCategory.budget) })
      }
      setNewCategory({ name: '', budget: '', color: COLORS[0] })
      setShowCategoryForm(false)
    }
  }

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    if (newExpense.categoryId && newExpense.description.trim() && newExpense.amount) {
      addExpense({ ...newExpense, categoryId: Number(newExpense.categoryId), amount: Number(newExpense.amount) })
      setNewExpense({ categoryId: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] })
      setShowExpenseForm(false)
    }
  }

  const handleEditCategory = (cat) => {
    setNewCategory({ name: cat.name, budget: cat.budget, color: cat.color })
    setEditingCategory(cat.id)
    setShowCategoryForm(true)
  }

  const handleDeleteCategory = (id) => {
    if (confirmDelete === `cat-${id}`) {
      deleteCategory(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(`cat-${id}`)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleDeleteExpense = (id) => {
    if (confirmDelete === `exp-${id}`) {
      deleteExpense(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(`exp-${id}`)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleTotalUpdate = () => {
    if (newTotal > 0) {
      updateBudgetTotal(Number(newTotal))
      setEditingTotal(false)
    }
  }

  const cancelCategoryForm = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
    setNewCategory({ name: '', budget: '', color: COLORS[0] })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Wallet className="w-8 h-8 text-pink-500" /> {t('sharedBudget')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('manageExpensesTogether')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryForm(true)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Plus className="w-5 h-5" /> {t('category')}
          </button>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Receipt className="w-5 h-5" /> {t('addExpense')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('totalBudget')}</p>
              {editingTotal ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newTotal}
                    onChange={(e) => setNewTotal(e.target.value)}
                    className={`w-32 px-2 py-1 border rounded-lg text-lg font-bold ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    autoFocus
                  />
                  <button onClick={handleTotalUpdate} className="text-green-500 hover:text-green-600">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => setEditingTotal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatMoney(budget.total)}</p>
              )}
            </div>
            {!editingTotal && (
              <button onClick={() => { setNewTotal(budget.total); setEditingTotal(true); }} className="text-gray-400 hover:text-blue-500">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm mb-1 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <TrendingDown className="w-4 h-4 text-red-500" /> {t('spent')}
          </p>
          <p className="text-2xl font-bold text-red-500">{formatMoney(totalSpent)}</p>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm mb-1 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <TrendingUp className="w-4 h-4 text-green-500" /> {t('remaining')}
          </p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatMoney(remaining)}</p>
        </div>
      </div>

      <div className={`rounded-2xl p-6 shadow-sm border mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between mb-2">
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{t('overallProgress')}</span>
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>%{Math.min(usedPercent, 100).toFixed(0)}</span>
        </div>
        <div className={`h-4 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div
            className={`h-full rounded-full transition-all ${usedPercent > 100 ? 'bg-red-500' : usedPercent > 80 ? 'bg-orange-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {showCategoryForm && (
        <form onSubmit={handleCategorySubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingCategory ? t('editCategory') : t('newCategory')}</h3>
            <button type="button" onClick={cancelCategoryForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('selectColor')}</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  className={`w-8 h-8 rounded-full transition-all ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('categoryName')}
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            />
            <input
              type="number"
              placeholder={`${t('budget')} (${currencySymbol})`}
              value={newCategory.budget}
              onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {editingCategory ? t('update') : t('add')}
            </button>
            <button type="button" onClick={cancelCategoryForm} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {showExpenseForm && (
        <form onSubmit={handleExpenseSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('newExpense')}</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {budget.categories.length === 0 ? (
            <div className="text-center py-4">
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('noCategoriesYet')}</p>
              <button
                type="button"
                onClick={() => { setShowExpenseForm(false); setShowCategoryForm(true); }}
                className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
              >
                {t('addCategory')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={newExpense.categoryId}
                  onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                  className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  required
                >
                  <option value="">{t('selectCategory')}...</option>
                  {budget.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder={`${t('amount')} (${currencySymbol})`}
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  required
                />
                <input
                  type="text"
                  placeholder={t('description')}
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  required
                />
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                  {t('add')}
                </button>
                <button type="button" onClick={() => setShowExpenseForm(false)} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t('cancel')}
                </button>
              </div>
            </>
          )}
        </form>
      )}

      <div className="flex gap-2 mb-6">
        {[
          { value: 'overview', label: t('categories') },
          { value: 'expenses', label: t('expenses') },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === value ? 'bg-pink-500 text-white' : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('categories')}</h2>
          {budget.categories.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t('noCategoriesYet')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budget.categories.map(cat => {
                const catPercent = (cat.spent / cat.budget) * 100
                const isOver = catPercent > 100
                return (
                  <div key={cat.id} className="group">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isOver ? 'text-red-500 font-medium' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatMoney(cat.spent)} / {formatMoney(cat.budget)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button onClick={() => handleEditCategory(cat)} className="text-gray-400 hover:text-blue-500">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className={`transition-colors ${confirmDelete === `cat-${cat.id}` ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            {confirmDelete === `cat-${cat.id}` ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(catPercent, 100)}%`, backgroundColor: isOver ? '#ef4444' : cat.color }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('expenseHistory')}</h2>
          {budget.expenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t('noExpensesYet')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...budget.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => {
                const category = budget.categories.find(c => c.id === expense.categoryId)
                return (
                  <div key={expense.id} className={`flex items-center gap-4 p-3 rounded-xl group ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: category?.color || '#ccc' }}></div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{expense.description}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{category?.name || t('deletedCategory')} • {expense.date}</p>
                    </div>
                    <p className="font-semibold text-red-500">-{formatMoney(expense.amount)}</p>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className={`opacity-0 group-hover:opacity-100 transition-all ${confirmDelete === `exp-${expense.id}` ? 'text-red-500 opacity-100' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      {confirmDelete === `exp-${expense.id}` ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
