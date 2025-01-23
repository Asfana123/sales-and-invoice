from django.db import models
from customer.models import Customer
from product.models import Product

class Invoice(models.Model):
    PAYMENT_STATUS=[('Paid','Paid'),('Unpaid','Unpaid')]

    customer=models.ForeignKey(Customer, on_delete=models.CASCADE)
    discount=models.DecimalField(max_digits=10, decimal_places=2,default=0)
    tax=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount=models.DecimalField(max_digits=10, decimal_places=2,default=0)
    payment_status=models.CharField(max_length=10, choices=PAYMENT_STATUS, default='unpaid')
    created_at=models.DateField(auto_now_add=True)
    updated_at=models.DateField(auto_now=True)

    def __str__(self):
        return f"invoice #{self.id}"
    
class InvoiceProduct(models.Model):
    invoice=models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='invoice_products')
    product=models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=1)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    subtotal=models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    # def save(self, *args,**kwargs):
    #     self.subtotal=self.price*self.quantity
    #     super().save(*args, **kwargs) 