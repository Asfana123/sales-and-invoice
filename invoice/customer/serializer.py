from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Customer
        fields='__all__'

    def validate_email(self,value):
        if Customer.objects.filter(email=value).exist():
            raise serializers.ValidationError('email id already exist')
        
        return value
    
    def validate_phonenumber(self,value):
        if not value.isdigit() or len(value)!=10:
            raise serializers.ValidationError('enter valid phone number')