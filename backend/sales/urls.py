from rest_framework.routers import DefaultRouter
from .views import SalesViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'sales', SalesViewSet, basename='sales')
urlpatterns = router.urls
