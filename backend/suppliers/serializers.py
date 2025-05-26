from rest_framework import serializers
from .models import Supplier, Purchase, PurchaseItem

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = PurchaseItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']

class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True)
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = Purchase
        fields = ['id', 'supplier', 'supplier_name', 'date', 'total', 'status', 'notes', 'items']
        read_only_fields = ['total']  # <--- esto es clave

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        total = sum(item['quantity'] * item['unit_price'] for item in items_data)
        purchase = Purchase.objects.create(total=total, **validated_data)
        for item_data in items_data:
            PurchaseItem.objects.create(purchase=purchase, **item_data)
        return purchase
