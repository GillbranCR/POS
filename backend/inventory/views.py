from rest_framework import viewsets
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.response import Response
from rest_framework import status

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('created_at')
    serializer_class = ProductSerializer
    
    def create(self, request, *args, **kwargs):
        print("DATA RECEIVED:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("ERROR:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer