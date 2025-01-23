from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from customer.models import Customer
from product.models import Product
from rest_framework.permissions import IsAuthenticated
from invoices.models import *
from invoices.serializer import InvoioceSerializer
from django.db.models import Sum

class AdminLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticating the user
        user = authenticate(username=username, password=password)
        
        if user:
            # Check if the user is an admin (staff and superuser)
            if user.is_staff and user.is_superuser:
                refresh = RefreshToken.for_user(user)
                print(refresh.access_token)
                return Response(
                    {'message': 'Logged in successfully',
                     'refresh_token': str(refresh),
                     'access_token': str(refresh.access_token)},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Only admin can login'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        # Return error if authentication fails
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


class Dashboard(APIView):
    permission_classes=[IsAuthenticated]


    def get(self, request):
    
        total_sales = Invoice.objects.aggregate(total_sales=Sum('total_amount'))['total_sales'] or 0
        outstanding = Invoice.objects.filter(payment_status='unpaid').aggregate(outstanding=Sum('total_amount'))['outstanding'] or 0
        recent_invoices = Invoice.objects.order_by('-created_at')[:5]
        serializer = InvoioceSerializer(recent_invoices, many=True)

        return Response({
            "total_sales": total_sales,
            'outstanding': outstanding,
            'recent_Invoice': serializer.data
        }, status=status.HTTP_200_OK)
