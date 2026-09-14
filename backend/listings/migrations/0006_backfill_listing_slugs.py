from django.db import migrations
from django.utils.text import slugify


def backfill_slugs(apps, schema_editor):
    Listings = apps.get_model('listings', 'Listings')
    for listing in Listings.objects.filter(slug__isnull=True):
        listing.slug = slugify(listing.title) or f"listing-{listing.id}"
        listing.save(update_fields=['slug'])


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0005_listings_slug_alter_listingimage_image'),
    ]

    operations = [
        migrations.RunPython(backfill_slugs, migrations.RunPython.noop),
    ]
