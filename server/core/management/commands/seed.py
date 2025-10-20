from django.core.management.base import BaseCommand
from core.models import Restaurant, Table, MenuCategory, MenuItem


class Command(BaseCommand):
    help = 'Seed database with initial restaurant, table, and menu data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        # Fixed tokens for MVP
        ADMIN_TOKEN = 'admin123'
        TABLE_TOKEN = 'table1abc'
        
        # Create or get restaurant
        admin_token_hash = Restaurant.hash_token(ADMIN_TOKEN)
        restaurant, created = Restaurant.objects.get_or_create(
            admin_token_hash=admin_token_hash,
            defaults={
                'name': 'Demo Restaurant',
                'theme_json': {
                    'primaryColor': '#4F46E5',
                    'secondaryColor': '#10B981',
                    'logo': ''
                },
                'tax_rate': 0.0875,  # 8.75%
                'service_fee_rate': 0.03,  # 3%
                'tip_presets_json': [0.15, 0.18, 0.20, 0.25]
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created restaurant: {restaurant.name}'))
            self.stdout.write(self.style.WARNING(f'  Admin token: {ADMIN_TOKEN}'))
        else:
            self.stdout.write(f'Restaurant already exists: {restaurant.name}')
        
        # Create or get table
        table_token_hash = Table.hash_token(TABLE_TOKEN)
        table, created = Table.objects.get_or_create(
            table_token_hash=table_token_hash,
            defaults={
                'restaurant': restaurant,
                'name': 'Table 1'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created table: {table.name}'))
            self.stdout.write(self.style.WARNING(f'  Table token: {TABLE_TOKEN}'))
        else:
            self.stdout.write(f'Table already exists: {table.name}')
        
        # Create menu categories and items
        if not MenuCategory.objects.filter(restaurant=restaurant).exists():
            # Appetizers
            appetizers = MenuCategory.objects.create(
                restaurant=restaurant,
                name='Appetizers',
                position=1
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=appetizers,
                name='Spring Rolls',
                description='Crispy vegetable spring rolls with sweet chili sauce',
                price_cents=895,
                available=True,
                options_json={}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=appetizers,
                name='Chicken Wings',
                description='Buffalo wings with ranch dressing',
                price_cents=1295,
                available=True,
                options_json={'spicy_level': ['Mild', 'Medium', 'Hot', 'Extra Hot']}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=appetizers,
                name='Calamari',
                description='Fried calamari rings with marinara sauce',
                price_cents=1495,
                available=True,
                options_json={}
            )
            
            # Main Courses
            mains = MenuCategory.objects.create(
                restaurant=restaurant,
                name='Main Courses',
                position=2
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=mains,
                name='Grilled Salmon',
                description='Fresh Atlantic salmon with roasted vegetables',
                price_cents=2495,
                available=True,
                options_json={'cooking': ['Medium', 'Well Done']}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=mains,
                name='Ribeye Steak',
                description='12oz ribeye with garlic mashed potatoes',
                price_cents=3495,
                available=True,
                options_json={'cooking': ['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done']}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=mains,
                name='Chicken Parmesan',
                description='Breaded chicken breast with marinara and mozzarella',
                price_cents=1895,
                available=True,
                options_json={}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=mains,
                name='Vegetarian Pasta',
                description='Penne pasta with seasonal vegetables in tomato sauce',
                price_cents=1695,
                available=True,
                options_json={'pasta_type': ['Penne', 'Spaghetti', 'Fettuccine']}
            )
            
            # Desserts
            desserts = MenuCategory.objects.create(
                restaurant=restaurant,
                name='Desserts',
                position=3
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=desserts,
                name='Chocolate Lava Cake',
                description='Warm chocolate cake with vanilla ice cream',
                price_cents=895,
                available=True,
                options_json={}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=desserts,
                name='Tiramisu',
                description='Classic Italian dessert with coffee and mascarpone',
                price_cents=795,
                available=True,
                options_json={}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=desserts,
                name='Cheesecake',
                description='New York style cheesecake with berry compote',
                price_cents=795,
                available=True,
                options_json={'topping': ['Strawberry', 'Blueberry', 'Mixed Berry', 'Plain']}
            )
            
            # Beverages
            beverages = MenuCategory.objects.create(
                restaurant=restaurant,
                name='Beverages',
                position=4
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=beverages,
                name='Soft Drinks',
                description='Coca-Cola, Sprite, Fanta, Iced Tea',
                price_cents=295,
                available=True,
                options_json={'type': ['Coca-Cola', 'Sprite', 'Fanta', 'Iced Tea']}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=beverages,
                name='Fresh Juice',
                description='Orange, Apple, or Cranberry juice',
                price_cents=495,
                available=True,
                options_json={'type': ['Orange', 'Apple', 'Cranberry']}
            )
            
            MenuItem.objects.create(
                restaurant=restaurant,
                category=beverages,
                name='Coffee',
                description='Freshly brewed coffee',
                price_cents=395,
                available=True,
                options_json={'type': ['Black', 'With Cream', 'Cappuccino', 'Latte']}
            )
            
            self.stdout.write(self.style.SUCCESS('✓ Created menu categories and items'))
        else:
            self.stdout.write('Menu already exists')
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=== Seeding Complete ==='))
        self.stdout.write(self.style.WARNING(f'Admin URL: http://localhost:5173/admin/{ADMIN_TOKEN}'))
        self.stdout.write(self.style.WARNING(f'Table URL: http://localhost:5173/t/{TABLE_TOKEN}'))
        self.stdout.write('')
