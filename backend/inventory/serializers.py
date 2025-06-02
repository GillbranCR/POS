from rest_framework import serializers
from .models import Product, Category, StockMovement
from suppliers.models import Supplier

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'product_name', 'supplier', 'supplier_name', 'type', 'quantity', 'reason', 'date']