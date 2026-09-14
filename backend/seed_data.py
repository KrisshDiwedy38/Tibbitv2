import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import University, CustomUser
from listings.models import Category, Listings, ListingImage
from messaging.models import Conversation, Message
from django.contrib.contenttypes.models import ContentType
from decimal import Decimal

def seed():
    print("=== SEEDING TIBBIT DATABASE ===")

    # 1. Universities
    uni, _ = University.objects.get_or_create(
        email_domain='manavrachna.net',
        defaults={
            'name': 'Manav Rachna International Institute of Research and Studies',
            'location': 'Faridabad, India',
            'is_active': True,
            'is_verified': True
        }
    )
    uni.is_active = True
    uni.is_verified = True
    uni.save()

    # Also enable stanford and mit
    for name, domain in [('Stanford University', 'stanford.edu'), ('MIT', 'mit.edu')]:
        u, _ = University.objects.get_or_create(
            email_domain=domain,
            defaults={'name': name, 'location': 'USA', 'is_active': True, 'is_verified': True}
        )
        u.is_active = True
        u.is_verified = True
        u.save()

    print("[OK] Universities verified and active.")

    # 2. Test Users
    seller_user, created = CustomUser.objects.get_or_create(
        email='krissh_diwedy23@manavrachna.net',
        defaults={
            'first_name': 'Krissh',
            'last_name': 'Diwedy',
            'university': uni,
            'is_email_verified': True,
            'bio': 'Computer Science sophomore. Trading textbooks, electronics, and dorm gear.',
            'graduation_year': 2027,
            'phone_number': '+91 9876543210'
        }
    )
    seller_user.set_password('Password123!')
    seller_user.is_email_verified = True
    seller_user.university = uni
    seller_user.first_name = 'Krissh'
    seller_user.last_name = 'Diwedy'
    seller_user.save()

    buyer_user, created = CustomUser.objects.get_or_create(
        email='alex.campus@manavrachna.net',
        defaults={
            'first_name': 'Alex',
            'last_name': 'Chen',
            'university': uni,
            'is_email_verified': True,
            'bio': 'Mechanical Engineering junior. Love tech and good books.',
            'graduation_year': 2026,
            'phone_number': '+91 9123456789'
        }
    )
    buyer_user.set_password('Password123!')
    buyer_user.is_email_verified = True
    buyer_user.university = uni
    buyer_user.first_name = 'Alex'
    buyer_user.last_name = 'Chen'
    buyer_user.save()

    print(f"[OK] Test Users ready:\n  - {seller_user.email} (Password: Password123!)\n  - {buyer_user.email} (Password: Password123!)")

    # 3. Categories
    categories_data = [
        ('Books & Notes', 'menu_book', 'Textbooks, revision guides, course notes'),
        ('Electronics', 'devices', 'Laptops, headphones, chargers, calculators'),
        ('Furniture', 'chair', 'Dorm chairs, desks, lamps, storage racks'),
        ('Apparel & Gear', 'apparel', 'College hoodies, backpacks, sports gear'),
        ('Services & Tutoring', 'school', 'Peer tutoring, coding help, design services'),
        ('Housing & Sublets', 'home', 'Student housing, sublets, roommate matching'),
    ]

    cat_map = {}
    for name, icon, desc in categories_data:
        c, _ = Category.objects.get_or_create(
            name=name,
            defaults={'icon': icon, 'description': desc, 'is_active': True}
        )
        cat_map[name] = c

    print("[OK] Categories verified.")

    # 4. Listings
    sample_listings = [
        {
            'title': 'Sony WH-1000XM4 Noise Cancelling Headphones',
            'description': 'Barely used for one semester in library study sessions. Exceptional battery life, original box, and travel case included. Great for focusing in noisy dorms.',
            'price': Decimal('9999.00'),
            'category': cat_map['Electronics'],
            'condition': 'like_new',
            'location': 'Central Campus Library, 2nd Floor',
            'seller': seller_user,
        },
        {
            'title': 'Calculus: Early Transcendentals (8th Ed) - Stewart',
            'description': 'Required for Math 101/102. Clean pages, no highlighting. Comes with solution manual PDF link. Save over 60% compared to bookstore prices.',
            'price': Decimal('850.00'),
            'category': cat_map['Books & Notes'],
            'condition': 'good',
            'location': 'Block C Engineering Hall',
            'seller': seller_user,
        },
        {
            'title': 'Ergonomic Mesh Study Chair (Adjustable Lumbar)',
            'description': 'Black ergonomic desk chair with breathable mesh back and smooth rolling wheels. Moving to a furnished apartment next month so need to sell quickly.',
            'price': Decimal('2200.00'),
            'category': cat_map['Furniture'],
            'condition': 'good',
            'location': 'North Dorms Quad B',
            'seller': seller_user,
        },
        {
            'title': 'Apple Magic Keyboard - Space Gray (Lightning)',
            'description': 'Slim wireless Bluetooth keyboard in Space Gray. Works with Mac, iPad, Windows. Great key travel and rechargeable battery.',
            'price': Decimal('4500.00'),
            'category': cat_map['Electronics'],
            'condition': 'like_new',
            'location': 'Student Union Food Court',
            'seller': buyer_user,
        },
        {
            'title': 'Python & Data Structures Peer Tutoring (1 hr)',
            'description': '1-on-1 tutoring sessions for CS 101/201. I got an A in DS & Algo. We can cover trees, graphs, dynamic programming, or debug your assignments together.',
            'price': Decimal('500.00'),
            'category': cat_map['Services & Tutoring'],
            'condition': 'new',
            'location': 'Computer Lab 3 or Google Meet',
            'seller': seller_user,
        },
        {
            'title': 'LED Desk Lamp with USB Fast Charger & Touch Dimmer',
            'description': 'Dimmable study lamp with 5 color modes, timer, and a built-in USB port to charge your phone while studying at night.',
            'price': Decimal('650.00'),
            'category': cat_map['Furniture'],
            'condition': 'like_new',
            'location': 'East Campus Hostel',
            'seller': buyer_user,
        },
    ]

    created_listings = []
    for l_data in sample_listings:
        listing, _ = Listings.objects.get_or_create(
            title=l_data['title'],
            seller=l_data['seller'],
            defaults={
                'description': l_data['description'],
                'price': l_data['price'],
                'category': l_data['category'],
                'condition': l_data['condition'],
                'location': l_data['location'],
                'status': 'active'
            }
        )
        created_listings.append(listing)

    print(f"[OK] Seeded {len(created_listings)} active marketplace listings.")

    # 5. Seed a Sample Conversation
    target_listing = created_listings[0] # Sony headphones
    ct = ContentType.objects.get_for_model(Listings)

    conv, _ = Conversation.objects.get_or_create(
        buyer=buyer_user,
        seller=seller_user,
        content_type=ct,
        object_id=target_listing.id
    )

    if not conv.messages.exists():
        Message.objects.create(
            conversation=conv,
            sender=buyer_user,
            content="Hey Krissh! Are the Sony headphones still available? Can we meet at the library cafeteria tomorrow around 2 PM?"
        )
        Message.objects.create(
            conversation=conv,
            sender=seller_user,
            content="Hi Alex! Yes, they're available. 2 PM at the library cafeteria works great for me. See you there!"
        )
        print("[OK] Seeded sample conversation and messages.")

    print("\n=== SEEDING COMPLETED SUCCESSFULLY ===")

if __name__ == '__main__':
    seed()
