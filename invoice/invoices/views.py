from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from .models import Invoice
from.serializer  import InvoioceSerializer
from rest_framework.response import Response
from rest_framework import status

class InvoiceApiview(APIView):
    permission_classes=[IsAuthenticated, IsAdminUser]

    def get(self, request):
        invoices=Invoice.objects.all()
        serializer=InvoioceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data=request.data
        customer=data.get('customer')
        discount=data.get('discount',0)
        tax=data.get('tax',0)
        

        invoice=Invoice.objects.create(customer=customer,discount=discount,tax=tax)