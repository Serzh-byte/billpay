"""
Script to create a custom table with a specific token.
Run this from the server directory:
python create_custom_table.py
"""

import os
import django
import hashlib

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from core.models import Restaurant, Table

# Get the existing restaurant
restaurant = Restaurant.objects.first()

if not restaurant:
    print("❌ No restaurant found. Run 'python manage.py seed' first.")
    exit(1)

# Create a new table with custom token
custom_token = "rest1-1"
table_token_hash = hashlib.sha256(custom_token.encode()).hexdigest()

table, created = Table.objects.get_or_create(
    table_token_hash=table_token_hash,
    defaults={
        'restaurant': restaurant,
        'name': 'Table Rest1-1'
    }
)

if created:
    print(f"✅ Created new table with token: {custom_token}")
    print(f"   Table ID: {table.id}")
    print(f"   Table Name: {table.name}")
    print(f"   URL: http://localhost:3000/t/{custom_token}/menu")
else:
    print(f"ℹ️  Table with token '{custom_token}' already exists")
    print(f"   Table ID: {table.id}")
    print(f"   URL: http://localhost:3000/t/{custom_token}/menu")
