from rest_framework import serializers
from .models import Product, Sale, SaleItem, StockMovement, User
from decimal import Decimal

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'total']


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(source='detalles', many=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Sale
        fields = ['id', 'client_name', 'user', 'date', 'total', 'tax', 'items']


    def get_total(self, obj):
        return f"${obj.total:.2f}"

    def create(self, validated_data):
        items_data = validated_data.pop('detalles')
        user = validated_data.pop('user', None)
        subtotal = Decimal('0.00')

        # Calcular total e impuestos
        for item_data in items_data:
            quantity = item_data['quantity']
            price = item_data['price']
            subtotal += price * quantity

        tax = subtotal * Decimal('0.16')  # 16% IVA por ejemplo
        total = subtotal + tax

        # Crear la venta
        sale = Sale.objects.create(**validated_data)

        # Crear items y registrar movimiento de stock
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            price = item_data['price']
            item_total = price * quantity

            if product.stock < quantity:
                raise serializers.ValidationError(f"No hay stock suficiente de {product.name}")

            product.stock -= quantity
            product.save()

            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                price=price,
                total=item_total
            )

            StockMovement.objects.create(
                product=product,
                type='sale',
                quantity=-quantity,
                reason=f"Venta #{sale.id}"
            )

        return sale


