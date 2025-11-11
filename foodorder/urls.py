from django.urls import path
from .views import (
    register_user,
    verify_otp,
    customer_login_api,
    admin_login_api,
    add_category_api,
    list_categories_api,
    add_food_item,  
    list_foods_api,
    food_detail_api,
    food_search,
    random_foods,
    place_order,
    order_history_api,
    order_detail_api,
)

urlpatterns = [
    # --- AUTHENTICATION & USER ---
    path('register/', register_user, name='register_user'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('login/', customer_login_api, name='customer_login_api'),
    path('admin_login/', admin_login_api, name='admin_login_api'),

    # --- CATEGORY MANAGEMENT ---
    path('categories/', list_categories_api, name='list_categories_api'),  # list all categories
    path('categories/add/', add_category_api, name='add_category_api'),    # add category

    # --- FOOD MANAGEMENT & DISPLAY ---
    path('foods/', list_foods_api, name='all_foods'),                     # list all foods
    path('foods/add/', add_food_item, name='add_food_item'),              # add food item
    path('foods/<int:pk>/', food_detail_api, name='food_detail'),        # food detail
    path('foods/search/', food_search, name='food_search'),               # search foods
    path('foods/random/', random_foods, name='random_foods'),             # random foods

    # --- ORDER FLOW ---
    path('orders/place/', place_order, name='place_order'),
    path('orders/history/', order_history_api, name='order_history'),
    path('orders/<int:pk>/', order_detail_api, name='order_detail'),
]
