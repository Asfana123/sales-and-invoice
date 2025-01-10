from rest_framework.views import APIView
from .models import Customer
from .serializer import CustomerSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status

class CustomerAPIview(APIView):
    permission_classes=[IsAuthenticated]
                        
    def get(self,request):
        customers=Customer.objects.all()
        serializer=CustomerSerializer(customers,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer=CustomerSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    