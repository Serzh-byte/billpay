import os
import sys
import django

# Add the parent directory to the path so we can import from core
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from core.models import MenuItem, MenuCategory

# Delete all menu items and categories
MenuItem.objects.all().delete()
MenuCategory.objects.all().delete()

print("✅ Cleared all menu items and categories")
print("Now run: python manage.py seed")
