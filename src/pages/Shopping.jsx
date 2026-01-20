import { useState } from 'react'
import { ShoppingCart, Plus, Trash2, Check, X, ListPlus, Package } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

export default function Shopping() {
  const { shoppingLists, addShoppingList, deleteShoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showListForm, setShowListForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newItems, setNewItems] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [activeList, setActiveList] = useState(shoppingLists[0]?.id || null)

  const handleAddList = (e) => {
    e.preventDefault()
    if (newListName.trim()) {
      addShoppingList({ name: newListName })
      setNewListName('')
      setShowListForm(false)
    }
  }

  const handleAddItem = (listId, e) => {
    e.preventDefault()
    const itemName = newItems[listId]?.name
    const quantity = newItems[listId]?.quantity || 1
    if (itemName?.trim()) {
      addShoppingItem(listId, { name: itemName, quantity: Number(quantity) })
      setNewItems({ ...newItems, [listId]: { name: '', quantity: 1 } })
    }
  }

  const handleDeleteList = (id) => {
    if (confirmDelete === `list-${id}`) {
      deleteShoppingList(id)
      setConfirmDelete(null)
      if (activeList === id) {
        setActiveList(shoppingLists.find(l => l.id !== id)?.id || null)
      }
    } else {
      setConfirmDelete(`list-${id}`)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleDeleteItem = (listId, itemId) => {
    if (confirmDelete === `item-${itemId}`) {
      deleteShoppingItem(listId, itemId)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(`item-${itemId}`)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const currentList = shoppingLists.find(l => l.id === activeList)
  const checkedCount = currentList?.items.filter(i => i.checked).length || 0
  const totalCount = currentList?.items.length || 0

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <ShoppingCart className="w-8 h-8 text-pink-500" /> {t('shoppingTitle')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('organizeGroceries')}</p>
        </div>
        <button
          onClick={() => setShowListForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <ListPlus className="w-5 h-5" /> {t('newList')}
        </button>
      </div>

      {showListForm && (
        <form onSubmit={handleAddList} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('newList')}</h3>
            <button type="button" onClick={() => setShowListForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('listName')}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              autoFocus
            />
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {t('add')}
            </button>
          </div>
        </form>
      )}

      {shoppingLists.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('noListsYet')}</h3>
          <p className="text-gray-400">{t('addFirstList')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Tabs */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('shopping')}</h3>
              <div className="space-y-2">
                {shoppingLists.map(list => {
                  const checked = list.items.filter(i => i.checked).length
                  const total = list.items.length
                  return (
                    <div
                      key={list.id}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        activeList === list.id ? 'bg-pink-100 dark:bg-pink-900/20 border-2 border-pink-500' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveList(list.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{list.name}</p>
                          <p className="text-xs text-gray-400">{checked}/{total} {t('completed')}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                        className={`p-1 ${confirmDelete === `list-${list.id}` ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        {confirmDelete === `list-${list.id}` ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Active List Items */}
          <div className="lg:col-span-2">
            {currentList ? (
              <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{currentList.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{checkedCount}/{totalCount} {t('items')}</p>
                  </div>
                  {checkedCount > 0 && (
                    <button
                      onClick={() => clearCheckedItems(currentList.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      {t('clearChecked')}
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {totalCount > 0 && (
                  <div className={`h-2 rounded-full overflow-hidden mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${(checkedCount / totalCount) * 100}%` }}
                    />
                  </div>
                )}

                {/* Add item form */}
                <form onSubmit={(e) => handleAddItem(currentList.id, e)} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder={t('itemName')}
                    value={newItems[currentList.id]?.name || ''}
                    onChange={(e) => setNewItems({ ...newItems, [currentList.id]: { ...newItems[currentList.id], name: e.target.value } })}
                    className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  />
                  <input
                    type="number"
                    placeholder={t('amount')}
                    min="1"
                    value={newItems[currentList.id]?.quantity || ''}
                    onChange={(e) => setNewItems({ ...newItems, [currentList.id]: { ...newItems[currentList.id], quantity: e.target.value } })}
                    className={`w-20 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  />
                  <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </form>

                {/* Items list */}
                {currentList.items.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">{t('noItemsYet')}</p>
                ) : (
                  <div className="space-y-2">
                    {currentList.items.sort((a, b) => a.checked - b.checked).map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          item.checked ? 'bg-green-50 dark:bg-green-900/10' : isDark ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => toggleShoppingItem(currentList.id, item.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-pink-500'
                          }`}
                        >
                          {item.checked && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <span className={`flex-1 ${item.checked ? 'line-through text-gray-400' : isDark ? 'text-white' : 'text-gray-800'}`}>
                          {item.name}
                        </span>
                        {item.quantity > 1 && (
                          <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-400'}`}>
                            x{item.quantity}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteItem(currentList.id, item.id)}
                          className={`p-1 ${confirmDelete === `item-${item.id}` ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          {confirmDelete === `item-${item.id}` ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <p className="text-gray-400">{t('selectCategory')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
