from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .models import Restaurant, Table, MenuCategory, MenuItem, Bill, BillLine, Payment
from .serializers import (
    MenuCategorySerializer, BillSerializer, BillLineSerializer,
    RestaurantSettingsSerializer
)
from .authentication import get_restaurant_from_table_token
import uuid


class TableContextView(APIView):
    """
    GET /api/public/table-context/<table_token>
    Returns restaurant context for the table
    """
    def get(self, request, table_token):
        restaurant, table = get_restaurant_from_table_token(table_token)
        
        if not restaurant or not table:
            return Response({'error': 'Invalid table token'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'restaurantId': restaurant.id,
            'tableId': table.id,
            'theme': restaurant.theme_json,
            'taxRate': float(restaurant.tax_rate),
            'serviceFeeRate': float(restaurant.service_fee_rate),
            'tipPresets': restaurant.tip_presets_json,
        })


class PublicMenuView(APIView):
    """
    GET /api/public/menu/<table_token>
    Returns menu for the restaurant
    """
    def get(self, request, table_token):
        restaurant, table = get_restaurant_from_table_token(table_token)
        
        if not restaurant:
            return Response({'error': 'Invalid table token'}, status=status.HTTP_404_NOT_FOUND)
        
        categories = MenuCategory.objects.filter(
            restaurant=restaurant
        ).prefetch_related('items')
        
        serializer = MenuCategorySerializer(categories, many=True)
        return Response(serializer.data)


class TableBillView(APIView):
    """
    GET /api/public/tables/<table_id>/bill
    Returns current open bill for the table
    """
    def get(self, request, table_id):
        try:
            table = Table.objects.get(id=table_id)
        except Table.DoesNotExist:
            return Response({'error': 'Table not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create open bill
        bill, created = Bill.objects.get_or_create(
            table=table,
            is_open=True,
            defaults={'restaurant': table.restaurant}
        )
        
        serializer = BillSerializer(bill)
        return Response(serializer.data)


class AddBillItemView(APIView):
    """
    POST /api/public/tables/<table_id>/bill/items
    Add item to bill
    Body: { itemId, qty, options }
    """
    def post(self, request, table_id):
        try:
            table = Table.objects.get(id=table_id)
        except Table.DoesNotExist:
            return Response({'error': 'Table not found'}, status=status.HTTP_404_NOT_FOUND)
        
        item_id = request.data.get('itemId')
        qty = request.data.get('qty', 1)
        options = request.data.get('options', {})
        
        try:
            menu_item = MenuItem.objects.get(id=item_id, restaurant=table.restaurant)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Menu item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if not menu_item.available:
            return Response({'error': 'Menu item not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create open bill
        bill, created = Bill.objects.get_or_create(
            table=table,
            is_open=True,
            defaults={'restaurant': table.restaurant}
        )
        
        # Create bill line
        unit_price = menu_item.price_cents
        line_total = unit_price * qty
        
        BillLine.objects.create(
            bill=bill,
            item=menu_item,
            name_snapshot=menu_item.name,
            options_snapshot=options,
            qty=qty,
            unit_price_cents=unit_price,
            line_total_cents=line_total
        )
        
        # Recalculate bill totals
        bill.recalculate_totals()
        
        serializer = BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PaymentIntentView(APIView):
    """
    POST /api/public/tables/<table_id>/payment/intent
    Create payment intent (mock Stripe)
    Body: { mode: "full"|"split_even"|"mine_only", seats?: number, tip?: number }
    """
    def post(self, request, table_id):
        try:
            table = Table.objects.get(id=table_id)
        except Table.DoesNotExist:
            return Response({'error': 'Table not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            bill = Bill.objects.get(table=table, is_open=True)
        except Bill.DoesNotExist:
            return Response({'error': 'No open bill found'}, status=status.HTTP_404_NOT_FOUND)
        
        mode = request.data.get('mode', 'full')
        seats = request.data.get('seats', 1)
        tip = request.data.get('tip', 0)
        
        # Calculate amount owed based on mode
        subtotal = bill.subtotal_cents
        tax = bill.tax_cents
        service_fee = bill.service_fee_cents
        
        if mode == 'full':
            amount_cents = subtotal + tax + service_fee + tip
        elif mode == 'split_even':
            if seats <= 0:
                return Response({'error': 'Invalid number of seats'}, status=status.HTTP_400_BAD_REQUEST)
            base_per_person = (subtotal + tax + service_fee) // seats
            amount_cents = base_per_person + tip
        elif mode == 'mine_only':
            # For MVP, treat as same as full (would need line-item selection in production)
            amount_cents = subtotal + tax + service_fee + tip
        else:
            return Response({'error': 'Invalid payment mode'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mock Stripe: create payment intent and immediately mark as succeeded
        provider_ref = f"pi_mock_{uuid.uuid4().hex[:24]}"
        
        payment = Payment.objects.create(
            bill=bill,
            status='succeeded',
            amount_cents=amount_cents,
            provider='stripe',
            provider_ref=provider_ref
        )
        
        # Update bill tip if this is the first/main payment
        if tip > 0:
            bill.tip_cents += tip
            bill.total_cents = bill.subtotal_cents + bill.tax_cents + bill.service_fee_cents + bill.tip_cents
            bill.save()
        
        # Check if bill is fully paid
        total_paid = Payment.objects.filter(bill=bill, status='succeeded').aggregate(
            total=Sum('amount_cents')
        )['total'] or 0
        
        if total_paid >= bill.total_cents:
            bill.is_open = False
            bill.save()
        
        return Response({
            'paymentId': payment.id,
            'status': payment.status,
            'amountCents': payment.amount_cents,
            'providerRef': payment.provider_ref,
            'billClosed': not bill.is_open,
        }, status=status.HTTP_201_CREATED)


class ReceiptEmailView(APIView):
    """
    POST /api/public/receipt/email
    Send receipt email (stub for MVP)
    Body: { email, billId }
    """
    def post(self, request):
        email = request.data.get('email')
        bill_id = request.data.get('billId')
        
        if not email or not bill_id:
            return Response({'error': 'Email and billId required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Stub: just return success
        # In production, would send email via service like SendGrid
        return Response({
            'message': 'Receipt sent successfully',
            'email': email
        }, status=status.HTTP_200_OK)
