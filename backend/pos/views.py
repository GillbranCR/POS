from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Sale, Product
from .serializers import SaleSerializer, ProductSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer

    def perform_create(self, serializer):
        serializer.save()

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



