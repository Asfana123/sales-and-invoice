from rest_framework import serializers
from .models import InvoiceProduct,Invoice

class InvoioceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Invoice
        fileds='__all__'


class InvoiceProductSerializereeEE(serializers.ModelSerializer):

    class Meta:
        model=InvoiceProduct
        fileds='__all__'