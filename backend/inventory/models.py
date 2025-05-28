from django.db import models
from suppliers.models import Supplier

# Categoría de producto
class Category(models.Model):
    name = models.CharField(max_length=50,unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
# Producto
class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Movimiento de stock (entradas, salidas, correcciones)
class StockMovement(models.Model):
    MOVEMENT_CHOICES = (
        ('sale', 'Sale'),
        ('restock', 'Restock'),
        ('correction', 'Correction'),
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='movements')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_movements')
    type = models.CharField(max_length=20, choices=MOVEMENT_CHOICES)
    quantity = models.IntegerField()
    reason = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_type_display()} - {self.product.name} ({self.quantity})"

