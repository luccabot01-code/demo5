import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { getInitialLanguage } from '../lib/i18n'

// This store is now used as a local cache that syncs with CoupleContext
// The actual persistence is handled by IndexedDB + API sync

// Get default task categories based on language
const getDefaultTaskCategories = () => {
  const currentLang = getInitialLanguage()
  return currentLang === 'tr' ? [
    { id: 'wedding', name: 'Düğün', color: '#ec4899', icon: 'Heart' },
    { id: 'home', name: 'Ev', color: '#10b981', icon: 'Home' },
    { id: 'travel', name: 'Seyahat', color: '#06b6d4', icon: 'Plane' },
    { id: 'shopping', name: 'Alışveriş', color: '#f59e0b', icon: 'ShoppingBag' },
    { id: 'health', name: 'Sağlık', color: '#ef4444', icon: 'Activity' },
    { id: 'other', name: 'Diğer', color: '#6b7280', icon: 'Circle' },
  ] : [
    { id: 'wedding', name: 'Wedding', color: '#ec4899', icon: 'Heart' },
    { id: 'home', name: 'Home', color: '#10b981', icon: 'Home' },
    { id: 'travel', name: 'Travel', color: '#06b6d4', icon: 'Plane' },
    { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'ShoppingBag' },
    { id: 'health', name: 'Health', color: '#ef4444', icon: 'Activity' },
    { id: 'other', name: 'Other', color: '#6b7280', icon: 'Circle' },
  ]
}

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // Data state
    coupleId: null,
    isLoaded: false,
    
    // Couple Profile
    couple: {
      partner1: { name: 'Partner 1', avatar: 'User', birthday: '', color: '#ec4899', photo: null },
      partner2: { name: 'Partner 2', avatar: 'UserCircle', birthday: '', color: '#8b5cf6', photo: null },
      anniversary: '',
      weddingDate: '',
      relationshipStart: '',
      couplePhoto: null,
    },

    // All data collections
    tasks: [],
    taskCategories: getDefaultTaskCategories(),
    budget: { total: 0, currency: 'TRY', categories: [], expenses: [], income: [] },
    notes: [],
    goals: [],
    events: [],
    wishlist: [],
    memories: [],
    shoppingLists: [],
    loveNotes: [],
    habits: [],
    dateIdeas: [],
    mealPlan: {},
    currentUser: typeof window !== 'undefined' ? (localStorage.getItem('currentUser') || 'partner1') : 'partner1', // Current logged in user
    settings: {
      theme: 'light',
      language: getInitialLanguage(),
      notifications: true,
      weekStartsOn: 'monday',
      dateFormat: 'DD/MM/YYYY',
      currency: 'TRY',
      pin: null,
      email: null,
    },

    // Sync callback - will be set by CoupleProvider
    onDataChange: null,
    setOnDataChange: (callback) => set({ onDataChange: callback }),

    // Initialize store with data from CoupleContext
    initializeStore: (coupleId, data) => {
      // Load currentUser from localStorage if available
      const savedCurrentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null
      
      set({
        coupleId,
        isLoaded: true,
        couple: data.couple || get().couple,
        tasks: data.tasks || [],
        taskCategories: data.taskCategories || get().taskCategories,
        budget: data.budget || get().budget,
        notes: data.notes || [],
        goals: data.goals || [],
        events: data.events || [],
        wishlist: data.wishlist || [],
        memories: data.memories || [],
        shoppingLists: data.shoppingLists || [],
        loveNotes: data.loveNotes || [],
        habits: data.habits || [],
        dateIdeas: data.dateIdeas || [],
        mealPlan: data.mealPlan || {},
        currentUser: savedCurrentUser || 'partner1', // Restore from localStorage or default to partner1
        settings: data.settings || get().settings,
      })
    },

    // Helper to trigger sync after changes
    triggerSync: (skipDemoCheck = false) => {
      const { onDataChange, coupleId, couple, tasks, taskCategories, budget, notes, goals, events, wishlist, memories, shoppingLists, loveNotes, habits, dateIdeas, mealPlan, settings } = get()
      if (onDataChange && coupleId) {
        onDataChange({
          couple, tasks, taskCategories, budget, notes, goals, events, wishlist, memories, shoppingLists, loveNotes, habits, dateIdeas, mealPlan, settings
        }, skipDemoCheck)
      }
    },

    // ============ ACTIONS ============

    // Couple Actions
    updateCouple: (data) => {
      set((state) => ({ couple: { ...state.couple, ...data } }))
      get().triggerSync()
    },
    updatePartner: (partner, data) => {
      set((state) => ({
        couple: { ...state.couple, [partner]: { ...state.couple[partner], ...data } }
      }))
      get().triggerSync()
    },

    // Task Actions
    addTask: (task) => {
      set((state) => ({ 
        tasks: [...state.tasks, { ...task, id: Date.now(), completed: false, subtasks: task.subtasks || [] }] 
      }))
      get().triggerSync()
    },
    updateTask: (id, updates) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
      }))
      get().triggerSync()
    },
    toggleTask: (id) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
      }))
      get().triggerSync()
    },
    deleteTask: (id) => {
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      get().triggerSync()
    },
    addSubtask: (taskId, subtask) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), { id: Date.now(), title: subtask, completed: false }] } : t),
      }))
      get().triggerSync()
    },
    toggleSubtask: (taskId, subtaskId) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? {
          ...t,
          subtasks: t.subtasks.map((st) => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        } : t),
      }))
      get().triggerSync()
    },
    deleteSubtask: (taskId, subtaskId) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? {
          ...t,
          subtasks: t.subtasks.filter((st) => st.id !== subtaskId)
        } : t),
      }))
      get().triggerSync()
    },

    // Note Actions
    addNote: (note) => {
      set((state) => ({ 
        notes: [...state.notes, { ...note, id: Date.now(), date: new Date().toISOString().split('T')[0], pinned: false, tags: note.tags || [] }] 
      }))
      get().triggerSync()
    },
    updateNote: (id, updates) => {
      set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, ...updates } : n),
      }))
      get().triggerSync()
    },
    deleteNote: (id) => {
      set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
      get().triggerSync()
    },
    togglePinNote: (id) => {
      set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n),
      }))
      get().triggerSync()
    },

    // Goal Actions
    addGoal: (goal) => {
      set((state) => ({ 
        goals: [...state.goals, { ...goal, id: Date.now(), current: 0, contributions: [] }] 
      }))
      get().triggerSync()
    },
    updateGoal: (id, updates) => {
      set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g),
      }))
      get().triggerSync()
    },
    updateGoalProgress: (id, amount, note = '') => {
      set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { 
          ...g, 
          current: Math.max(0, Math.min(g.current + amount, g.target)),
          contributions: [...(g.contributions || []), { id: Date.now(), amount, date: new Date().toISOString().split('T')[0], note }]
        } : g),
      }))
      get().triggerSync()
    },
    deleteGoal: (id) => {
      set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
      get().triggerSync()
    },
    deleteGoalContribution: (goalId, contribId) => {
      set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== goalId) return g
          const contrib = g.contributions.find(c => c.id === contribId)
          return {
            ...g,
            current: Math.max(0, g.current - (contrib?.amount || 0)),
            contributions: g.contributions.filter(c => c.id !== contribId)
          }
        }),
      }))
      get().triggerSync()
    },

    // Budget Actions
    updateBudgetTotal: (total) => {
      set((state) => ({ budget: { ...state.budget, total } }))
      get().triggerSync()
    },
    addCategory: (category) => {
      set((state) => ({
        budget: { ...state.budget, categories: [...state.budget.categories, { ...category, id: Date.now(), spent: 0 }] },
      }))
      get().triggerSync()
    },
    updateCategory: (id, updates) => {
      set((state) => ({
        budget: { ...state.budget, categories: state.budget.categories.map((c) => c.id === id ? { ...c, ...updates } : c) },
      }))
      get().triggerSync()
    },
    deleteCategory: (id) => {
      set((state) => ({
        budget: {
          ...state.budget,
          categories: state.budget.categories.filter((c) => c.id !== id),
          expenses: state.budget.expenses.filter((e) => e.categoryId !== id),
        },
      }))
      get().triggerSync()
    },
    addExpense: (expense) => {
      set((state) => ({
        budget: {
          ...state.budget,
          expenses: [...state.budget.expenses, { ...expense, id: Date.now() }],
          categories: state.budget.categories.map((c) => c.id === expense.categoryId ? { ...c, spent: c.spent + expense.amount } : c),
        },
      }))
      get().triggerSync()
    },
    deleteExpense: (id) => {
      const expense = get().budget.expenses.find((e) => e.id === id)
      if (!expense) return
      set((state) => ({
        budget: {
          ...state.budget,
          expenses: state.budget.expenses.filter((e) => e.id !== id),
          categories: state.budget.categories.map((c) => c.id === expense.categoryId ? { ...c, spent: Math.max(0, c.spent - expense.amount) } : c),
        },
      }))
      get().triggerSync()
    },
    addIncome: (income) => {
      set((state) => ({
        budget: { ...state.budget, income: [...state.budget.income, { ...income, id: Date.now() }] },
      }))
      get().triggerSync()
    },
    deleteIncome: (id) => {
      set((state) => ({
        budget: { ...state.budget, income: state.budget.income.filter((i) => i.id !== id) },
      }))
      get().triggerSync()
    },

    // Event Actions
    addEvent: (event) => {
      set((state) => ({ events: [...state.events, { ...event, id: Date.now() }] }))
      get().triggerSync()
    },
    updateEvent: (id, updates) => {
      set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e),
      }))
      get().triggerSync()
    },
    deleteEvent: (id) => {
      set((state) => ({ events: state.events.filter((e) => e.id !== id) }))
      get().triggerSync()
    },

    // Wishlist Actions
    addWishlistItem: (item) => {
      set((state) => ({ wishlist: [...state.wishlist, { ...item, id: Date.now(), purchased: false }] }))
      get().triggerSync()
    },
    updateWishlistItem: (id, updates) => {
      set((state) => ({
        wishlist: state.wishlist.map((w) => w.id === id ? { ...w, ...updates } : w),
      }))
      get().triggerSync()
    },
    toggleWishlistPurchased: (id) => {
      set((state) => ({
        wishlist: state.wishlist.map((w) => w.id === id ? { ...w, purchased: !w.purchased } : w),
      }))
      get().triggerSync()
    },
    deleteWishlistItem: (id) => {
      set((state) => ({ wishlist: state.wishlist.filter((w) => w.id !== id) }))
      get().triggerSync()
    },

    // Memory Actions
    addMemory: (memory) => {
      set((state) => ({ memories: [...state.memories, { ...memory, id: Date.now() }] }))
      get().triggerSync(true) // Skip demo check for memories
    },
    updateMemory: (id, updates) => {
      set((state) => ({
        memories: state.memories.map((m) => m.id === id ? { ...m, ...updates } : m),
      }))
      get().triggerSync(true) // Skip demo check for memories
    },
    deleteMemory: (id) => {
      set((state) => ({ memories: state.memories.filter((m) => m.id !== id) }))
      get().triggerSync(true) // Skip demo check for memories
    },
    deleteMemory: (id) => {
      set((state) => ({ memories: state.memories.filter((m) => m.id !== id) }))
      get().triggerSync(true) // Skip demo check for memories
    },

    // Shopping List Actions
    addShoppingList: (list) => {
      set((state) => ({ shoppingLists: [...state.shoppingLists, { ...list, id: Date.now(), items: [] }] }))
      get().triggerSync()
    },
    deleteShoppingList: (id) => {
      set((state) => ({ shoppingLists: state.shoppingLists.filter((l) => l.id !== id) }))
      get().triggerSync()
    },
    addShoppingItem: (listId, item) => {
      set((state) => ({
        shoppingLists: state.shoppingLists.map((l) => l.id === listId ? { ...l, items: [...l.items, { ...item, id: Date.now(), checked: false }] } : l),
      }))
      get().triggerSync()
    },
    toggleShoppingItem: (listId, itemId) => {
      set((state) => ({
        shoppingLists: state.shoppingLists.map((l) => l.id === listId ? {
          ...l,
          items: l.items.map((i) => i.id === itemId ? { ...i, checked: !i.checked } : i)
        } : l),
      }))
      get().triggerSync()
    },
    deleteShoppingItem: (listId, itemId) => {
      set((state) => ({
        shoppingLists: state.shoppingLists.map((l) => l.id === listId ? {
          ...l,
          items: l.items.filter((i) => i.id !== itemId)
        } : l),
      }))
      get().triggerSync()
    },
    clearCheckedItems: (listId) => {
      set((state) => ({
        shoppingLists: state.shoppingLists.map((l) => l.id === listId ? {
          ...l,
          items: l.items.filter((i) => !i.checked)
        } : l),
      }))
      get().triggerSync()
    },

    // Love Notes Actions
    addLoveNote: (note) => {
      set((state) => ({ loveNotes: [...state.loveNotes, { ...note, id: Date.now(), date: new Date().toISOString(), read: false }] }))
      get().triggerSync()
    },
    markLoveNoteRead: (id) => {
      set((state) => ({
        loveNotes: state.loveNotes.map((n) => n.id === id ? { ...n, read: true } : n),
      }))
      get().triggerSync()
    },
    deleteLoveNote: (id) => {
      set((state) => ({ loveNotes: state.loveNotes.filter((n) => n.id !== id) }))
      get().triggerSync()
    },

    // Habits Actions
    addHabit: (habit) => {
      set((state) => ({ habits: [...state.habits, { ...habit, id: Date.now(), completions: {}, streak: 0 }] }))
      get().triggerSync()
    },
    toggleHabitCompletion: (id, date) => {
      set((state) => ({
        habits: state.habits.map((h) => {
          if (h.id !== id) return h
          const completions = { ...h.completions }
          if (completions[date]) {
            delete completions[date]
          } else {
            completions[date] = true
          }
          let streak = 0
          const today = new Date()
          for (let i = 0; i < 365; i++) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            if (completions[dateStr]) streak++
            else if (i > 0) break
          }
          return { ...h, completions, streak }
        }),
      }))
      get().triggerSync()
    },
    deleteHabit: (id) => {
      set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }))
      get().triggerSync()
    },

    // Date Ideas Actions
    addDateIdea: (idea) => {
      set((state) => ({ dateIdeas: [...state.dateIdeas, { ...idea, id: Date.now(), done: false, rating: null }] }))
      get().triggerSync()
    },
    updateDateIdea: (id, updates) => {
      set((state) => ({
        dateIdeas: state.dateIdeas.map((d) => d.id === id ? { ...d, ...updates } : d),
      }))
      get().triggerSync()
    },
    toggleDateIdeaDone: (id) => {
      set((state) => ({
        dateIdeas: state.dateIdeas.map((d) => d.id === id ? { ...d, done: !d.done } : d),
      }))
      get().triggerSync()
    },
    rateDateIdea: (id, rating) => {
      set((state) => ({
        dateIdeas: state.dateIdeas.map((d) => d.id === id ? { ...d, rating, done: true } : d),
      }))
      get().triggerSync()
    },
    deleteDateIdea: (id) => {
      set((state) => ({ dateIdeas: state.dateIdeas.filter((d) => d.id !== id) }))
      get().triggerSync()
    },

    // Settings Actions
    updateSettings: (updates) => {
      set((state) => ({ settings: { ...state.settings, ...updates } }))
      
      // If theme is being updated, save to localStorage and update DOM
      if (updates.theme !== undefined) {
        const isDark = updates.theme === 'dark'
        localStorage.setItem('darkMode', isDark.toString())
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      
      // Skip demo check for settings updates (allow language/theme changes in demo)
      get().triggerSync(true)
    },

    // Current User Actions
    setCurrentUser: (user) => {
      set({ currentUser: user })
      localStorage.setItem('currentUser', user)
    },

    // Data Management
    exportData: () => {
      const state = get()
      return JSON.stringify({
        couple: state.couple,
        tasks: state.tasks,
        taskCategories: state.taskCategories,
        budget: state.budget,
        notes: state.notes,
        goals: state.goals,
        events: state.events,
        wishlist: state.wishlist,
        memories: state.memories,
        shoppingLists: state.shoppingLists,
        loveNotes: state.loveNotes,
        habits: state.habits,
        dateIdeas: state.dateIdeas,
        mealPlan: state.mealPlan,
        settings: state.settings,
        exportDate: new Date().toISOString(),
      }, null, 2)
    },
    importData: (jsonString) => {
      try {
        const data = JSON.parse(jsonString)
        set({
          couple: data.couple || get().couple,
          tasks: data.tasks || [],
          taskCategories: data.taskCategories || get().taskCategories,
          budget: data.budget || get().budget,
          notes: data.notes || [],
          goals: data.goals || [],
          events: data.events || [],
          wishlist: data.wishlist || [],
          memories: data.memories || [],
          shoppingLists: data.shoppingLists || [],
          loveNotes: data.loveNotes || [],
          habits: data.habits || [],
          dateIdeas: data.dateIdeas || [],
          mealPlan: data.mealPlan || {},
          settings: data.settings || get().settings,
        })
        get().triggerSync()
        return true
      } catch (e) {
        return false
      }
    },
    resetAllData: () => {
      set({
        tasks: [],
        notes: [],
        goals: [],
        events: [],
        wishlist: [],
        memories: [],
        shoppingLists: [],
        loveNotes: [],
        habits: [],
        dateIdeas: [],
        mealPlan: {},
        budget: { total: 0, currency: 'TRY', categories: [], expenses: [], income: [] },
      })
      get().triggerSync()
    },
  }))
)

export default useStore
