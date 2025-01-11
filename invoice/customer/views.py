from rest_framework.views import APIView
from .models import Customer
from .serializer import CustomerSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
# from rest_framework.authentication import TokenAuthentication
from rest_framework import status

class CustomerAPIview(APIView):
    permission_classes=[IsAuthenticated,IsAdminUser]
                      
    def post(self,request):
        serializer=CustomerSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
    def get(self,request,id=None):
        if id:
            try:
                customer=Customer.objects.get(id=id)
            except Customer.DoesNotExist:
                return Response({'error':'customer no found'},status=status.HTTP_404_NOT_FOUND)

            serializer=CustomerSerializer(customer)
            return  Response(serializer.data)

        else:
            customers=Customer.objects.all()
            serializer=CustomerSerializer(customers,many=True)
            return Response(serializer.data)
        
    def patch(self,request,id):
        try:
            customer=Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({'error':'customer doesnt exist'},status=status.HTTP_404_NOT_FOUND)

        if customer:
            serializer=CustomerSerializer(customer,data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,requst,id):
        try:
            customer=Customer.objects.get(id=id)
            customer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
