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
        if 'payment_status' in data:
            invoice.payment_status = data['payment_status']
        
        
        customer_id = data.get('customer')
        if customer_id:
            customer=Customer.objects.get(id=customer_id)
            invoice.customer=customer
        
        
        sub_total=0
        products=data.get('products')
        if products is not None:

            existing_products=InvoiceProduct.objects.filter(invoice=invoice)
            request_product=[item['product_id'] for item in products]
     
            for product in existing_products:
          
                 if product.id not in request_product:
                    product.product.stock+=product.quantity
                    product.product.save()
                    product.delete()

            for item in products:     
                print(item)        
                try:
                    product=Product.objects.get(id=item['product_id'])
                    print(product)
                except Product.DoesNotExist:
                    raise NotFound ('product not available')
                try:
                    invoice_product=InvoiceProduct.objects.get(invoice=invoice, product=product)
                    invoice_product.quantity=item['quantity']
                    invoice_product.subtotal=invoice_product.price * item['quantity']
                    invoice_product.save()
                    print(invoice_product.subtotal)
                    product.stock=product.stock-invoice_product.quantity
                    product.save()
                    print(product.stock)
                    

                except InvoiceProduct.DoesNotExist:
                    subtotal=product.price*item['quantity']
                    invoice_product=InvoiceProduct.objects.create(product=product, invoice=invoice, price=product.price, subtotal=subtotal, quantity=item['quantity'])
                    # sub_total=sub_total+invoice_product.subtotal

                sub_total=sub_total+invoice_product.subtotal
        print(sub_total)
        if data.get('tax',0):
            invoice.tax=sub_total*int(data['tax'])/100
            # print(invoice.tax)
        if data.get('discount',0):
            invoice.discount=sub_total * int(data['discount'])/100
       
        invoice.total_amount=  sub_total + invoice.tax - invoice.discount
        invoice.save()
        print(invoice.total_amount)
        return Response({"message": "Invoice updated successfully."}, status=status.HTTP_200_OK)

    
    def delete(self, request, id):
        try:
            invoice=Invoice.objects.get(id=id)
        except Invoice.DoesNotExist:
            raise NotFound('')
        
        invoice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)