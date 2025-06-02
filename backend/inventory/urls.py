from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, StockMovementViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'stock_movements', StockMovementViewSet)

urlpatterns = router.urls