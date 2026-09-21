from django.db import migrations

DEFAULT_CATEGORIES = [
    {"name": "Electronics", "icon": "devices", "description": "Laptops, phones, audio gear & accessories"},
    {"name": "Books & Notes", "icon": "menu_book", "description": "Textbooks, course packs & study guides"},
    {"name": "Furniture", "icon": "chair", "description": "Dorm & apartment chairs, desks & lamps"},
    {"name": "Apparel & Gear", "icon": "apparel", "description": "Campus hoodies, jackets & activewear"},
    {"name": "Housing & Sublets", "icon": "home", "description": "Sublets, lease transfers & roommate searches"},
]


def seed(apps, schema_editor):
    Category = apps.get_model('listings', 'Category')
    for cat in DEFAULT_CATEGORIES:
        Category.objects.get_or_create(name=cat["name"], defaults=cat)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    # CategoryViewSet.get_queryset() used to lazily seed these on the first
    # request whenever the table was empty — every single unauthenticated
    # GET /api/listings/categories/ paid a Category.objects.exists() check
    # forever after, and concurrent first-requests could race each other in
    # get_or_create. Seed data belongs in a migration, not view-time writes.

    dependencies = [
        ('listings', '0010_deactivate_services_tutoring_category'),
    ]

    operations = [
        migrations.RunPython(seed, noop),
    ]
