from django.db import models
import hashlib


class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    theme_json = models.JSONField(default=dict, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)  # e.g., 0.0875 for 8.75%
    service_fee_rate = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    tip_presets_json = models.JSONField(default=list, blank=True)  # e.g., [0.15, 0.18, 0.20]
    admin_token_hash = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode()).hexdigest()


class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables')
    restaurant_slug = models.CharField(max_length=50, default='rest1')  # e.g., 'rest1'
    table_number = models.CharField(max_length=10, default='1')  # e.g., '1', '2', '3'
    name = models.CharField(max_length=100)
    table_token_hash = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"
    
    @property
    def table_token(self):
        """Return the public table token in format: {restaurant_slug}-{table_number}"""
        return f"{self.restaurant_slug}-{self.table_number}"

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode()).hexdigest()


class MenuCategory(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_categories')
    name = models.CharField(max_length=255)
    position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['position', 'id']
        verbose_name_plural = 'Menu Categories'

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price_cents = models.IntegerField()
    image_url = models.URLField(blank=True, null=True)
    available = models.BooleanField(default=True)
    options_json = models.JSONField(default=dict, blank=True)  # e.g., {"spicy": "bool", "size": ["S", "M", "L"]}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - ${self.price_cents / 100:.2f}"


class Bill(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='bills')
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='bills')
    is_open = models.BooleanField(default=True)
    subtotal_cents = models.IntegerField(default=0)
    tax_cents = models.IntegerField(default=0)
    service_fee_cents = models.IntegerField(default=0)
    tip_cents = models.IntegerField(default=0)
    total_cents = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Bill #{self.id} - {self.table.name} - {'Open' if self.is_open else 'Closed'}"

    def recalculate_totals(self):
        """Recalculate bill totals based on line items"""
        self.subtotal_cents = sum(line.line_total_cents for line in self.lines.all())
        self.tax_cents = int(self.subtotal_cents * float(self.restaurant.tax_rate))
        self.service_fee_cents = int(self.subtotal_cents * float(self.restaurant.service_fee_rate))
        self.total_cents = self.subtotal_cents + self.tax_cents + self.service_fee_cents + self.tip_cents
        self.save()


class BillLine(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='lines')
    item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True, blank=True)
    name_snapshot = models.CharField(max_length=255)
    options_snapshot = models.JSONField(default=dict, blank=True)
    qty = models.IntegerField(default=1)
    unit_price_cents = models.IntegerField()
    line_total_cents = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name_snapshot} x{self.qty} - ${self.line_total_cents / 100:.2f}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
    ]

    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='payments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    amount_cents = models.IntegerField()
    provider = models.CharField(max_length=50, default='stripe')
    provider_ref = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} - ${self.amount_cents / 100:.2f} - {self.status}"
