# Quick Start Guide

## 🚀 Backend is Ready!

The Django backend has been successfully created and is currently running on port 8000.

### ✅ What's Been Done

1. **Database Setup**
   - PostgreSQL connected via Railway
   - All migrations applied
   - Database seeded with demo data

2. **API Endpoints**
   - 6 public endpoints (menu, bill, payment)
   - 7 admin endpoints (dashboard, CRUD, settings)
   - All endpoints tested and working

3. **Authentication**
   - Admin token authentication implemented
   - Table token resolution working
   - CORS enabled for http://localhost:5173

4. **Seeded Data**
   - Demo Restaurant with full menu (15 items)
   - One table ready to use
   - Fixed tokens for testing

### 🔑 Access Credentials

**Admin Panel:**
- Token: `admin123`
- URL: http://localhost:5173/admin/admin123

**Customer Table:**
- Token: `table1abc`
- URL: http://localhost:5173/t/table1abc

### 🧪 Test the API

Open a new terminal and try these commands:

**Test Table Context:**
```bash
curl http://localhost:8000/api/public/table-context/table1abc
```

**Test Menu:**
```bash
curl http://localhost:8000/api/public/menu/table1abc
```

**Test Admin Dashboard:**
```bash
curl -H "X-Admin-Token: admin123" http://localhost:8000/api/admin/dashboard
```

### 📋 API Base URL

The frontend should use:
```
http://localhost:8000
```

This is already configured in `client/.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 🔄 Server Status

✅ Server is running at: http://127.0.0.1:8000/
✅ Database is connected and seeded
✅ All endpoints are live

### 📚 Documentation

- **README.md** - Setup and usage instructions
- **IMPLEMENTATION.md** - Complete implementation details
- **API Documentation** - See README.md for all endpoints

### 🎯 Next Steps

1. **Start Frontend:**
   ```bash
   cd client
   npm install  # if not already done
   npm run dev
   ```

2. **Test the Full Flow:**
   - Visit admin panel: http://localhost:5173/admin/admin123
   - Edit menu, view dashboard, manage tables
   - Visit table URL: http://localhost:5173/t/table1abc
   - Browse menu, add items, proceed to payment

3. **Development:**
   - Backend runs on port 8000
   - Frontend runs on port 5173
   - Both should be running simultaneously

### 🐛 Troubleshooting

**Port 8000 in use?**
```bash
# Stop the current server (Ctrl+C)
# Start on different port:
python manage.py runserver 8001
# Update client/.env: VITE_API_BASE_URL=http://localhost:8001
```

**Database connection issues?**
- Check .env file has correct DATABASE_URL
- Verify Railway database is accessible

**CORS errors?**
- Ensure client is running on http://localhost:5173
- Check server/server/settings.py CORS_ALLOWED_ORIGINS

### 💡 Common API Patterns

**Adding an item to a bill:**
```bash
curl -X POST http://localhost:8000/api/public/tables/1/bill/items \
  -H "Content-Type: application/json" \
  -d '{"itemId": 1, "qty": 2, "options": {}}'
```

**Creating a payment:**
```bash
curl -X POST http://localhost:8000/api/public/tables/1/payment/intent \
  -H "Content-Type: application/json" \
  -d '{"mode": "full", "tip": 500}'
```

**Updating restaurant settings:**
```bash
curl -X PATCH http://localhost:8000/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: admin123" \
  -d '{"tax_rate": 0.10}'
```

### 📊 Seeded Menu Preview

**Appetizers:**
- Spring Rolls - $8.95
- Chicken Wings - $12.95
- Calamari - $14.95

**Main Courses:**
- Grilled Salmon - $24.95
- Ribeye Steak - $34.95
- Chicken Parmesan - $18.95
- Vegetarian Pasta - $16.95

**Desserts:**
- Chocolate Lava Cake - $8.95
- Tiramisu - $7.95
- Cheesecake - $7.95

**Beverages:**
- Soft Drinks - $2.95
- Fresh Juice - $4.95
- Coffee - $3.95

---

## ✨ You're All Set!

The backend is fully functional and ready to power your billpay frontend. Happy coding! 🎉
