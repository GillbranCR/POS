from rest_framework import viewsets
from .models import Supplier, Purchase
from .serializers import SupplierSerializer, PurchaseSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all().prefetch_related('items')
    serializer_class = PurchaseSerializer