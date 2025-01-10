from django.db import models


class Customer(models.Model):
    name=models.CharField(max_length=20)
    email=models.EmailField()
    phone=models.CharField(max_length=10)
    address=models.TextField()

    def __str__(self):
        return self.name