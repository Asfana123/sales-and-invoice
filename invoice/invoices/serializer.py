from rest_framework import serializers
from .models import InvoiceProduct,Invoice
from customer.serializer import CustomerSerializer
from product.serializer import ProductSerializer

class InvoioceSerializer(serializers.ModelSerializer):
    customer=CustomerSerializer()
    class Meta:
        model=Invoice
        fields='__all__'


class InvoiceProductSerializer(serializers.ModelSerializer):
    product=ProductSerializer()
    invoice=InvoioceSerializer()
    class Meta:
        model=InvoiceProduct
        fields='__all__'