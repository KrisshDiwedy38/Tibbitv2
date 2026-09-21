from django.test import TestCase
from rest_framework.test import APIClient
from users.models import CustomUser, University
from listings.models import Category, Listings


class QuantityAndPricingTestCase(TestCase):
    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.seller = CustomUser.objects.create(email='seller@test.edu', university=self.uni, first_name='S', last_name='S')
        self.category = Category.objects.create(name='Tech')

    def test_service_listing_is_always_hourly(self):
        listing = Listings.objects.create(
            title='Tutoring', description='d', price=200, category=self.category,
            seller=self.seller, listing_type='service', pricing_unit='fixed', location='Campus'
        )
        self.assertEqual(listing.pricing_unit, 'hourly')

    def test_reduce_quantity_only_marks_sold_at_zero(self):
        listing = Listings.objects.create(
            title='Textbooks (set of 3)', description='d', price=50, category=self.category,
            seller=self.seller, listing_type='product', quantity=3, location='Campus'
        )
        listing.reduce_quantity()
        self.assertEqual(listing.quantity, 2)
        self.assertEqual(listing.status, 'active')

        listing.reduce_quantity()
        listing.reduce_quantity()
        self.assertEqual(listing.quantity, 0)
        self.assertEqual(listing.status, 'sold')

    def test_reduce_quantity_does_not_go_negative(self):
        listing = Listings.objects.create(
            title='One-off item', description='d', price=10, category=self.category,
            seller=self.seller, listing_type='product', quantity=0, location='Campus'
        )
        listing.reduce_quantity()
        self.assertEqual(listing.quantity, 0)
        self.assertEqual(listing.status, 'sold')


class CategoryListTestCase(TestCase):
    def test_services_and_tutoring_is_not_offered(self):
        # Service listings never carry a category (nulled server-side), so this
        # legacy category only ever cluttered the product creation form.
        client = APIClient()
        resp = client.get('/api/listings/categories/')
        names = [c['name'] for c in resp.data.get('results', resp.data)]
        self.assertNotIn('Services & Tutoring', names)
