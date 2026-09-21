import io
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
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


def _tiny_image(name='test.png'):
    buf = io.BytesIO()
    Image.new('RGB', (1, 1)).save(buf, format='PNG')
    buf.seek(0)
    return SimpleUploadedFile(name, buf.read(), content_type='image/png')


class ListingImageUploadLimitsTestCase(TestCase):
    """
    ListingCreateUpdateSerializer.uploaded_images had no cap — an
    authenticated user could attach an unbounded number/size of images to a
    single create request, since the only backstop was the global per-minute
    request throttle (request count, not payload size).
    """

    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.seller = CustomUser.objects.create(email='seller@test.edu', university=self.uni, first_name='S', last_name='S')
        self.category = Category.objects.create(name='Tech')

    def _client(self):
        client = APIClient()
        client.force_authenticate(user=self.seller)
        return client

    def _base_payload(self):
        return {
            'title': 'Desk Lamp', 'description': 'd', 'price': '10', 'quantity': '1',
            'category': self.category.id, 'listing_type': 'product', 'pricing_unit': 'fixed',
            'condition': 'good', 'location': 'Campus',
        }

    def test_more_than_five_images_is_rejected(self):
        payload = self._base_payload()
        payload['uploaded_images'] = [_tiny_image(f'{i}.png') for i in range(6)]
        resp = self._client().post('/api/listings/items/', payload, format='multipart')
        self.assertEqual(resp.status_code, 400, resp.data)

    def test_oversized_image_is_rejected(self):
        # Uncompressed BMP so the size is deterministic and it still decodes
        # as a genuinely valid image (ImageField rejects non-image bytes
        # before our size check ever runs).
        buf = io.BytesIO()
        Image.new('RGB', (1500, 1500)).save(buf, format='BMP')
        buf.seek(0)
        self.assertGreater(len(buf.getvalue()), 5 * 1024 * 1024)
        oversized = SimpleUploadedFile('big.bmp', buf.read(), content_type='image/bmp')

        payload = self._base_payload()
        payload['uploaded_images'] = [oversized]
        resp = self._client().post('/api/listings/items/', payload, format='multipart')
        self.assertEqual(resp.status_code, 400, resp.data)

    def test_five_valid_images_is_accepted(self):
        payload = self._base_payload()
        payload['uploaded_images'] = [_tiny_image(f'{i}.png') for i in range(5)]
        resp = self._client().post('/api/listings/items/', payload, format='multipart')
        self.assertEqual(resp.status_code, 201, resp.data)


class CategoryListTestCase(TestCase):
    def test_services_and_tutoring_is_not_offered(self):
        # Service listings never carry a category (nulled server-side), so this
        # legacy category only ever cluttered the product creation form.
        client = APIClient()
        resp = client.get('/api/listings/categories/')
        names = [c['name'] for c in resp.data.get('results', resp.data)]
        self.assertNotIn('Services & Tutoring', names)
