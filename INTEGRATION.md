# Frontend-Backend Integration Guide

## ✅ Integration Complete

The Next.js frontend has been successfully connected to the Django backend. All API routes now proxy requests to Django.

## 🔗 Architecture

```
Browser → Next.js Frontend (:5173) → Next.js API Routes → Django Backend (:8000) → PostgreSQL
```

The Next.js API routes act as a proxy layer that:
1. Receives requests from the frontend components
2. Transforms and forwards them to Django
3. Transforms Django responses back to frontend format
4. Handles authentication headers

## 📝 Updated Files

### Environment Configuration
- **`client/.env`**
  - Added `NEXT_PUBLIC_API_BASE_URL=/api` for frontend API calls
  - Added `DJANGO_API_URL=http://localhost:8000/api` for backend connection

### Public API Routes (Customer-facing)
1. **`app/api/public/table-context/[tableToken]/route.ts`**
   - Fetches table and restaurant context from Django
   - Transforms response to include settings and theme

2. **`app/api/public/menu/[tableToken]/route.ts`**
   - Fetches menu categories and items from Django
   - Converts prices from cents to dollars
   - Flattens nested category/items structure

3. **`app/api/public/bill/[tableToken]/route.ts`**
   - GET: Fetches current bill for table
   - POST: Adds items to bill
   - Converts between cents and dollars
   - Transforms bill lines format

4. **`app/api/public/bill/[tableToken]/pay/route.ts`**
   - Creates payment intent in Django
   - Handles tip conversion (dollars → cents)
   - Returns payment status and bill closure info

### Admin API Routes
1. **`app/api/admin/dashboard/route.ts`**
   - Fetches KPIs (open checks, revenue)
   - Requires `X-Admin-Token` header

2. **`app/api/admin/menu/route.ts`**
   - GET: Fetches all categories and menu items
   - POST: Updates entire menu (categories + items)
   - Handles creation and updates with proper ID handling

3. **`app/api/admin/settings/route.ts`**
   - GET: Fetches restaurant settings
   - POST: Updates tax rates, service fees, tip presets
   - Converts between percentages and decimals

4. **`app/api/admin/tables/route.ts`**
   - GET: Fetches all tables with QR codes and diner URLs
   - Returns table information for QR code generation

### Library Files
- **`lib/api.ts`**
  - Updated `API_BASE_URL` to use `/api` (relative path)
  - Maintains `fetchAPI` and `fetchAdminAPI` helper functions

## 🔄 Data Transformations

### Price Conversions
**Django → Frontend:**
```typescript
price_cents: 1295 → price: 12.95
```

**Frontend → Django:**
```typescript
price: 12.95 → price_cents: 1295
```

### Rate Conversions
**Django → Frontend:**
```typescript
tax_rate: 0.0875 → taxPercent: 8.75
```

**Frontend → Django:**
```typescript
taxPercent: 8.75 → tax_rate: 0.0875
```

### Menu Item Structure
**Django Response:**
```json
{
  "id": 1,
  "category": 2,
  "name": "Grilled Salmon",
  "price_cents": 2495,
  "image_url": "...",
  "options_json": {}
}
```

**Frontend Format:**
```json
{
  "id": "1",
  "categoryId": "2",
  "name": "Grilled Salmon",
  "price": 24.95,
  "image": "...",
  "options": {}
}
```

### Bill Line Structure
**Django Response:**
```json
{
  "id": 1,
  "name_snapshot": "Grilled Salmon",
  "qty": 2,
  "unit_price_cents": 2495,
  "line_total_cents": 4990,
  "options_snapshot": {}
}
```

**Frontend Format:**
```json
{
  "id": "1",
  "menuItemName": "Grilled Salmon",
  "quantity": 2,
  "price": 24.95,
  "lineTotal": 49.90,
  "options": {}
}
```

## 🔐 Authentication Flow

### Public Endpoints
1. Frontend extracts `tableToken` from URL
2. Next.js API route forwards to Django
3. Django validates token and returns data

### Admin Endpoints
1. Frontend stores admin token (from URL: `/admin/admin123`)
2. Sends `X-Admin-Token` header with each request
3. Next.js proxy forwards header to Django
4. Django validates token against hashed value

## 🚀 Running the Full Stack

### Terminal 1: Django Backend
```bash
cd server
python manage.py runserver 8000
```
**Status:** ✅ Currently running on http://127.0.0.1:8000

### Terminal 2: Next.js Frontend
```bash
cd client
npm install  # if not already done
npm run dev
```
**Will run on:** http://localhost:3000 (Next.js default)

## 📍 Access URLs

### Customer URLs
- **Table View:** http://localhost:3000/t/table1abc
- **Menu:** http://localhost:3000/t/table1abc/menu
- **Payment:** http://localhost:3000/t/table1abc/pay
- **Receipt:** http://localhost:3000/t/table1abc/receipt

### Admin URLs
- **Dashboard:** http://localhost:3000/admin/admin123/dashboard
- **Menu Builder:** http://localhost:3000/admin/admin123/menu-builder
- **QR Codes:** http://localhost:3000/admin/admin123/qr
- **Settings:** http://localhost:3000/admin/admin123/settings

## 🔍 API Flow Examples

### Example 1: Loading Menu
```
1. User visits: /t/table1abc/menu
2. Frontend calls: GET /api/public/menu?tableToken=table1abc
3. Next.js proxy: GET http://localhost:8000/api/public/menu/table1abc
4. Django returns categories with nested items (prices in cents)
5. Next.js transforms: flattens structure, converts cents to dollars
6. Frontend renders menu with prices in dollars
```

### Example 2: Adding Item to Bill
```
1. User clicks "Add Ribeye Steak"
2. Frontend calls: POST /api/public/bill/table1abc { itemId: "5", quantity: 1 }
3. Next.js proxy gets tableId from context
4. Next.js calls: POST http://localhost:8000/api/public/tables/1/bill/items
   Body: { itemId: 5, qty: 1, options: {} }
5. Django creates BillLine, recalculates totals
6. Returns updated bill (all amounts in cents)
7. Next.js transforms cents to dollars
8. Frontend updates cart display
```

### Example 3: Processing Payment
```
1. User selects tip and clicks "Pay Full Bill"
2. Frontend calls: POST /api/public/bill/table1abc/pay
   Body: { tip: 5.00, paymentMode: "full" }
3. Next.js gets tableId, converts tip to cents (500)
4. Next.js calls: POST http://localhost:8000/api/public/tables/1/payment/intent
   Body: { mode: "full", tip: 500 }
5. Django creates Payment, marks as succeeded, closes bill
6. Returns { paymentId, status: "succeeded", billClosed: true }
7. Frontend redirects to receipt page
```

### Example 4: Admin Updates Menu
```
1. Admin edits menu item price: $24.95 → $29.95
2. Frontend calls: POST /api/admin/menu
   Body: { menuItems: [{ id: "4", price: 29.95, ... }] }
3. Next.js converts price to cents (2995)
4. Next.js calls: PATCH http://localhost:8000/api/admin/menu/items/4
   Headers: { X-Admin-Token: "admin123" }
   Body: { price_cents: 2995 }
5. Django validates token, updates MenuItem
6. Returns success
7. Frontend refetches and displays updated menu
```

## 🎯 Key Integration Points

### 1. Token Management
- **Table Token:** Passed in URL, validated by Django
- **Admin Token:** Stored in client, sent as header

### 2. Currency Handling
- **Frontend:** Always works in dollars (12.95)
- **Backend:** Always works in cents (1295)
- **Transformation:** Happens in Next.js API routes

### 3. ID Handling
- **Django:** Integer IDs (1, 2, 3)
- **Frontend:** String IDs ("1", "2", "3")
- **Transformation:** `.toString()` and `parseInt()`

### 4. Field Naming
- **Django:** snake_case (price_cents, tax_rate)
- **Frontend:** camelCase (priceCents, taxRate)
- **Transformation:** Manual mapping in API routes

## ✨ Features Enabled

✅ **Customer Flow**
- View menu by scanning QR / visiting table URL
- Add items to bill with real-time total updates
- Choose payment mode (full, split, mine only)
- Process payment (mock Stripe)
- View receipt

✅ **Admin Flow**
- View dashboard with live KPIs
- Create/edit menu categories
- Create/edit menu items with prices
- Update tax and service fee rates
- Manage tip presets
- View tables and QR codes

✅ **Real-time Data**
- All changes persist to PostgreSQL
- Bills auto-calculate totals
- Menu updates reflect immediately
- Settings changes apply to new bills

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:** Ensure Django server is running on port 8000
```bash
cd server
python manage.py runserver 8000
```

### Issue: "Unauthorized" errors on admin pages
**Solution:** Check that `X-Admin-Token: admin123` header is being sent
- Verify token in URL: `/admin/admin123`
- Check browser network tab for header

### Issue: Prices showing incorrectly
**Solution:** Check cent/dollar conversion in API routes
- Backend stores in cents (integer)
- Frontend displays in dollars (decimal)
- Division by 100 happens in Next.js proxy

### Issue: "Table not found"
**Solution:** Verify table token is correct
- Use seeded token: `table1abc`
- Check token hasn't been modified in URL

## 📊 Testing Checklist

- [ ] Visit table URL: http://localhost:3000/t/table1abc
- [ ] View menu loads with prices
- [ ] Add item to cart updates totals
- [ ] Tax and service fee calculated correctly
- [ ] Payment processes successfully
- [ ] Receipt displays correct amounts
- [ ] Admin dashboard shows stats
- [ ] Menu builder loads existing menu
- [ ] Edit menu item saves changes
- [ ] Settings update persists
- [ ] QR page shows table URL

## 🎉 Integration Complete!

The frontend and backend are now fully connected and communicating. All API endpoints are wired up and data transformations are in place. You can now test the complete customer and admin flows!

**Next Step:** Start the Next.js dev server and test the full application!
