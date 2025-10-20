# Admin Access Guide - Demo Restaurant

## Admin Credentials

**Admin Token:** `admin123`

## Admin Dashboard URL

Visit the admin dashboard at:
```
http://localhost:3000/admin/admin123/dashboard
```

## Admin Pages Available

### 1. 📊 Dashboard
**URL:** `http://localhost:3000/admin/admin123/dashboard`

**Features:**
- View key performance indicators (KPIs)
- Open checks count
- Today's revenue
- Real-time stats

---

### 2. 🍽️ Menu Builder
**URL:** `http://localhost:3000/admin/admin123/menu-builder`

**Features:**
- Add/edit/delete menu categories
- Add/edit/delete menu items
- Set prices
- Upload item images
- Mark items as available/unavailable
- Configure item options (spice levels, cooking preferences, etc.)

**You can:**
- Create new categories (e.g., "Appetizers", "Main Courses")
- Add items with:
  - Name
  - Description
  - Price
  - Image URL
  - Options (dropdowns for customizations)
  - Availability toggle

---

### 3. 📱 QR Codes
**URL:** `http://localhost:3000/admin/admin123/qr`

**Features:**
- View QR codes for all tables
- Download QR codes
- Print QR codes for physical display
- Each QR code links to table's ordering page

**How it works:**
- Each table has a unique QR code
- Customers scan QR → Opens menu on their phone
- They can order and pay directly

---

### 4. ⚙️ Settings
**URL:** `http://localhost:3000/admin/admin123/settings`

**Features:**
- Configure tax rate
- Set service fee percentage
- Customize tip presets (15%, 18%, 20%, 25%)
- Update restaurant theme colors
- Manage restaurant name

---

## Quick Access Links

| Page | URL |
|------|-----|
| **Dashboard** | http://localhost:3000/admin/admin123/dashboard |
| **Menu Builder** | http://localhost:3000/admin/admin123/menu-builder |
| **QR Codes** | http://localhost:3000/admin/admin123/qr |
| **Settings** | http://localhost:3000/admin/admin123/settings |

---

## Admin Navigation

Once you're on any admin page, you'll see a navigation menu with:
- 📊 Dashboard
- 🍽️ Menu Builder
- 📱 QR Codes
- ⚙️ Settings

You can easily switch between pages using the navigation.

---

## Current Configuration

### Restaurant Details:
- **Name:** Demo Restaurant
- **Tax Rate:** 8.75%
- **Service Fee:** 3%
- **Tip Presets:** 15%, 18%, 20%, 25%

### Menu:
- **Categories:** 4 (Appetizers, Main Courses, Desserts, Beverages)
- **Items:** 15 menu items with images and prices

### Tables:
- **Table 1:** Token `table1abc`
  - Customer URL: http://localhost:3000/t/table1abc
- **Table 2:** Token `rest1-1`
  - Customer URL: http://localhost:3000/t/rest1-1

---

## Common Admin Tasks

### 📝 Add a New Menu Item
1. Go to Menu Builder: http://localhost:3000/admin/admin123/menu-builder
2. Click "Add New Item" or similar button
3. Fill in:
   - Category
   - Name (e.g., "Lobster Thermidor")
   - Description
   - Price (in dollars, e.g., 45.99)
   - Image URL (from Unsplash or other source)
   - Options (if any)
4. Save

### 💰 Change Tax Rate
1. Go to Settings: http://localhost:3000/admin/admin123/settings
2. Update "Tax Rate" field
3. Save changes
4. All future orders will use new rate

### 🎨 Customize Theme
1. Go to Settings: http://localhost:3000/admin/admin123/settings
2. Change primary/secondary colors
3. Save
4. Customer-facing pages will reflect new theme

### 🖨️ Print QR Codes for Tables
1. Go to QR Codes: http://localhost:3000/admin/admin123/qr
2. View QR code for each table
3. Download or print
4. Place on physical tables
5. Customers scan to order

---

## Security Notes

⚠️ **Important:**
- The admin token (`admin123`) is what grants you access
- Anyone with this token can access the admin panel
- In production, use a strong, random token
- Keep your admin token secret
- Consider adding password authentication for production

---

## Troubleshooting

### Can't Access Admin Panel?
**Check:**
1. ✅ Next.js server is running on port 3000
2. ✅ Django server is running on port 8000
3. ✅ Using correct URL with token: `/admin/admin123/dashboard`
4. ✅ No typos in the token

### Getting 404 Errors?
- Ensure both servers are running
- Hard refresh browser (Ctrl + Shift + R)
- Check browser console for errors

### Data Not Updating?
- Hard refresh the page
- Check Django server logs for errors
- Verify database connection

---

## API Endpoints (for reference)

The admin pages use these Django API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/dashboard` | GET | Fetch KPIs and stats |
| `/api/admin/menu/categories` | GET/POST | List/create categories |
| `/api/admin/menu/categories/{id}` | PUT/DELETE | Update/delete category |
| `/api/admin/menu/items` | GET/POST | List/create menu items |
| `/api/admin/menu/items/{id}` | PUT/DELETE | Update/delete menu item |
| `/api/admin/settings` | GET/PATCH | View/update settings |
| `/api/admin/tables` | GET | List tables with QR data |

All admin endpoints require the `X-Admin-Token` header with value `admin123`.

---

## Quick Start

**To start viewing the admin panel right now:**

1. **Ensure servers are running:**
   ```bash
   # Terminal 1 - Django
   cd server
   python manage.py runserver

   # Terminal 2 - Next.js
   cd client
   npm run dev
   ```

2. **Open your browser and visit:**
   ```
   http://localhost:3000/admin/admin123/dashboard
   ```

3. **You should see:**
   - Dashboard with stats
   - Navigation menu on the side
   - Your restaurant's data

That's it! You're now in the admin panel. 🎉

---

## Demo Workflow

**Try this to see the full system in action:**

1. **As Admin:**
   - Go to http://localhost:3000/admin/admin123/menu-builder
   - Add a new menu item (e.g., "Tiramisu Deluxe" - $12.99)

2. **As Customer:**
   - Open http://localhost:3000/t/rest1-1/menu
   - See your new item in the menu
   - Add it to bill
   - Go to payment
   - Complete payment

3. **Back to Admin:**
   - Go to http://localhost:3000/admin/admin123/dashboard
   - See updated revenue stats

This demonstrates the full loop: Admin creates menu → Customer orders → Admin sees results!

---

## Need Help?

If you have questions about:
- Adding specific features to admin panel
- Changing admin authentication
- Customizing admin UI
- Adding new admin capabilities

Just ask! 😊
