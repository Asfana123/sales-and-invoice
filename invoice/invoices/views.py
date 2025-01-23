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

    def get(self, request ,id=None):

        if id:
            invoice=Invoice.objects.get(id=id)
            invoice_serializer=InvoioceSerializer(invoice)
            invoice_products=InvoiceProduct.objects.filter(invoice=invoice).prefetch_related('product')
            invoiceproduct_serializer=InvoiceProductSerializer(invoice_products,many=True)
            return Response({ 'invoice':invoice_serializer.data,
                             'products':invoiceproduct_serializer.data},status=status.HTTP_200_OK)


        else:
            invoices=Invoice.objects.all().order_by('-created_at')
            serializer=InvoioceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data=request.data
        print(data)
        customer_id=data.get('customer')
        
        payment_status=data.get('status')

        customer_id=Customer.objects.get(id=customer_id)
        invoice=Invoice.objects.create(customer=customer_id,payment_status=payment_status)

        invoice_products=data.get('products',[])
        print(invoice_products)
        subtotal=0
        for item in invoice_products:
            print(f"Received product_id: {item.get('product_id')}, quantity: {item.get('quantity')}")
            id=item.get('product_id')
            quantity=item.get('quantity')
            
            try:
                product=Product.objects.get(id=id)
                
            except Product.DoesNotExist:
                raise NotFound("product doesn't exist")
            if print(product.stock < quantity):
                raise NotFound('product is out of staock')
            print(product.price)
            product_subtotal=product.price*int(quantity)
            subtotal+=product_subtotal
            print(subtotal)
            InvoiceProduct.objects.create(invoice=invoice, product=product, quantity=quantity, price=product.price ,subtotal=product_subtotal)
            product.stock=product.stock-quantity
            product.save()
        
        discount=data.get('discount',0)
        tax=data.get('tax',0)
        invoice.discount = subtotal *int(discount) / 100

        print(subtotal)
        invoice.tax= subtotal*int(tax)/100
        invoice.total_amount=subtotal + invoice.tax - invoice.discount
        print(invoice.total_amount)
        invoice.save()
        serailizer=InvoioceSerializer(invoice)
        return Response(serailizer.data, status=status.HTTP_201_CREATED)
    
    def patch(self, request, id):
        try:
            invoice = Invoice.objects.get(id=id)
        except Invoice.DoesNotExist:
            raise NotFound('Invoice not found.')
        
        data = request.data
        print(data)
        
        # print(senddata)
        if invoice:
            customer_id= data['customer']
            if customer_id:
                customer=Customer.objects.get(id=customer_id)
                invoice.customer=customer

        # tax=senddata.get('tax',0)
        # discount=senddata.get('discount',0)
        # payment_status=senddata.get('payment_status')
        sub_total=0
        products=data.get('products')
        print(products)
        if products is not None:
            for item in products: 
                
                try:
                    product=Product.objects.get(id=item['product_id'])
                except Product.DoesNotExist:
                    raise NotFound('product not available')
                subtotal=product.price * item['quantity']
                print(subtotal)
                InvoiceProduct.objects.create(product=product,invoice=invoice,price=product.price,subtotal=subtotal)
                sub_total=subtotal+sub_total
        print(sub_total)
    

        # print(total_amount)
        invoice.total_amount=invoice.total_amount+sub_total
        invoice.save()

        return Response({"message": "Invoice updated successfully."}, status=status.HTTP_200_OK)

    
    def delete(self, request, id):
        try:
            invoice=Invoice.objects.get(id=id)
        except Invoice.DoesNotExist:
            raise NotFound('')
        
        invoice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)