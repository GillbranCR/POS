from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, ProductViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'products', ProductViewSet, basename='product')
# urls.py


urlpatterns = [
    path('', include(router.urls)),

]

