# 🎭 Demo Account Setup

## Overview

The demo account (`maryjohn`) is a pre-configured, read-only account that showcases all features of Couple HQ. It's perfect for:
- Showing potential customers on Etsy
- Testing the application
- Demonstrating features
- Marketing materials

## Demo Account Details

**URL**: `/c/maryjohn`

**Couple**: Mary & John
- Together since: June 14, 2022
- Wedding date: September 20, 2025
- Relationship start: June 14, 2022

## Demo Data Included

### ✅ Tasks (7 items)
- Wedding planning tasks
- Home tasks
- Travel planning
- Shopping items
- Mix of completed and pending

### 💰 Budget
- Total budget: $50,000
- Multiple categories (Venue, Catering, Dress, etc.)
- Sample expenses and income

### 🎯 Goals (5 items)
- Wedding fund
- Honeymoon savings
- Emergency fund
- Home down payment
- Car savings

### 📅 Calendar Events
- Wedding date
- Anniversaries
- Birthdays
- Date nights

### 🎁 Wishlist (6 items)
- Mix of purchased and unpurchased
- Different categories
- Various price ranges

### 📸 Memories (4 items)
- First date
- Engagement
- Vacation
- Anniversary

### 🛒 Shopping Lists (2 lists)
- Grocery list
- Wedding shopping

### 💌 Love Notes (3 notes)
- Sample messages between partners

### ✨ Habits (5 habits)
- Morning workout
- Date night
- Cook together
- Read before bed
- Gratitude journal

### 💡 Date Ideas (6 ideas)
- Mix of done and planned
- Different categories
- With ratings and notes

## Demo Features

### Read-Only Mode
When users try to edit anything in demo mode:
1. Demo modal appears
2. Shows "This is a demo account" message
3. Lists features available after purchase
4. Links to Etsy shop
5. Option to continue exploring

### Allowed Actions in Demo
✅ View all pages
✅ Navigate between sections
✅ Change language
✅ Change theme (dark/light)
✅ See all features

### Blocked Actions in Demo
❌ Add/edit/delete tasks
❌ Add/edit/delete goals
❌ Add/edit/delete memories
❌ Modify budget
❌ Change profile information
❌ Export/import data
❌ Enable/disable notifications
❌ Delete all data

## Demo Configuration

### Location
`src/lib/seedData.js` - Contains all demo data

### Demo Detection
`src/contexts/CoupleContext.jsx`:
```javascript
const DEMO_COUPLE_IDS = ['maryjohn', 'demo']
```

### Demo Modal
`src/components/DemoModal.jsx` - Modal shown on edit attempts

### Demo Badge
`src/components/DemoBadge.jsx` - Orange "DEMO" badge in top-right

## Customizing Demo Data

To modify demo data, edit `src/lib/seedData.js`:

```javascript
export const generateDemoData = () => {
  return {
    couple: { /* couple info */ },
    tasks: [ /* tasks */ ],
    budget: { /* budget */ },
    // ... etc
  }
}
```

## Testing Demo Mode

### Local Testing
```bash
npm run dev
# Visit: http://localhost:5173/c/maryjohn
```

### Production Testing
```
https://your-domain.vercel.app/c/maryjohn
```

### Test Checklist
- [ ] Demo badge visible
- [ ] All sample data loads
- [ ] All pages accessible
- [ ] Edit attempts show modal
- [ ] Modal links to Etsy
- [ ] Language switching works
- [ ] Theme switching works
- [ ] No console errors

## Demo Modal Translations

The demo modal is available in all 10 languages:
- Turkish: "Demo Modu"
- English: "Demo Mode"
- Spanish: "Modo Demo"
- French: "Mode Démo"
- German: "Demo-Modus"
- Italian: "Modalità Demo"
- Portuguese: "Modo Demo"
- Russian: "Демо-режим"
- Arabic: "وضع التجريبي"
- Chinese: "演示模式"

## Adding More Demo Accounts

To add another demo account:

1. Add ID to `DEMO_COUPLE_IDS` in `CoupleContext.jsx`:
```javascript
const DEMO_COUPLE_IDS = ['maryjohn', 'demo', 'newdemo']
```

2. Create data generator in `seedData.js`:
```javascript
export const generateNewDemoData = () => {
  // Return demo data
}
```

3. Update loading logic in `CoupleContext.jsx`:
```javascript
if (coupleId === 'newdemo') {
  coupleData = generateNewDemoData()
}
```

## Demo for Marketing

### Etsy Product Description
Include demo link:
```
Try it live: https://couplehq.app/c/maryjohn
```

### Social Media
Share demo with caption:
```
See Couple HQ in action! 
Try our live demo: [link]
All features unlocked for viewing 👀
```

### Email Marketing
```
Curious about Couple HQ?
Explore our interactive demo with sample data.
No signup required!
```

## Demo Analytics (Optional)

Track demo usage with Vercel Analytics:
- Page views on `/c/maryjohn`
- Time spent on demo
- Most visited pages
- Conversion rate (demo → purchase)

## Troubleshooting

### Demo data not loading?
- Check `seedData.js` exports correctly
- Verify `maryjohn` in `DEMO_COUPLE_IDS`
- Check browser console for errors

### Demo modal not appearing?
- Verify `isDemo` is true in context
- Check `DemoModal` component imported
- Verify demo check in update functions

### Demo badge not showing?
- Check `DemoBadge` component imported
- Verify conditional rendering in `CoupleApp.jsx`
- Check z-index and positioning

## Best Practices

1. **Keep demo data realistic** - Use believable names, dates, amounts
2. **Show variety** - Include completed and pending items
3. **Update regularly** - Keep dates current (e.g., upcoming wedding)
4. **Test thoroughly** - Verify all features work in demo mode
5. **Monitor feedback** - Track what users do in demo

## Support

For demo-related issues:
- Email: sahinturkzehra@gmail.com
- Check: `src/lib/seedData.js`
- Check: `src/contexts/CoupleContext.jsx`

---

The demo account is your best sales tool - make it shine! ✨
