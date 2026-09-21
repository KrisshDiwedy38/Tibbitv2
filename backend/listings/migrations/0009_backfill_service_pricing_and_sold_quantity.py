from django.db import migrations


def backfill(apps, schema_editor):
    Listings = apps.get_model('listings', 'Listings')
    # Services are always hourly-rate; older rows predate that rule and still
    # carry the field's original 'fixed' default.
    Listings.objects.filter(listing_type='service').exclude(pricing_unit='hourly').update(pricing_unit='hourly')
    # Quantity didn't exist before this listing was already marked sold/booked —
    # bring it in line with the new "quantity 0 == sold" invariant.
    Listings.objects.filter(status='sold').update(quantity=0)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0008_listings_quantity'),
    ]

    operations = [
        migrations.RunPython(backfill, noop),
    ]
