from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Sale, SaleItem
from .serializers import SaleItemSerializer,SaleSerializer
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework import status as http_status
from inventory.models import StockMovement
from invoices.models import Invoice
from django.utils.timezone import now
from decimal import Decimal
from django.db.models import Sum, Count
from datetime import timedelta


class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer

    @staticmethod
    def generate_invoice_number():
        from uuid import uuid4
        return f"INV-{uuid4().hex[:8].upper()}"
    
    
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

@api_view(['GET'])
def sales_overview(request):
    today = now()
    one_month_ago = today - timedelta(days=30)
    two_months_ago = today - timedelta(days=60)

    # Ventas completadas de los últimos 30 días
    recent_sales = Sale.objects.filter(status='completed', date__gte=one_month_ago)
    prev_sales = Sale.objects.filter(status='completed', date__gte=two_months_ago, date__lt=one_month_ago)

    # Métricas actuales
    total_revenue = recent_sales.aggregate(total=Sum('total'))['total'] or 0
    sales_count = recent_sales.count()
    active_customers = recent_sales.values('client_name').distinct().count()

    # Métricas del mes anterior
    prev_total_revenue = prev_sales.aggregate(total=Sum('total'))['total'] or 0
    prev_sales_count = prev_sales.count()
    prev_active_customers = prev_sales.values('client_name').distinct().count()

    # Función para calcular cambio porcentual
    def get_change(current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return round(((current - previous) / previous) * 100, 1)

    return Response({
        "total_revenue": round(total_revenue, 2),
        "sales_count": sales_count,
        "active_customers": active_customers,
        "conversion_rate": 24.5,  # Si tienes forma de calcularlo dinámicamente, aquí va

        "revenue_change": get_change(total_revenue, prev_total_revenue),
        "sales_change": get_change(sales_count, prev_sales_count),
        "customers_change": get_change(active_customers, prev_active_customers),
        "conversion_change": 3.2  # Lo puedes ajustar si tienes datos históricos
    })