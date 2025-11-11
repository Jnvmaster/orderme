from django.contrib import admin
from .models import Category, FoodItem, Cart, Wishlist, Order

# ✅ Register only your custom models
admin.site.register(Category)
admin.site.register(FoodItem)
admin.site.register(Cart)
admin.site.register(Wishlist)
admin.site.register(Order)

# ❌ Do NOT register User here (Django already registers default User model)
# admin.site.register(User)
