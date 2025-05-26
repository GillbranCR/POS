from django.db import models
from inventory.models import Product
from accounts.models import User
# Venta
class Sale(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("completed", "Completada"),
        ("cancelled", "Cancelada"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    client_name = models.CharField(max_length=100, blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending") 

    def __str__(self):
        return f"Venta #{self.id} - {self.status} - {self.date.strftime('%Y-%m-%d')}"

# Detalles de venta (items vendidos)
class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name='detalles', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
