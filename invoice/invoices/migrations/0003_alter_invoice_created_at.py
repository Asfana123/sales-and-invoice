# Generated by Django 5.1.4 on 2025-01-16 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0002_alter_invoice_discount_alter_invoice_tax_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='created_at',
            field=models.DateField(auto_now_add=True),
        ),
    ]
