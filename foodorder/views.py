from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Q
from decimal import Decimal
from datetime import timedelta
import random

from .models import Category, FoodItem, Order, OrderItem
from .serializers import Categoryseri, Foodseri, UserSerializer, OrderCreateSerializer, OrderHistorySerializer

User = get_user_model()

# -------------------------
# USER / ADMIN AUTH VIEWS
# -------------------------

@api_view(['POST'])
def register_user(request):
    data = request.data
    if User.objects.filter(email=data['email']).exists():
        return Response({'message': 'Email address already registered'}, status=status.HTTP_400_BAD_REQUEST)

    otp_code = str(random.randint(100000, 999999))
    otp_expiry_time = timezone.now() + timedelta(minutes=10)

    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        first_name=data['firstname'],
        last_name=data['lastname'],
        password=data['password'],
        mobile_number=data.get('mobile_number'),
        is_active=False,
        is_verified=False,
        otp=otp_code,
        otp_expiry=otp_expiry_time
    )

    try:
        send_mail(
            subject='Your OTP for FoodOrder',
            message=f'Your verification OTP is: {otp_code}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email]
        )
        return Response({'message': 'User registered. OTP sent to email.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        user.delete()
        return Response({'message': f'Failed to send OTP email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp_code = request.data.get('otp')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user.otp == otp_code and timezone.now() < user.otp_expiry:
        user.is_active = True
        user.is_verified = True
        user.otp = None
        user.otp_expiry = None
        user.save()

        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Account verified successfully!',
            'user': serializer.data,
            'token': str(refresh.access_token)
        }, status=status.HTTP_200_OK)

    return Response({'message': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def admin_login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None and user.is_staff:
        return Response({'message': 'Login Successful', 'username': user.email}, status=status.HTTP_200_OK)

    return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def customer_login_api(request):
    email_or_phone = request.data.get('email')
    password = request.data.get('password')

    if not email_or_phone or not password:
        return Response({'message': "Please provide email/phone and password"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_obj = User.objects.get(Q(email=email_or_phone) | Q(mobile_number=email_or_phone))
    except User.DoesNotExist:
        return Response({'message': "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(request, username=user_obj.email, password=password)

    if user is not None:
        if not user.is_staff and user.is_verified:
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                'message': "Login Successful",
                'user': serializer.data,
                'token': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        elif not user.is_verified:
            return Response({'message': "Account not verified. Please check your email for OTP."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'message': "Admin accounts must log in via /admin_login/ path."}, status=status.HTTP_403_FORBIDDEN)

    return Response({'message': "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------------
# CATEGORY VIEWS
# -------------------------

@api_view(['POST'])
def add_category_api(request):
    name = request.data.get('Category_name')
    if not name:
        return Response({'message': 'Category name is required'}, status=status.HTTP_400_BAD_REQUEST)

    Category.objects.create(name=name)
    return Response({'message': "Category has been created"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_categories_api(request):
    categories = Category.objects.all()
    serializer = Categoryseri(categories, many=True)
    return Response(serializer.data)


# -------------------------
# FOOD VIEWS
# -------------------------

@api_view(['POST'])
@parser_classes([FormParser, MultiPartParser])
def add_food_item(request):
    """
    Add a new food item with image upload.
    """
    category_id = request.data.get('category')
    if not category_id:
        return Response({'message': 'Category ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'message': 'Invalid category ID'}, status=status.HTTP_400_BAD_REQUEST)

    food = FoodItem.objects.create(
        category=category,
        name=request.data.get('name'),
        price=request.data.get('price'),
        description=request.data.get('description', ''),
        image=request.data.get('image')
    )
    return Response({'message': 'Food has been added successfully!'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_foods_api(request):
    foods = FoodItem.objects.filter(category__isnull=False)
    serializer = Foodseri(foods, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def food_detail_api(request, pk):
    food_item = get_object_or_404(FoodItem, pk=pk, category__isnull=False)
    serializer = Foodseri(food_item, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def food_search(request):
    query = request.GET.get('q', '')
    foods = FoodItem.objects.filter(name__icontains=query, category__isnull=False)
    serializer = Foodseri(foods, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def random_foods(request):
    foods = list(FoodItem.objects.filter(category__isnull=False))
    random.shuffle(foods)
    serializer = Foodseri(foods[:9], many=True, context={'request': request})
    return Response(serializer.data)


# -------------------------
# ORDER VIEWS
# -------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": "Validation Failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    user = request.user
    subtotal = Decimal(0)

    try:
        for item in data['cart_items']:
            food_item = FoodItem.objects.get(id=item['id'], category__isnull=False)
            subtotal += food_item.price * item['qty']

        delivery_fee = Decimal('50.00')
        total = subtotal + delivery_fee

        if total != Decimal(str(data['total_amount'])):
            return Response({"message": "Order total mismatch. Prices verified against database."}, status=status.HTTP_400_BAD_REQUEST)
    except FoodItem.DoesNotExist:
        return Response({"message": "One or more food items are invalid or have no category."}, status=status.HTTP_404_NOT_FOUND)

    try:
        with transaction.atomic():
            order_status = 'Pending' if data['payment_method'].lower() == 'cod' else 'Confirmed'
            order = Order.objects.create(
                user=user,
                total_amount=total,
                delivery_address=data['delivery_address']['address'],
                delivery_name=data['delivery_address']['name'],
                delivery_phone=data['delivery_address']['phone'],
                payment_method=data['payment_method'],
                status=order_status
            )

            for item in data['cart_items']:
                food_item = FoodItem.objects.get(id=item['id'], category__isnull=False)
                OrderItem.objects.create(
                    order=order,
                    food=food_item,
                    quantity=item['qty'],
                    price_at_purchase=food_item.price,
                    subtotal=food_item.price * item['qty']
                )

        return Response({"success": True, "message": "Order placed successfully.", "order_id": order.id}, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({"message": "Failed to process order due to server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history_api(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderHistorySerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail_api(request, pk):
    order = get_object_or_404(Order, pk=pk, user=request.user)
    serializer = OrderHistorySerializer(order)
    return Response(serializer.data)
