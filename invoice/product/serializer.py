from rest_framework import serializers
from .models  import Product

class Product(serializers.ModelSerializer):
    class Meta:
        model=Product
        field='__all__'
