from django.db import models
from sales.models import Sale

class Invoice(models.Model):
    sale = models.OneToOneField(Sale, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=50, unique=True)
    issuer_name = models.CharField(max_length=100)
    issuer_address = models.TextField()
    client_name = models.CharField(max_length=100)
    client_address = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Factura #{self.invoice_number}"

