from rest_framework import serializers
from .models import CustomUser, Category, FoodItem, Order, OrderItem

# ---------------------
# User Serializer
# ---------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'mobile_number']
        extra_kwargs = {
            'password': {'write_only': True}
        }

# ---------------------
# Category Serializer
# ---------------------
class Categoryseri(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# ---------------------
# Food Item Serializer
# ---------------------
class Foodseri(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = FoodItem
        fields = ['id', 'category', 'category_name', 'name', 'price', 'description', 'image']

    def get_image(self, obj):
        """
        Returns the absolute URL of the image if request context is available,
        otherwise returns the relative URL.
        """
        request = self.context.get('request', None)
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            else:
                return obj.image.url  # fallback
        return None

    def to_representation(self, instance):
        """Skip food items without a category."""
        if instance.category is None:
            return None
        return super().to_representation(instance)

# ---------------------
# Address Serializer
# ---------------------
class AddressSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=15)
    address = serializers.CharField(max_length=255)

# ---------------------
# Cart Item Serializer
# ---------------------
class CartItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    qty = serializers.IntegerField(min_value=1)

# ---------------------
# Order Creation Serializer
# ---------------------
class OrderCreateSerializer(serializers.Serializer):
    cart_items = CartItemSerializer(many=True)
    delivery_address = AddressSerializer()
    payment_method = serializers.CharField(max_length=20)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

# ---------------------
# Order History Serializers
# ---------------------
class OrderItemHistorySerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='food.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['item_name', 'quantity', 'price_at_purchase', 'subtotal']


class OrderHistorySerializer(serializers.ModelSerializer):
    items = OrderItemHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'created_at',
            'updated_at',
            'total_amount',
            'status',
            'payment_method',
            'delivery_name',
            'delivery_phone',
            'delivery_address',
            'items'
        ]
