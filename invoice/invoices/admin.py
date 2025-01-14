from django.contrib import admin
from .models import Invoice,InvoiceProduct
# Register your models here.
admin.site.register(Invoice)
admin.site.register(InvoiceProduct)