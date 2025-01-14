from django.urls import path
from . import views

urlpatterns = [
   path('',views.ProductApiView.as_view(), name='products'),
   path('<int:id>/', views.ProductApiView.as_view(), name='product_details'),
]
