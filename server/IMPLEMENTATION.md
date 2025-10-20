# BillPay Backend - Implementation Summary

## ✅ Completed Implementation

A fully functional Django REST Framework backend has been created for the BillPay MVP.

## 🗂️ Project Structure

```
server/
├── manage.py
├── requirements.txt
├── .env
├── README.md
├── server/
│   ├── __init__.py
│   ├── settings.py      # Configured with PostgreSQL, CORS, DRF
│   ├── urls.py          # Main URL routing
│   ├── asgi.py
│   └── wsgi.py
└── core/
    ├── __init__.py
    ├── models.py        # 7 models: Restaurant, Table, MenuCategory, MenuItem, Bill, BillLine, Payment
    ├── serializers.py   # DRF serializers for all models
    ├── views_public.py  # 6 public API endpoints
    ├── views_admin.py   # 7 admin API endpoints
    ├── urls.py          # API URL patterns
    ├── authentication.py # Admin token auth + table token resolver
    ├── admin.py
    ├── apps.py
    └── management/
        └── commands/
            └── seed.py   # Database seeding command
```

## 🔧 Configuration

### Environment Variables (.env)
- `DATABASE_URL`: PostgreSQL connection to Railway
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode flag
- `ALLOWED_HOSTS`: Allowed hosts
- `CORS_ALLOWED_ORIGINS`: CORS whitelist (http://localhost:5173)

### Database
- **Provider**: PostgreSQL on Railway
- **Connection**: Configured via `DATABASE_URL`
- **Migrations**: Created and applied successfully

## 📊 Data Models

### 1. Restaurant
- Name, theme JSON, tax rate, service fee rate, tip presets
- Admin token (SHA-256 hashed)
- One-to-many: Tables, MenuCategories, MenuItems, Bills

### 2. Table
- Restaurant reference, name, table token (SHA-256 hashed)
- One-to-many: Bills

### 3. MenuCategory
- Restaurant reference, name, position
- One-to-many: MenuItems
- Ordered by position

### 4. MenuItem
- Restaurant reference, category reference
- Name, description, price (cents), image URL, availability
- Options JSON for customization (size, cooking level, etc.)

### 5. Bill
- Restaurant reference, table reference
- Open/closed status
- Subtotal, tax, service fee, tip, total (all in cents)
- Auto-calculates totals via `recalculate_totals()` method
- One-to-many: BillLines, Payments

### 6. BillLine
- Bill reference, menu item reference (nullable)
- Name snapshot, options snapshot
- Quantity, unit price, line total (cents)

### 7. Payment
- Bill reference
- Status (pending/succeeded/failed), amount (cents)
- Provider (stripe), provider reference
- Mock implementation for MVP

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)

1. **GET** `/api/public/table-context/<table_token>`
   - Returns restaurant context for table
   - Response: restaurantId, tableId, theme, taxRate, serviceFeeRate, tipPresets

2. **GET** `/api/public/menu/<table_token>`
   - Returns menu with categories and items
   - Response: Array of categories with nested items

3. **GET** `/api/public/tables/<table_id>/bill`
   - Returns current open bill for table
   - Auto-creates bill if none exists
   - Response: Bill with lines array

4. **POST** `/api/public/tables/<table_id>/bill/items`
   - Add item to bill
   - Body: `{ itemId, qty, options }`
   - Auto-recalculates totals

5. **POST** `/api/public/tables/<table_id>/payment/intent`
   - Create payment (mock Stripe)
   - Body: `{ mode: "full"|"split_even"|"mine_only", seats?: number, tip?: number }`
   - Marks payment as succeeded immediately
   - Closes bill if fully paid

6. **POST** `/api/public/receipt/email`
   - Send receipt (stub)
   - Body: `{ email, billId }`
   - Returns 200 OK

### Admin Endpoints (Require `X-Admin-Token` Header)

7. **GET** `/api/admin/dashboard`
   - Returns KPIs: open checks, today's revenue

8. **CRUD** `/api/admin/menu/categories`
   - GET: List all categories
   - POST: Create category
   - GET /<id>: Get category
   - PATCH /<id>: Update category
   - DELETE /<id>: Delete category

9. **CRUD** `/api/admin/menu/items`
   - GET: List all items
   - POST: Create item
   - GET /<id>: Get item
   - PATCH /<id>: Update item
   - DELETE /<id>: Delete item

10. **GET/POST** `/api/admin/tables`
    - GET: List tables with diner URLs and QR data
    - POST: Create table (generates token)

11. **GET/PATCH** `/api/admin/settings`
    - GET: Get restaurant settings
    - PATCH: Update settings (tax, fees, tips, theme)

## 🔐 Authentication

### Table Token Resolution (Public)
- Extracts `table_token` from URL
- Hashes and looks up in database
- Returns Restaurant and Table objects
- Used by all public endpoints

### Admin Token Authentication
- Custom DRF authentication class
- Reads `X-Admin-Token` header
- Hashes and validates against Restaurant.admin_token_hash
- Sets `request.user` to Restaurant object
- Required for all admin endpoints

## 🌱 Seeded Data

Running `python manage.py seed` creates:

### Restaurant: "Demo Restaurant"
- Tax rate: 8.75%
- Service fee: 3%
- Tip presets: [15%, 18%, 20%, 25%]
- **Admin token**: `admin123`

### Table: "Table 1"
- **Table token**: `table1abc`

### Menu (4 categories, 15 items):

**Appetizers** (3 items)
- Spring Rolls - $8.95
- Chicken Wings - $12.95 (with spicy level options)
- Calamari - $14.95

**Main Courses** (4 items)
- Grilled Salmon - $24.95 (with cooking options)
- Ribeye Steak - $34.95 (with cooking options)
- Chicken Parmesan - $18.95
- Vegetarian Pasta - $16.95 (with pasta type options)

**Desserts** (3 items)
- Chocolate Lava Cake - $8.95
- Tiramisu - $7.95
- Cheesecake - $7.95 (with topping options)

**Beverages** (3 items)
- Soft Drinks - $2.95 (with type options)
- Fresh Juice - $4.95 (with type options)
- Coffee - $3.95 (with type options)

## 💰 Currency Handling

- All prices stored as **integers in cents**
- Avoids floating-point precision issues
- Frontend responsible for formatting ($12.95)
- Example: $34.95 stored as `3495`

## 🔄 Bill Flow

1. Customer views menu via table token
2. Customer adds items → BillLines created
3. Bill totals auto-calculated:
   - Subtotal = sum of line totals
   - Tax = subtotal × tax_rate
   - Service fee = subtotal × service_fee_rate
   - Total = subtotal + tax + service fee + tip
4. Customer chooses payment mode and tip
5. Payment created with status "succeeded" (mock)
6. Bill closed if fully paid

## 🎯 Payment Modes

1. **full**: Pay entire bill + tip
2. **split_even**: (subtotal + tax + service) ÷ seats + tip
3. **mine_only**: Same as full for MVP (would need line selection in production)

## 🚀 Running the Backend

### First Time Setup
```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
```

### Start Server
```bash
python manage.py runserver 8000
```

Server runs at: http://localhost:8000

### Test Endpoints
```bash
# Public endpoint
curl http://localhost:8000/api/public/table-context/table1abc

# Admin endpoint
curl -H "X-Admin-Token: admin123" http://localhost:8000/api/admin/dashboard
```

## 📱 Frontend Integration

The client should use these URLs:
- **Admin Panel**: http://localhost:5173/admin/admin123
- **Diner Table**: http://localhost:5173/t/table1abc

Set in `client/.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

## ✨ Key Features

✅ **Single-restaurant, single-table** (easily extensible)  
✅ **REST-only** (no WebSockets)  
✅ **Token-based auth** (SHA-256 hashed)  
✅ **Auto-calculating bills** (tax, service fee, totals)  
✅ **Mock payments** (Stripe-style, immediate success)  
✅ **CORS enabled** for localhost:5173  
✅ **Seeded test data** with fixed tokens  
✅ **Admin CRUD** for menu management  
✅ **PostgreSQL** on Railway  
✅ **Comprehensive API** matching MVP requirements  

## 🔮 Extension Points

The architecture supports future enhancements:
- **Multi-tenancy**: Add restaurant filtering to all queries
- **Dynamic tables**: Create/delete tables via admin
- **Real Stripe**: Add webhooks and intent confirmation
- **WebSockets**: Real-time bill updates
- **Seat management**: Assign items to specific seats
- **Line-item split**: Pay for selected items only
- **Receipt generation**: PDF generation and email
- **Analytics**: Revenue reports, popular items
- **Reservations**: Table booking system
- **QR generation**: Server-side QR code creation

## 📝 Definition of Done - ✅ Complete

✅ Database migrations created and applied  
✅ Models for all entities (Restaurant, Table, Menu, Bill, Payment)  
✅ Public endpoints for table context, menu, bill, payment  
✅ Admin endpoints for dashboard, CRUD operations, settings  
✅ Authentication (admin token, table token resolution)  
✅ Seeded data with fixed tokens  
✅ Server running on port 8000  
✅ CORS configured for frontend  
✅ All prices in cents  
✅ Mock payment flow  
✅ Documentation and README  

## 🎉 Ready to Use!

The backend is **fully functional** and ready to power the frontend MVP. All endpoints are tested and working with the seeded database.

**Seeded Credentials:**
- Admin: `admin123`
- Table: `table1abc`

**Next Steps:**
1. Ensure frontend `.env` has `VITE_API_BASE_URL=http://localhost:8000`
2. Start frontend dev server: `npm run dev` in client directory
3. Test full flow:
   - Visit http://localhost:5173/admin/admin123 for admin panel
   - Visit http://localhost:5173/t/table1abc for customer view
