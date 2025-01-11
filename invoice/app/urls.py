
from django.urls import path


from . import views
urlpatterns = [
    path('', views.AdminLogin.as_view(), name='login'),
    path('dashboard/',views.Dashboard.as_view(),name='Dashboard'),
    # path('logout/', views.Logout.as_view(), name='logout')
  

]