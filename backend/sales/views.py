from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Sale, SaleItem
from .serializers import SaleItemSerializer,SaleSerializer

class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer
    
    def perform_create(self, serializer):
        serializer.save()

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer