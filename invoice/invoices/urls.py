from django.urls import path
from . import views

urlpatterns = [
    path('', views.InvoiceApiview.as_view(), name='invoices'),
    path('<int:id>', views.InvoiceApiview.as_view(), name='invoice_details'),
]
