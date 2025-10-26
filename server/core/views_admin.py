from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import Restaurant, Table, MenuCategory, MenuItem, Bill
from .serializers import (
    AdminMenuCategorySerializer, AdminMenuItemSerializer,
    MenuCategoryListSerializer, AdminTableSerializer,
    RestaurantSettingsSerializer
)
from .authentication import AdminTokenAuthentication


class AdminDashboardView(APIView):
    """
    GET /api/admin/dashboard
    Returns simple KPIs
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request):
        restaurant = request.user  # Restaurant object from authentication
        
        # Count open checks
        open_checks_count = Bill.objects.filter(
            restaurant=restaurant,
            is_open=True
        ).count()
        
        # Today's revenue
        today = timezone.now().date()
        today_start = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.min.time()))
        
        today_revenue = Bill.objects.filter(
            restaurant=restaurant,
            is_open=False,
            created_at__gte=today_start
        ).aggregate(total=Sum('total_cents'))['total'] or 0
        
        # Total bills today
        total_bills_today = Bill.objects.filter(
            restaurant=restaurant,
            created_at__gte=today_start
        ).count()
        
        return Response({
            'openChecksCount': open_checks_count,
            'todayRevenueCents': today_revenue,
            'totalBillsToday': total_bills_today,
        })


class AdminMenuCategoriesView(APIView):
    """
    GET /api/admin/menu/categories - List all categories
    POST /api/admin/menu/categories - Create category
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request):
        restaurant = request.user
        categories = MenuCategory.objects.filter(restaurant=restaurant).prefetch_related('items')
        serializer = AdminMenuCategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        restaurant = request.user
        serializer = AdminMenuCategorySerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminMenuCategoryDetailView(APIView):
    """
    GET /api/admin/menu/categories/<id> - Get category
    PATCH /api/admin/menu/categories/<id> - Update category
    DELETE /api/admin/menu/categories/<id> - Delete category
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request, category_id):
        restaurant = request.user
        try:
            category = MenuCategory.objects.get(id=category_id, restaurant=restaurant)
        except MenuCategory.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AdminMenuCategorySerializer(category)
        return Response(serializer.data)

    def patch(self, request, category_id):
        restaurant = request.user
        try:
            category = MenuCategory.objects.get(id=category_id, restaurant=restaurant)
        except MenuCategory.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AdminMenuCategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, category_id):
        restaurant = request.user
        try:
            category = MenuCategory.objects.get(id=category_id, restaurant=restaurant)
        except MenuCategory.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminMenuItemsView(APIView):
    """
    GET /api/admin/menu/items - List all items
    POST /api/admin/menu/items - Create item
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request):
        restaurant = request.user
        items = MenuItem.objects.filter(restaurant=restaurant).select_related('category')
        serializer = AdminMenuItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        restaurant = request.user
        category_id = request.data.get('category')
        
        # Verify category belongs to restaurant
        try:
            category = MenuCategory.objects.get(id=category_id, restaurant=restaurant)
        except MenuCategory.DoesNotExist:
            return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AdminMenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminMenuItemDetailView(APIView):
    """
    GET /api/admin/menu/items/<id> - Get item
    PATCH /api/admin/menu/items/<id> - Update item
    DELETE /api/admin/menu/items/<id> - Delete item
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request, item_id):
        restaurant = request.user
        try:
            item = MenuItem.objects.get(id=item_id, restaurant=restaurant)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AdminMenuItemSerializer(item)
        return Response(serializer.data)

    def patch(self, request, item_id):
        restaurant = request.user
        try:
            item = MenuItem.objects.get(id=item_id, restaurant=restaurant)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # If category is being updated, verify it belongs to restaurant
        if 'category' in request.data:
            try:
                category = MenuCategory.objects.get(id=request.data['category'], restaurant=restaurant)
            except MenuCategory.DoesNotExist:
                return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AdminMenuItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, item_id):
        restaurant = request.user
        try:
            item = MenuItem.objects.get(id=item_id, restaurant=restaurant)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminTablesView(APIView):
    """
    GET /api/admin/tables - List all tables
    POST /api/admin/tables - Create table (would generate token)
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request):
        restaurant = request.user
        tables = Table.objects.filter(restaurant=restaurant)
        
        # For each table, we need to provide the plain token in context
        # In production, you'd store tokens securely; for MVP, we'll use a mapping
        # For now, return the tables with a note that tokens need to be retrieved separately
        serializer = AdminTableSerializer(tables, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        restaurant = request.user
        name = request.data.get('name')
        
        if not name:
            return Response({'error': 'Table name required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate new token
        import secrets
        table_token = secrets.token_urlsafe(32)
        table_token_hash = Table.hash_token(table_token)
        
        table = Table.objects.create(
            restaurant=restaurant,
            name=name,
            table_token_hash=table_token_hash
        )
        
        serializer = AdminTableSerializer(table, context={
            'request': request,
            'table_token': table_token
        })
        
        # Return the plain token only on creation
        response_data = serializer.data
        response_data['table_token'] = table_token
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class AdminSettingsView(APIView):
    """
    GET /api/admin/settings - Get restaurant settings
    PATCH /api/admin/settings - Update restaurant settings
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request):
        restaurant = request.user
        serializer = RestaurantSettingsSerializer(restaurant)
        return Response(serializer.data)

    def patch(self, request):
        restaurant = request.user
        serializer = RestaurantSettingsSerializer(restaurant, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminOrdersView(APIView):
    """
    GET /api/admin/orders
    Returns all active orders grouped by table with order details and timestamps
    """
    authentication_classes = [AdminTokenAuthentication]

    def get(self, request):
        restaurant = request.user
        
        # Get all open bills with their items
        open_bills = Bill.objects.filter(
            restaurant=restaurant,
            is_open=True
        ).prefetch_related('lines', 'table').order_by('-updated_at')
        
        orders = []
        for bill in open_bills:
            # Group items by session_id to see who ordered what
            sessions = {}
            for line in bill.lines.all():
                session = line.session_id or 'unknown'
                if session not in sessions:
                    sessions[session] = []
                sessions[session].append({
                    'id': line.id,
                    'name': line.name_snapshot,
                    'qty': line.qty,
                    'price': line.unit_price_cents / 100,
                    'lineTotal': line.line_total_cents / 100,
                    'orderedAt': line.ordered_at.isoformat() if line.ordered_at else None,
                })
            
            orders.append({
                'billId': bill.id,
                'tableNumber': bill.table.table_token,
                'tableName': bill.table.name,
                'subtotal': bill.subtotal_cents / 100,
                'tax': bill.tax_cents / 100,
                'serviceFee': bill.service_fee_cents / 100,
                'total': bill.total_cents / 100,
                'createdAt': bill.created_at.isoformat(),
                'updatedAt': bill.updated_at.isoformat(),
                'sessionCount': len(sessions),
                'sessions': sessions,
                'allItems': [{
                    'id': line.id,
                    'name': line.name_snapshot,
                    'qty': line.qty,
                    'price': line.unit_price_cents / 100,
                    'lineTotal': line.line_total_cents / 100,
                    'orderedAt': line.ordered_at.isoformat() if line.ordered_at else None,
                    'sessionId': line.session_id or 'unknown',
                } for line in bill.lines.all()],
            })
        
        return Response({
            'orders': orders,
            'totalOpenBills': len(orders),
        })

