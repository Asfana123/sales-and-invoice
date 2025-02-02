# Generated by Django 5.1.4 on 2025-01-23 07:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0006_invoiceproduct_price_alter_invoiceproduct_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoiceproduct',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
        migrations.AlterField(
            model_name='invoiceproduct',
            name='subtotal',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]
