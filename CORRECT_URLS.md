# ⚠️ IMPORTANT: Correct Table Token

## The Issue

You're visiting `/t/rest1-1` which is from the **old mock data**. The Django backend is seeded with a different token.

## ✅ Correct URLs to Use

### Customer URLs (Use these!)
- **Landing Page:** http://localhost:3000/t/table1abc
- **Menu:** http://localhost:3000/t/table1abc/menu
- **Payment:** http://localhost:3000/t/table1abc/pay
- **Receipt:** http://localhost:3000/t/table1abc/receipt

### Admin URLs
- **Dashboard:** http://localhost:3000/admin/admin123/dashboard
- **Menu Builder:** http://localhost:3000/admin/admin123/menu-builder
- **QR Codes:** http://localhost:3000/admin/admin123/qr
- **Settings:** http://localhost:3000/admin/admin123/settings

## 🔑 Seeded Tokens

### Table Token
```
table1abc
```
This is the token you MUST use for customer pages.

### Admin Token
```
admin123
```
This is the token for admin pages.

## ❌ Old Mock Data (Don't Use)

The following are **OLD tokens from mock data** and will NOT work:
- ❌ `rest1-1` 
- ❌ `rest1-2`
- ❌ `rest1-admin`

## 🔍 What Happens with Wrong Token

If you use an invalid token like `rest1-1`, you'll see:
- ✅ Landing page now shows an error with helpful message
- ✅ Menu page now shows an error with correct URL
- Backend returns 404 for menu and bill APIs

## 🧪 Quick Test

1. **Visit the correct URL:**
   ```
   http://localhost:3000/t/table1abc/menu
   ```

2. **You should see:**
   - Demo Restaurant menu
   - 4 categories (Appetizers, Mains, Desserts, Beverages)
   - 15 menu items with prices
   - Empty bill drawer

3. **Add an item:**
   - Click on "Ribeye Steak"
   - Click "Add to Bill"
   - Item appears in bill drawer

## 🛠️ Changes Made

### Landing Page (`app/t/[tableToken]/page.tsx`)
- ✅ Now fetches table context from API
- ✅ Shows error if token is invalid
- ✅ Displays the token you used and suggests correct one

### Menu Page (`app/t/[tableToken]/menu/page.tsx`)
- ✅ Shows error if token is invalid
- ✅ Suggests correct URL to use
- ✅ Only renders menu if data is successfully fetched

## 📊 Error Handling

The app now gracefully handles invalid tokens:

**Before:**
```
❌ Empty menu, no clear error
❌ 404 errors in console
❌ Confusing for users
```

**After:**
```
✅ Clear error message
✅ Shows the invalid token used
✅ Suggests correct URL
✅ Helpful for testing
```

## 🚀 Next Steps

1. Use the correct URL: http://localhost:3000/t/table1abc/menu
2. The menu should load properly
3. Bill starts empty
4. Add items and they'll persist to database

---

**TL;DR: Use `/t/table1abc` not `/t/rest1-1`** 🎯
