from rest_framework.routers import DefaultRouter
from .views import SalesViewSet, sales_overview
from django.urls import path, include

router = DefaultRouter()
router.register(r'sales', SalesViewSet, basename='sales')

urlpatterns = [
    path('', include(router.urls)),
    path('report/overview/', sales_overview, name='sales-overview'),
]
