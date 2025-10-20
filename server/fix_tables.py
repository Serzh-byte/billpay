"""
Fix script to update existing tables with restaurant_slug and table_number
"""
from core.models import Table

print("Updating existing tables...")

tables = Table.objects.all()
print(f"Found {tables.count()} tables")

for i, table in enumerate(tables, 1):
    table.restaurant_slug = 'rest1'
    table.table_number = str(i)
    table.save()
    print(f"✓ Updated {table.name}: rest1-{i}")

print("\nDone! Tables updated:")
for table in Table.objects.all():
    print(f"  - {table.name}: {table.table_token}")
