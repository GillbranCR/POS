from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Sale, SaleItem
from .serializers import SaleItemSerializer,SaleSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as http_status
from inventory.models import StockMovement
from invoices.models import Invoice
from django.utils.timezone import now
from decimal import Decimal


class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer

    @staticmethod
    def generate_invoice_number():
        from uuid import uuid4
        return f"INV-{uuid4().hex[:8].upper()}"
    
    def perform_create(self, serializer):
        sale = serializer.save()

        for item in sale.detalles.all():
            product = item.product

            # Descontar stock
            product.stock -= item.quantity
            product.save()

            # Registrar el movimiento de salida
            StockMovement.objects.create(
                product=product,
                supplier=None,  # No hay proveedor porque es venta
                type='sale',
                quantity=item.quantity,
                reason=f"Venta #{sale.id} a cliente {sale.client_name}"
            )
    
    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        sale = self.get_object()
        new_status = request.data.get("status")
        cancel_reason = request.data.get("cancel_reason", "error")  # default: error
    
        if new_status not in ["pending", "completed", "cancelled"]:
            return Response({"error": "Estado inválido."}, status=http_status.HTTP_400_BAD_REQUEST)
        
        
        sale.status = new_status
        sale.save()
    
        # Verificamos si el estado anterior no era ya cancelado
        if sale.status != "cancelled" and new_status == "cancelled":
            for item in sale.detalles.all():
                product = item.product
                product.stock += item.quantity
                product.save()
    
                # Determinar tipo de movimiento
                movement_type = "correction" if cancel_reason == "error" else "restock"
    
                # Registrar movimiento de stock
                StockMovement.objects.create(
                    product=product,
                    supplier=None,
                    type=movement_type,
                    quantity=item.quantity,
                    reason=f"Cancelación de venta #{sale.id} por '{cancel_reason}'"
                )
        
        # Generar factura si se completa la venta
        if new_status == 'completed' and not hasattr(sale, 'invoice'):
            try:
                invoice = Invoice.objects.create(
                    sale=sale,
                    invoice_number=self.generate_invoice_number(),
                    issuer_name="Mi Empresa S.A.",
                    issuer_address="Calle Falsa 123, Ciudad",
                    client_name=sale.client_name or "Cliente",
                    client_address="Dirección del cliente",
                    subtotal=sale.total - sale.tax,
                    tax=sale.tax,
                    total=sale.total
                )
                print(f"✅ Factura generada: {invoice.invoice_number}")
            except Exception as e:
                print(f"❌ Error generando factura: {e}")


        
    
        return Response({"message": f"Estado actualizado a '{new_status}'."}, status=http_status.HTTP_200_OK)
    
class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer