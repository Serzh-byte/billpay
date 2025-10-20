# 🔑 BillPay MVP - Quick Reference

## 🚀 Start Servers

### Backend (Django)
```bash
cd server
python manage.py runserver 8000
```
✅ **Status:** Running on http://127.0.0.1:8000

### Frontend (Next.js)
```bash
cd client
npm run dev
```
📍 **Will run on:** http://localhost:3000

## 🎫 Seeded Credentials

### Admin Access
**Token:** `admin123`

**URLs:**
- Dashboard: http://localhost:3000/admin/admin123/dashboard
- Menu Builder: http://localhost:3000/admin/admin123/menu-builder
- QR Codes: http://localhost:3000/admin/admin123/qr
- Settings: http://localhost:3000/admin/admin123/settings

### Customer Access (Table 1)
**Token:** `table1abc`

**URLs:**
- Table Home: http://localhost:3000/t/table1abc
- Menu: http://localhost:3000/t/table1abc/menu
- Payment: http://localhost:3000/t/table1abc/pay
- Receipt: http://localhost:3000/t/table1abc/receipt

## 📋 Restaurant Settings

- **Tax Rate:** 8.75%
- **Service Fee:** 3%
- **Tip Presets:** 15%, 18%, 20%, 25%

## 🍽️ Seeded Menu

### Appetizers
- Spring Rolls - $8.95
- Chicken Wings - $12.95
- Calamari - $14.95

### Main Courses
- Grilled Salmon - $24.95
- Ribeye Steak - $34.95
- Chicken Parmesan - $18.95
- Vegetarian Pasta - $16.95

### Desserts
- Chocolate Lava Cake - $8.95
- Tiramisu - $7.95
- Cheesecake - $7.95

### Beverages
- Soft Drinks - $2.95
- Fresh Juice - $4.95
- Coffee - $3.95

## 🔗 API Endpoints

### Backend Direct (Django)
**Base:** http://localhost:8000/api

### Frontend Proxy (Next.js)
**Base:** http://localhost:3000/api

**Public:**
- GET `/public/table-context/[token]`
- GET `/public/menu/[token]`
- GET `/public/bill/[token]`
- POST `/public/bill/[token]` - Add item
- POST `/public/bill/[token]/pay` - Process payment

**Admin:**
- GET `/admin/dashboard`
- GET/POST `/admin/menu`
- GET/POST `/admin/settings`
- GET `/admin/tables`

## 💳 Test Payment Flow

1. Visit: http://localhost:3000/t/table1abc/menu
2. Add items (e.g., Ribeye Steak + Chocolate Lava Cake)
3. Click "View Cart" or navigate to pay
4. Select tip amount (e.g., 20%)
5. Choose payment mode (Full Bill)
6. Click "Pay Now"
7. View receipt with breakdown

**Expected Totals:**
- Subtotal: $43.90 (34.95 + 8.95)
- Tax (8.75%): $3.84
- Service Fee (3%): $1.32
- Tip (20%): $8.78
- **Total: $57.84**

## 🔧 Test Admin Flow

1. Visit: http://localhost:3000/admin/admin123/dashboard
2. View open checks and revenue
3. Go to Menu Builder
4. Edit a menu item (e.g., change Ribeye price to $39.95)
5. Save changes
6. Go to Settings
7. Update tax rate to 10%
8. Save settings
9. Go to QR Codes
10. View table QR code and diner URL

## 🐛 Quick Troubleshooting

**Backend not responding?**
```bash
# Check if Django is running
curl http://localhost:8000/api/public/table-context/table1abc
```

**Frontend not loading?**
```bash
# Restart Next.js
cd client
npm run dev
```

**Database issues?**
```bash
# Re-seed database
cd server
python manage.py seed
```

## 📚 Documentation

- **Backend:** `server/README.md`
- **Implementation:** `server/IMPLEMENTATION.md`
- **Quick Start:** `server/QUICKSTART.md`
- **Integration:** `INTEGRATION.md`

## ✨ Definition of Done

✅ Backend running on port 8000
✅ Frontend API routes connected
✅ Data transformations working
✅ Customer flow functional
✅ Admin flow functional
✅ Real-time database updates

---

**Ready to test!** Start both servers and visit the URLs above.
