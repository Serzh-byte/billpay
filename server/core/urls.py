from django.urls import path
from .views_public import (
    TableContextView, PublicMenuView, TableBillView,
    AddBillItemView, RemoveBillItemView, PaymentIntentView, ReceiptEmailView
)
from .views_admin import (
    AdminDashboardView, AdminMenuCategoriesView, AdminMenuCategoryDetailView,
    AdminMenuItemsView, AdminMenuItemDetailView, AdminTablesView, AdminSettingsView,
    AdminOrdersView
)

urlpatterns = [
    # Public endpoints
    path('public/table-context/<str:table_token>', TableContextView.as_view(), name='table-context'),
    path('public/menu/<str:table_token>', PublicMenuView.as_view(), name='public-menu'),
    path('public/tables/<int:table_id>/bill', TableBillView.as_view(), name='table-bill'),
    path('public/tables/<int:table_id>/bill/items', AddBillItemView.as_view(), name='add-bill-item'),
    path('public/tables/<int:table_id>/bill/items/<int:line_id>', RemoveBillItemView.as_view(), name='remove-bill-item'),
    path('public/tables/<int:table_id>/payment/intent', PaymentIntentView.as_view(), name='payment-intent'),
    path('public/receipt/email', ReceiptEmailView.as_view(), name='receipt-email'),
    
    # Admin endpoints
    path('admin/dashboard', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/orders', AdminOrdersView.as_view(), name='admin-orders'),
    path('admin/menu/categories', AdminMenuCategoriesView.as_view(), name='admin-categories'),
    path('admin/menu/categories/<int:category_id>', AdminMenuCategoryDetailView.as_view(), name='admin-category-detail'),
    path('admin/menu/items', AdminMenuItemsView.as_view(), name='admin-items'),
    path('admin/menu/items/<int:item_id>', AdminMenuItemDetailView.as_view(), name='admin-item-detail'),
    path('admin/tables', AdminTablesView.as_view(), name='admin-tables'),
    path('admin/settings', AdminSettingsView.as_view(), name='admin-settings'),
]
