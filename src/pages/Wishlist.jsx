import { useState } from 'react'
import { Gift, Plus, Trash2, Check, Edit3, X, ExternalLink, ShoppingCart, Home, Laptop, Plane, ShoppingBag } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

const PRIORITIES = [
  { value: 'high', label: 'high', color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { value: 'medium', label: 'medium', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'low', label: 'low', color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
]

const CATEGORIES = [
  { value: 'home', labelKey: 'categoryHome', icon: Home },
  { value: 'tech', labelKey: 'categoryTech', icon: Laptop },
  { value: 'travel', labelKey: 'travel', icon: Plane },
  { value: 'fashion', labelKey: 'categoryFashion', icon: ShoppingBag },
  { value: 'other', labelKey: 'other', icon: Gift },
]

export default function Wishlist() {
  const { wishlist, couple, addWishlistItem, updateWishlistItem, toggleWishlistPurchased, deleteWishlistItem, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [newItem, setNewItem] = useState({ title: '', price: '', link: '', priority: 'medium', addedBy: 'partner1', category: 'other', notes: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newItem.title.trim()) {
      if (editingId) {
        updateWishlistItem(editingId, { ...newItem, price: Number(newItem.price) || 0 })
        setEditingId(null)
      } else {
        addWishlistItem({ ...newItem, price: Number(newItem.price) || 0 })
      }
      setNewItem({ title: '', price: '', link: '', priority: 'medium', addedBy: 'partner1', category: 'other', notes: '' })
      setShowForm(false)
    }
  }

  const handleEdit = (item) => {
    setNewItem({ title: item.title, price: item.price, link: item.link || '', priority: item.priority, addedBy: item.addedBy, category: item.category, notes: item.notes || '' })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteWishlistItem(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewItem({ title: '', price: '', link: '', priority: 'medium', addedBy: 'partner1', category: 'other', notes: '' })
  }

  const formatMoney = (amount) => {
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(locale, { style: 'currency', currency: settings.currency || 'TRY' }).format(amount)
  }

  const filteredItems = wishlist.filter(item => {
    if (filter === 'purchased' && !item.purchased) return false
    if (filter === 'pending' && item.purchased) return false
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
    return true
  }).sort((a, b) => {
    if (a.purchased !== b.purchased) return a.purchased ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const totalValue = wishlist.filter(w => !w.purchased).reduce((sum, w) => sum + w.price, 0)
  const purchasedValue = wishlist.filter(w => w.purchased).reduce((sum, w) => sum + w.price, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Gift className="w-8 h-8 text-pink-500" /> {t('wishlistTitle')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('listDreamProducts')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('addWish')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('totalWishes')}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{wishlist.length}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('pending')} {t('price')}</p>
          <p className="text-2xl font-bold text-pink-500">{formatMoney(totalValue)}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('purchased')} {t('price')}</p>
          <p className="text-2xl font-bold text-green-500">{formatMoney(purchasedValue)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('all') },
            { value: 'pending', label: t('pending') },
            { value: 'purchased', label: t('purchased') },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === value ? 'bg-pink-500 text-white' : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${categoryFilter === 'all' ? 'bg-gray-800 text-white' : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {t('all')}
          </button>
          {CATEGORIES.map(cat => {
            const IconComponent = cat.icon
            return (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${categoryFilter === cat.value ? 'bg-gray-800 text-white' : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
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
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editWish') : t('newWish')}</h3>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('wishName')}
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
            <input
              type="number"
              placeholder={t('price')}
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            />
            <input
              type="url"
              placeholder={t('link')}
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{t(cat.labelKey)}</option>
              ))}
            </select>
            <select
              value={newItem.priority}
              onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              <option value="high">{t('high')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="low">{t('low')}</option>
            </select>
            <select
              value={newItem.addedBy}
              onChange={(e) => setNewItem({ ...newItem, addedBy: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              <option value="partner1">{couple.partner1.name}</option>
              <option value="partner2">{couple.partner2.name}</option>
            </select>
          </div>
          <textarea
            placeholder={t('noteOptional')}
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
            rows={2}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
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

      {filteredItems.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('noWishesYet')}</h3>
          <p className="text-gray-400">{t('addFirstWish')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const priority = PRIORITIES.find(p => p.value === item.priority)
            const category = CATEGORIES.find(c => c.value === item.category)
            const IconComponent = category?.icon || Gift
            const addedByName = item.addedBy === 'partner1' ? couple.partner1.name : couple.partner2.name
            return (
              <div
                key={item.id}
                className={`rounded-2xl p-5 shadow-sm border transition-all ${item.purchased ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10 dark:border-green-800 opacity-75' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-6 h-6 text-pink-500" />
                    <div>
                      <h3 className={`font-semibold ${item.purchased ? 'line-through text-gray-400' : isDark ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                      <p className="text-xs text-gray-400">{addedByName}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${priority?.color}`}>{t(priority?.label)}</span>
                </div>

                {item.price > 0 && (
                  <p className="text-xl font-bold text-pink-500 mb-3">{formatMoney(item.price)}</p>
                )}

                {item.notes && (
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.notes}</p>
                )}

                <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex gap-1">
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-500">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-500">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-2 ${confirmDelete === item.id ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      {confirmDelete === item.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => toggleWishlistPurchased(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      item.purchased ? isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600' : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {item.purchased ? t('purchased') : <><ShoppingCart className="w-4 h-4" /> {t('markAsPurchased')}</>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
