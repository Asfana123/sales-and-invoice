from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import authenticate,login
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from customer.models import Customer
from product.models import Product
from rest_framework.permissions import IsAuthenticated

class AdminLogin(APIView):
    def post(self,request):
        username=request.data.get('username')
        password=request.data.get('password')

        user=authenticate(username=username,password=password)
        
        if user and user.is_staff and user.is_superuser:
            refresh=RefreshToken.for_user(user)
            print(refresh.access_token)
            return Response(
                {'message':'logged in successfully',
                 'refresh_token':str(refresh),
                 'access_token':str(refresh.access_token)
                 },
                status=status.HTTP_200_OK
            )
        
        else:
            return  Response({'error':'only admin can login'}, 
                            status=status.HTTP_401_UNAUTHORIZED)



class Dashboard(APIView):

    permission_classes=[IsAuthenticated]
    def get(self,request):
        customers=Customer.objects.all()
        products=Product.objects.all()
        
        return Response({"message":"dashbooard", 'customer':customers}, status=status.HTTP_200_OK)
    

class Logout(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request):
        return Response({"message":'logout succesfully'}, status=status.HTTP_200_OK)
