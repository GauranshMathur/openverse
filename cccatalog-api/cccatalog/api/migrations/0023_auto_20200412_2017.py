# Generated by Django 2.2.10 on 2020-04-12 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_reportimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reportimage',
            name='description',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
    ]
