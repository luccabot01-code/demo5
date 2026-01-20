// Demo data for Mary & John couple
export const generateDemoData = () => {
  const today = new Date()
  const relationshipStart = new Date(2022, 5, 14) // June 14, 2022
  const weddingDate = new Date(2025, 8, 20) // September 20, 2025
  
  return {
    couple: {
      partner1: { 
        name: 'Mary', 
        avatar: 'Heart', 
        birthday: '1995-03-15', 
        color: '#ec4899',
        photo: null
      },
      partner2: { 
        name: 'John', 
        avatar: 'Star', 
        birthday: '1994-07-22', 
        color: '#8b5cf6',
        photo: null
      },
      anniversary: '2022-06-14',
      weddingDate: '2025-09-20',
      relationshipStart: '2022-06-14',
      couplePhoto: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop',
    },
    
    tasks: [
      { id: 1, title: 'Book wedding venue', description: 'Visit and book the garden venue', category: 'wedding', assignedTo: 'both', priority: 'high', dueDate: '2025-03-01', completed: false, subtasks: [] },
      { id: 2, title: 'Send wedding invitations', description: 'Design and send invitations to guests', category: 'wedding', assignedTo: 'partner1', priority: 'high', dueDate: '2025-06-01', completed: false, subtasks: [] },
      { id: 3, title: 'Buy groceries', description: 'Milk, eggs, bread, vegetables', category: 'home', assignedTo: 'partner2', priority: 'medium', dueDate: '2025-01-18', completed: false, subtasks: [] },
      { id: 4, title: 'Plan honeymoon trip', description: 'Research destinations and book flights', category: 'travel', assignedTo: 'both', priority: 'medium', dueDate: '2025-04-01', completed: false, subtasks: [] },
      { id: 5, title: 'Anniversary dinner reservation', description: 'Book restaurant for anniversary', category: 'other', assignedTo: 'partner2', priority: 'high', dueDate: '2025-06-10', completed: false, subtasks: [] },
      { id: 6, title: 'Clean garage', description: 'Organize and clean the garage', category: 'home', assignedTo: 'both', priority: 'low', dueDate: '2025-02-01', completed: true, subtasks: [] },
      { id: 7, title: 'Buy anniversary gift', description: 'Find perfect gift for Mary', category: 'shopping', assignedTo: 'partner2', priority: 'medium', dueDate: '2025-06-01', completed: true, subtasks: [] },
    ],
    
    taskCategories: [
      { id: 'wedding', name: 'Wedding', color: '#ec4899', icon: 'Heart' },
      { id: 'home', name: 'Home', color: '#10b981', icon: 'Home' },
      { id: 'travel', name: 'Travel', color: '#06b6d4', icon: 'Plane' },
      { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'ShoppingBag' },
      { id: 'health', name: 'Health', color: '#ef4444', icon: 'Activity' },
      { id: 'other', name: 'Other', color: '#6b7280', icon: 'Circle' },
    ],
    
    budget: {
      total: 50000,
      currency: 'USD',
      categories: [
        { id: 1, name: 'Wedding', budget: 30000, spent: 12500, color: '#ec4899', icon: 'Heart' },
        { id: 2, name: 'Honeymoon', budget: 8000, spent: 3200, color: '#06b6d4', icon: 'Plane' },
        { id: 3, name: 'Home', budget: 5000, spent: 2100, color: '#10b981', icon: 'Home' },
        { id: 4, name: 'Entertainment', budget: 3000, spent: 1450, color: '#f59e0b', icon: 'Sparkles' },
        { id: 5, name: 'Groceries', budget: 4000, spent: 2800, color: '#8b5cf6', icon: 'ShoppingBag' },
      ],
      expenses: [
        { id: 1, categoryId: 1, amount: 5000, description: 'Wedding venue deposit', date: '2024-12-15', paidBy: 'both' },
        { id: 2, categoryId: 1, amount: 3500, description: 'Wedding dress', date: '2024-12-20', paidBy: 'partner1' },
        { id: 3, categoryId: 1, amount: 2000, description: 'Wedding photographer', date: '2025-01-05', paidBy: 'partner2' },
        { id: 4, categoryId: 1, amount: 2000, description: 'Catering deposit', date: '2025-01-10', paidBy: 'both' },
        { id: 5, categoryId: 2, amount: 2000, description: 'Flight tickets to Maldives', date: '2024-12-28', paidBy: 'partner2' },
        { id: 6, categoryId: 2, amount: 1200, description: 'Hotel reservation', date: '2025-01-02', paidBy: 'both' },
        { id: 7, categoryId: 3, amount: 1200, description: 'New sofa', date: '2024-12-10', paidBy: 'both' },
        { id: 8, categoryId: 3, amount: 900, description: 'Kitchen appliances', date: '2024-12-18', paidBy: 'partner2' },
        { id: 9, categoryId: 4, amount: 450, description: 'Concert tickets', date: '2024-12-22', paidBy: 'partner1' },
        { id: 10, categoryId: 4, amount: 1000, description: 'Weekend getaway', date: '2025-01-08', paidBy: 'both' },
        { id: 11, categoryId: 5, amount: 800, description: 'Monthly groceries', date: '2024-12-01', paidBy: 'partner2' },
        { id: 12, categoryId: 5, amount: 850, description: 'Monthly groceries', date: '2025-01-01', paidBy: 'partner1' },
        { id: 13, categoryId: 5, amount: 1150, description: 'Monthly groceries', date: '2025-01-15', paidBy: 'both' },
      ],
      income: [
        { id: 1, amount: 5000, source: 'Mary Salary', date: '2025-01-01' },
        { id: 2, amount: 6000, source: 'John Salary', date: '2025-01-01' },
        { id: 3, amount: 2000, source: 'Freelance Project', date: '2024-12-20' },
      ],
    },
    
    goals: [
      { id: 1, title: 'Wedding Fund', target: 30000, current: 12500, category: 'financial', icon: 'Heart', color: '#ec4899', deadline: '2025-09-01', contributions: [
        { id: 1, amount: 5000, date: '2024-12-01', note: 'Initial savings' },
        { id: 2, amount: 3500, date: '2024-12-15', note: 'Christmas bonus' },
        { id: 3, amount: 4000, date: '2025-01-01', note: 'January contribution' },
      ]},
      { id: 2, title: 'Honeymoon Savings', target: 8000, current: 3200, category: 'financial', icon: 'Plane', color: '#06b6d4', deadline: '2025-09-01', contributions: [
        { id: 1, amount: 2000, date: '2024-12-10', note: 'Initial deposit' },
        { id: 2, amount: 1200, date: '2025-01-05', note: 'Monthly savings' },
      ]},
      { id: 3, title: 'Learn Spanish Together', target: 100, current: 35, category: 'personal', icon: 'BookOpen', color: '#10b981', deadline: '2025-12-31', contributions: [
        { id: 1, amount: 20, date: '2024-12-01', note: 'First month lessons' },
        { id: 2, amount: 15, date: '2025-01-01', note: 'Practice sessions' },
      ]},
      { id: 4, title: 'Run 5K Together', target: 5, current: 5, category: 'health', icon: 'Activity', color: '#ef4444', deadline: '2025-03-01', contributions: [
        { id: 1, amount: 5, date: '2025-01-10', note: 'Completed 5K run!' },
      ]},
      { id: 5, title: 'Visit 10 Countries', target: 10, current: 3, category: 'travel', icon: 'MapPin', color: '#f59e0b', deadline: '2030-12-31', contributions: [
        { id: 1, amount: 1, date: '2023-06-15', note: 'Italy' },
        { id: 2, amount: 1, date: '2024-03-20', note: 'France' },
        { id: 3, amount: 1, date: '2024-11-10', note: 'Spain' },
      ]},
    ],
    
    notes: [
      { id: 1, title: 'Wedding Guest List', content: 'Family: 50 people\nFriends: 80 people\nColleagues: 20 people\nTotal: 150 guests', author: 'Mary', date: '2024-12-15', pinned: true, tags: ['wedding', 'planning'] },
      { id: 2, title: 'Honeymoon Ideas', content: 'Options:\n1. Maldives - Beach resort\n2. Switzerland - Mountain views\n3. Japan - Cultural experience\n\nDecision: Maldives!', author: 'John', date: '2024-12-20', pinned: true, tags: ['travel', 'honeymoon'] },
      { id: 3, title: 'Home Renovation Plans', content: 'Kitchen: New cabinets and countertops\nBathroom: Modern fixtures\nLiving room: Fresh paint and new furniture', author: 'both', date: '2025-01-05', pinned: false, tags: ['home', 'renovation'] },
      { id: 4, title: 'Anniversary Ideas', content: 'Romantic dinner at sunset\nWeekend trip to the mountains\nSurprise gift exchange', author: 'John', date: '2025-01-08', pinned: false, tags: ['anniversary', 'romance'] },
      { id: 5, title: 'Grocery Shopping List', content: 'Fruits: Apples, Bananas, Oranges\nVegetables: Tomatoes, Lettuce, Carrots\nDairy: Milk, Cheese, Yogurt\nMeat: Chicken, Beef', author: 'Mary', date: '2025-01-15', pinned: false, tags: ['shopping', 'groceries'] },
    ],
    
    events: [
      { id: 1, title: 'Wedding Day! 💒', date: '2025-09-20', time: '15:00', location: 'Garden Venue, Downtown', type: 'wedding', color: '#ec4899', notes: 'Our special day!' },
      { id: 2, title: 'Anniversary Dinner', date: '2025-06-14', time: '19:00', location: 'Romantic Restaurant', type: 'anniversary', color: '#8b5cf6', notes: '3 years together!' },
      { id: 3, title: 'Honeymoon - Maldives', date: '2025-09-22', time: '10:00', location: 'Maldives', type: 'travel', color: '#06b6d4', notes: '10 days in paradise' },
      { id: 4, title: 'Mary\'s Birthday', date: '2025-03-15', time: '18:00', location: 'Home', type: 'birthday', color: '#ec4899', notes: 'Surprise party!' },
      { id: 5, title: 'John\'s Birthday', date: '2025-07-22', time: '19:00', location: 'Beach House', type: 'birthday', color: '#8b5cf6', notes: 'Beach party celebration' },
      { id: 6, title: 'Concert Night', date: '2025-02-14', time: '20:00', location: 'City Arena', type: 'entertainment', color: '#f59e0b', notes: 'Favorite band live!' },
      { id: 7, title: 'Couples Yoga Class', date: '2025-01-25', time: '10:00', location: 'Wellness Center', type: 'health', color: '#10b981', notes: 'Weekly class' },
    ],
    
    wishlist: [
      { id: 1, item: 'Smart Home System', price: 1200, priority: 'high', category: 'home', url: 'https://example.com', notes: 'For the new house', addedBy: 'partner2', purchased: false },
      { id: 2, item: 'Professional Camera', price: 2500, priority: 'medium', category: 'hobby', url: 'https://example.com', notes: 'For wedding photography', addedBy: 'partner1', purchased: false },
      { id: 3, item: 'Espresso Machine', price: 800, priority: 'medium', category: 'home', url: 'https://example.com', notes: 'Morning coffee ritual', addedBy: 'both', purchased: true },
      { id: 4, item: 'Hiking Backpacks', price: 300, priority: 'low', category: 'travel', url: 'https://example.com', notes: 'For mountain trips', addedBy: 'partner2', purchased: false },
      { id: 5, item: 'Couples Spa Day', price: 400, priority: 'medium', category: 'experience', url: 'https://example.com', notes: 'Relaxation day', addedBy: 'partner1', purchased: false },
      { id: 6, item: 'Dining Table Set', price: 1500, priority: 'high', category: 'home', url: 'https://example.com', notes: 'For the dining room', addedBy: 'both', purchased: true },
    ],
    
    memories: [
      { id: 1, title: 'First Date ❤️', date: '2022-06-14', description: 'Coffee shop downtown, talked for 4 hours!', mood: 'Heart', photos: [], tags: ['first', 'date', 'special'] },
      { id: 2, title: 'Proposal Day 💍', date: '2024-06-14', description: 'John proposed at sunset on the beach. She said YES!', mood: 'Sparkles', photos: [], tags: ['proposal', 'engagement', 'milestone'] },
      { id: 3, title: 'First Vacation Together', date: '2023-08-20', description: 'Road trip to the mountains. Amazing views and quality time.', mood: 'Sun', photos: [], tags: ['travel', 'vacation', 'adventure'] },
      { id: 4, title: 'Moved In Together 🏠', date: '2023-03-01', description: 'First day in our new apartment. Exciting new chapter!', mood: 'Home', photos: [], tags: ['home', 'milestone', 'together'] },
      { id: 5, title: 'Cooking Disaster 😂', date: '2023-11-15', description: 'Tried to make fancy dinner, ended up ordering pizza. Laughed all night!', mood: 'Smile', photos: [], tags: ['funny', 'cooking', 'memories'] },
      { id: 6, title: 'Adopted Our Cat 🐱', date: '2024-02-10', description: 'Meet Whiskers! Our new family member.', mood: 'Heart', photos: [], tags: ['pet', 'family', 'cat'] }
    ],
    
    shoppingLists: [
      { id: 1, name: 'Weekly Groceries', items: [
        { id: 1, name: 'Milk', quantity: '2 liters', checked: false },
        { id: 2, name: 'Eggs', quantity: '1 dozen', checked: true },
        { id: 3, name: 'Bread', quantity: '2 loaves', checked: false },
        { id: 4, name: 'Chicken breast', quantity: '1 kg', checked: false },
        { id: 5, name: 'Tomatoes', quantity: '500g', checked: true },
        { id: 6, name: 'Cheese', quantity: '300g', checked: false },
      ]},
      { id: 2, name: 'Wedding Shopping', items: [
        { id: 1, name: 'Wedding rings', quantity: '2', checked: true },
        { id: 2, name: 'Decorations', quantity: 'bulk', checked: false },
        { id: 3, name: 'Guest favors', quantity: '150', checked: false },
        { id: 4, name: 'Table centerpieces', quantity: '20', checked: false },
      ]},
      { id: 3, name: 'Home Improvement', items: [
        { id: 1, name: 'Paint (white)', quantity: '5 gallons', checked: true },
        { id: 2, name: 'Brushes and rollers', quantity: 'set', checked: true },
        { id: 3, name: 'Light fixtures', quantity: '4', checked: false },
        { id: 4, name: 'Curtains', quantity: '6 panels', checked: false },
      ]},
    ],
    
    loveNotes: [
      { id: 1, from: 'partner2', to: 'partner1', message: 'Good morning beautiful! Can\'t wait to see you tonight. Love you! ❤️', date: '2025-01-15T08:30:00', read: true },
      { id: 2, from: 'partner1', to: 'partner2', message: 'Thank you for the surprise breakfast! You\'re the best! 💕', date: '2025-01-15T09:15:00', read: true },
      { id: 3, from: 'partner2', to: 'partner1', message: 'Thinking about our wedding day... I\'m so excited to marry you! 💍', date: '2025-01-14T20:00:00', read: true },
      { id: 4, from: 'partner1', to: 'partner2', message: 'Me too! Can\'t believe it\'s only 8 months away! Love you so much! 😍', date: '2025-01-14T20:30:00', read: true },
      { id: 5, from: 'partner2', to: 'partner1', message: 'Don\'t forget we have dinner reservations tonight at 7! Dress fancy 😉', date: '2025-01-16T15:00:00', read: false },
      { id: 6, from: 'partner1', to: 'partner2', message: 'You make every day special. Thank you for being you. ❤️', date: '2025-01-13T22:00:00', read: true },
    ],
    
    habits: [
      { id: 1, title: 'Morning Workout Together', frequency: 'daily', icon: 'Activity', color: '#ef4444', streak: 12, completions: {
        '2025-01-05': true, '2025-01-06': true, '2025-01-07': true, '2025-01-08': true, '2025-01-09': true,
        '2025-01-10': true, '2025-01-11': true, '2025-01-12': true, '2025-01-13': true, '2025-01-14': true,
        '2025-01-15': true, '2025-01-16': true,
      }},
      { id: 2, title: 'Date Night', frequency: 'weekly', icon: 'Heart', color: '#ec4899', streak: 8, completions: {
        '2024-12-06': true, '2024-12-13': true, '2024-12-20': true, '2024-12-27': true,
        '2025-01-03': true, '2025-01-10': true, '2025-01-17': true,
      }},
      { id: 3, title: 'Cook Dinner Together', frequency: 'daily', icon: 'ChefHat', color: '#f59e0b', streak: 5, completions: {
        '2025-01-12': true, '2025-01-13': true, '2025-01-14': true, '2025-01-15': true, '2025-01-16': true,
      }},
      { id: 4, title: 'Read Before Bed', frequency: 'daily', icon: 'BookOpen', color: '#8b5cf6', streak: 7, completions: {
        '2025-01-10': true, '2025-01-11': true, '2025-01-12': true, '2025-01-13': true,
        '2025-01-14': true, '2025-01-15': true, '2025-01-16': true,
      }},
      { id: 5, title: 'Gratitude Journal', frequency: 'daily', icon: 'Heart', color: '#10b981', streak: 3, completions: {
        '2025-01-14': true, '2025-01-15': true, '2025-01-16': true,
      }},
    ],
    
    dateIdeas: [
      { id: 1, title: 'Sunset Beach Picnic', category: 'outdoor', season: 'summer', cost: 'low', duration: '2-3 hours', description: 'Pack a basket with wine and cheese, watch the sunset together', done: true, rating: 5, notes: 'Perfect evening! The sunset was beautiful.' },
      { id: 2, title: 'Cooking Class Together', category: 'indoor', season: 'any', cost: 'medium', duration: '3-4 hours', description: 'Learn to make pasta from scratch', done: true, rating: 4, notes: 'So much fun! We made delicious ravioli.' },
      { id: 3, title: 'Stargazing Night', category: 'outdoor', season: 'any', cost: 'free', duration: '2-3 hours', description: 'Drive to a dark spot, bring blankets and hot chocolate', done: false, rating: null, notes: '' },
      { id: 4, title: 'Museum and Brunch', category: 'cultural', season: 'any', cost: 'medium', duration: '4-5 hours', description: 'Visit art museum followed by fancy brunch', done: false, rating: null, notes: '' },
      { id: 5, title: 'Couples Spa Day', category: 'relaxation', season: 'any', cost: 'high', duration: '4-6 hours', description: 'Massage, sauna, and relaxation', done: false, rating: null, notes: '' },
      { id: 6, title: 'Hiking Adventure', category: 'outdoor', season: 'spring', cost: 'low', duration: '4-6 hours', description: 'Mountain trail with scenic views', done: true, rating: 5, notes: 'Amazing views! Great workout together.' },
      { id: 7, title: 'Wine Tasting', category: 'food', season: 'any', cost: 'medium', duration: '2-3 hours', description: 'Visit local winery for tasting', done: false, rating: null, notes: '' },
      { id: 8, title: 'Game Night at Home', category: 'indoor', season: 'any', cost: 'free', duration: '2-4 hours', description: 'Board games, snacks, and quality time', done: true, rating: 4, notes: 'Competitive but fun! Mary won 3 games.' },
    ],
    
    mealPlan: {},
    
    settings: {
      theme: 'light',
      language: 'en',
      notifications: true,
      weekStartsOn: 'sunday',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      pin: null,
      email: null,
    },
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
