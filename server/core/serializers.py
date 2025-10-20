from rest_framework import serializers
from .models import Restaurant, Table, MenuCategory, MenuItem, Bill, BillLine, Payment


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'category', 'name', 'description', 'price_cents', 'image_url', 'available', 'options_json']


class MenuCategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'position', 'items']


class MenuCategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'position']


class BillLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillLine
        fields = ['id', 'name_snapshot', 'options_snapshot', 'qty', 'unit_price_cents', 'line_total_cents']


class BillSerializer(serializers.ModelSerializer):
    lines = BillLineSerializer(many=True, read_only=True)

    class Meta:
        model = Bill
        fields = ['id', 'is_open', 'subtotal_cents', 'tax_cents', 'service_fee_cents', 'tip_cents', 'total_cents', 'created_at', 'lines']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'status', 'amount_cents', 'provider', 'provider_ref', 'created_at']


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'name']


class RestaurantSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'theme_json', 'tax_rate', 'service_fee_rate', 'tip_presets_json']


# Admin serializers
class AdminMenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'category', 'name', 'description', 'price_cents', 'image_url', 'available', 'options_json', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class AdminMenuCategorySerializer(serializers.ModelSerializer):
    items = AdminMenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'position', 'items', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class AdminTableSerializer(serializers.ModelSerializer):
    diner_url = serializers.SerializerMethodField()
    qr_data = serializers.SerializerMethodField()

    class Meta:
        model = Table
        fields = ['id', 'name', 'diner_url', 'qr_data', 'created_at']
        read_only_fields = ['created_at']

    def get_diner_url(self, obj):
        # We'll store the plain token in context
        request = self.context.get('request')
        table_token = self.context.get('table_token', '')
        if request and table_token:
            return f"{request.scheme}://{request.get_host()}/t/{table_token}"
        return ""

    def get_qr_data(self, obj):
        # Return the URL as QR data - client will generate the actual QR code
        return self.get_diner_url(obj)
