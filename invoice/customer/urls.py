from django.urls import path
from . import views

urlpatterns = [
    path('',views.CustomerAPIview.as_view(),name='customers'),
    
]
