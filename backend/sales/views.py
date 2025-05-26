from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Sale, SaleItem
from .serializers import SaleItemSerializer,SaleSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as http_status


class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer
    
    def perform_create(self, serializer):
        serializer.save()
    
    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        sale = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["pending", "completed", "cancelled"]:
            return Response({"error": "Estado inválido."}, status=http_status.HTTP_400_BAD_REQUEST)

        sale.status = new_status
        sale.save()

        return Response({"message": f"Estado actualizado a '{new_status}'."}, status=http_status.HTTP_200_OK)

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer