from rest_framework import serializers
from .models  import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'

    def validate(self,data):
        name=data.get('name')
        category=data.get('category')
        product_id=self.instance.id if self.instance else None
        if Product.objects.filter(name=name ,category=category).exclude(id=product_id).exists():
             raise serializers.ValidationError('product already exist')
        return data