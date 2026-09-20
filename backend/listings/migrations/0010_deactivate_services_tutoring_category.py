from django.db import migrations


def deactivate(apps, schema_editor):
    Category = apps.get_model('listings', 'Category')
    # Service listings never carry a category (nulled out in
    # ListingCreateUpdateSerializer.validate for listing_type='service'), so
    # this category only ever showed up as a confusing option on the product
    # creation form.
    Category.objects.filter(name='Services & Tutoring').update(is_active=False)


def reactivate(apps, schema_editor):
    Category = apps.get_model('listings', 'Category')
    Category.objects.filter(name='Services & Tutoring').update(is_active=True)


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0009_backfill_service_pricing_and_sold_quantity'),
    ]

    operations = [
        migrations.RunPython(deactivate, reactivate),
    ]
