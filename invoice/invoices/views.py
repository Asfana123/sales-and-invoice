from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from .models import Invoice, InvoiceProduct
from.serializer  import InvoioceSerializer ,InvoiceProductSerializer
from rest_framework.response import Response
from rest_framework import status
from customer.models import Customer
from product.models import Product
from rest_framework.exceptions import NotFound

class InvoiceApiview(APIView):
    permission_classes=[IsAuthenticated, IsAdminUser]

    def get(self, request):
        invoices=Invoice.objects.all()
        serializer=InvoioceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data=request.data
        print(request.data)
        customer_id=data.get('customer')
        print(customer_id)
        
        payment_status=data.get('status')

        customer_id=Customer.objects.get(id=customer_id)
        invoice=Invoice.objects.create(customer=customer_id,payment_status=payment_status)

        invoice_products=data.get('invoice_products',[])
        
        for item in invoice_products:
            print(f"Received product_id: {item.get('product_id')}, quantity: {item.get('quantity')}")
            id=item.get('product_id')
            quantity=item.get('quantity')
            
            try:
                product=Product.objects.get(id=id)
                
            except Product.DoesNotExist:
                raise NotFound("product doesn't exist")

            subtotal=product.price*int(quantity)
            InvoiceProduct.objects.create(invoice=invoice, product=product, quantity=quantity,price=product.price, subtotal=subtotal)
            product.stock=product.stock-quantity
            product.save()
        discount=data.get('discount',0)
        tax=data.get('tax',0)
        invoice.discount = subtotal *int(discount) / 100

        print(type(invoice.discount))
        invoice.tax= subtotal*int(tax)/100
        print(type(invoice.tax))
        invoice.total_amount=subtotal + invoice.tax - invoice.discount
        print(invoice.total_amount)
        invoice.save()
        print(invoice.created_at)
        serailizer=InvoioceSerializer(invoice)
        return Response(serailizer.data, status=status.HTTP_201_CREATED)