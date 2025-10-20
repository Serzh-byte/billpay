# BillPay Django Backend

Django REST Framework backend for the BillPay MVP application.

## Setup

### Prerequisites
- Python 3.8+
- PostgreSQL database (Railway)

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file (already configured):
```
DATABASE_URL=postgresql://postgres:hYBdMYEAyseLxBkKqeZlPTAcRpwaeCPT@hopper.proxy.rlwy.net:10960/railway
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Seed the database:
```bash
python manage.py seed
```

This will create:
- A demo restaurant with theme, tax, and tip settings
- One table with a fixed token
- A complete menu with categories and items

### Seeded Tokens

**Admin Token:** `admin123`
- Admin URL: http://localhost:5173/admin/admin123

**Table Token:** `table1abc`
- Table URL: http://localhost:5173/t/table1abc

### Running the Server

```bash
python manage.py runserver 8000
```

The API will be available at http://localhost:8000/api/

## API Endpoints

### Public Endpoints

#### Table Context
```
GET /api/public/table-context/<table_token>
```
Returns restaurant context for a table (theme, tax rates, tip presets).

#### Menu
```
GET /api/public/menu/<table_token>
```
Returns the restaurant menu with categories and items.

#### Bill Operations
```
GET /api/public/tables/<table_id>/bill
```
Get the current open bill for a table.

```
POST /api/public/tables/<table_id>/bill/items
Body: { itemId, qty, options }
```
Add an item to the bill. Automatically recalculates totals.

#### Payment
```
POST /api/public/tables/<table_id>/payment/intent
Body: { mode: "full"|"split_even"|"mine_only", seats?: number, tip?: number }
```
Create a payment (mock Stripe). Returns payment details and closes bill if fully paid.

#### Receipt
```
POST /api/public/receipt/email
Body: { email, billId }
```
Send receipt via email (stub - returns 200 OK).

### Admin Endpoints

All admin endpoints require `X-Admin-Token` header.

#### Dashboard
```
GET /api/admin/dashboard
```
Returns KPIs: open checks count, today's revenue.

#### Menu Categories
```
GET /api/admin/menu/categories
POST /api/admin/menu/categories
GET /api/admin/menu/categories/<id>
PATCH /api/admin/menu/categories/<id>
DELETE /api/admin/menu/categories/<id>
```

#### Menu Items
```
GET /api/admin/menu/items
POST /api/admin/menu/items
GET /api/admin/menu/items/<id>
PATCH /api/admin/menu/items/<id>
DELETE /api/admin/menu/items/<id>
```

#### Tables
```
GET /api/admin/tables
POST /api/admin/tables
Body: { name }
```
Returns tables with diner URLs and QR data.

#### Settings
```
GET /api/admin/settings
PATCH /api/admin/settings
Body: { name?, theme_json?, tax_rate?, service_fee_rate?, tip_presets_json? }
```

## Data Models

### Restaurant
- `name`: Restaurant name
- `theme_json`: Theme configuration (colors, logo)
- `tax_rate`: Tax rate (decimal, e.g., 0.0875 for 8.75%)
- `service_fee_rate`: Service fee rate (decimal)
- `tip_presets_json`: Array of tip preset percentages
- `admin_token_hash`: Hashed admin token

### Table
- `restaurant`: Foreign key to Restaurant
- `name`: Table name
- `table_token_hash`: Hashed table token

### MenuCategory
- `restaurant`: Foreign key to Restaurant
- `name`: Category name
- `position`: Display order

### MenuItem
- `restaurant`: Foreign key to Restaurant
- `category`: Foreign key to MenuCategory
- `name`: Item name
- `description`: Item description
- `price_cents`: Price in cents
- `image_url`: Optional image URL
- `available`: Availability flag
- `options_json`: Item options (e.g., size, cooking level)

### Bill
- `restaurant`: Foreign key to Restaurant
- `table`: Foreign key to Table
- `is_open`: Open/closed status
- `subtotal_cents`: Subtotal in cents
- `tax_cents`: Tax amount in cents
- `service_fee_cents`: Service fee in cents
- `tip_cents`: Tip amount in cents
- `total_cents`: Total amount in cents

### BillLine
- `bill`: Foreign key to Bill
- `item`: Foreign key to MenuItem (nullable)
- `name_snapshot`: Item name at order time
- `options_snapshot`: Selected options
- `qty`: Quantity
- `unit_price_cents`: Price per unit in cents
- `line_total_cents`: Line total in cents

### Payment
- `bill`: Foreign key to Bill
- `status`: Payment status (pending/succeeded/failed)
- `amount_cents`: Amount in cents
- `provider`: Payment provider (default: "stripe")
- `provider_ref`: Provider reference ID

## Authentication

### Public Endpoints
Public endpoints resolve the table token from the URL to identify the restaurant and table.

### Admin Endpoints
Admin endpoints require the `X-Admin-Token` header. The token is validated against the hashed token stored in the Restaurant model.

Example:
```
X-Admin-Token: admin123
```

## Currency Handling

All monetary values are stored and transmitted in **cents** (integers) to avoid floating-point precision issues. The frontend is responsible for formatting currency displays.

Example:
- $12.95 is stored as `1295`
- $100.00 is stored as `10000`

## Payment Flow (Mock)

For the MVP, payments are mocked:
1. Frontend requests payment intent
2. Backend calculates amount based on mode (full/split/mine)
3. Backend creates a Payment record with `status="succeeded"`
4. Backend updates bill totals and closes bill if fully paid
5. No actual Stripe integration or webhooks

## Future Extensions

The current single-restaurant, single-table structure can be extended:
- Multi-tenancy: Filter all queries by `restaurant_id`
- Table management: Create/delete tables dynamically
- Real payments: Integrate Stripe webhooks
- WebSockets: Real-time bill updates
- Line-item selection: "Pay for my items only" mode
- Split by seat: Assign items to specific seats

## Management Commands

### seed
Seeds the database with initial data:
```bash
python manage.py seed
```

This is idempotent - it won't create duplicates if run multiple times.

## Development

### Adding New Endpoints
1. Create view in `core/views_public.py` or `core/views_admin.py`
2. Add URL pattern in `core/urls.py`
3. Test with curl or Postman

### Database Migrations
After model changes:
```bash
python manage.py makemigrations core
python manage.py migrate
```

### Testing
Test endpoints with curl:
```bash
# Public endpoint
curl http://localhost:8000/api/public/table-context/table1abc

# Admin endpoint
curl -H "X-Admin-Token: admin123" http://localhost:8000/api/admin/dashboard
```
