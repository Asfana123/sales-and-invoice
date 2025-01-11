from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializer import ProductSerializer
from rest_framework.response import Response
from rest_framework import status

class ProductApiView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request, id=None):
        if id:
            try:
                product=Product.objects.get(id=id)
                serializer=ProductSerializer(product)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Product.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
           
        products=Product.objects.all()
        serializer=ProductSerializer(products,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self,request):
        serializer=ProductSerializer(request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def patch(self,request,id):
        try:
            product=Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer=ProductSerializer(product,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,id):
        try:
            product=Product.objects.get(id=id)

        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
