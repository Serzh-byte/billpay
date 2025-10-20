from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Restaurant, Table


class AdminTokenAuthentication(BaseAuthentication):
    """
    Custom authentication that verifies X-Admin-Token header against Restaurant.admin_token_hash
    """
    def authenticate(self, request):
        admin_token = request.headers.get('X-Admin-Token')
        
        if not admin_token:
            return None
        
        admin_token_hash = Restaurant.hash_token(admin_token)
        
        try:
            restaurant = Restaurant.objects.get(admin_token_hash=admin_token_hash)
            # Store restaurant in request for use in views
            return (restaurant, admin_token)
        except Restaurant.DoesNotExist:
            raise AuthenticationFailed('Invalid admin token')


def get_restaurant_from_table_token(table_token):
    """
    Resolve table_token to Table and Restaurant
    Returns (restaurant, table) tuple
    """
    table_token_hash = Table.hash_token(table_token)
    
    try:
        table = Table.objects.select_related('restaurant').get(table_token_hash=table_token_hash)
        return table.restaurant, table
    except Table.DoesNotExist:
        return None, None
