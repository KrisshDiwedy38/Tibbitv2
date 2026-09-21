from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient, APITestCase
from users.models import CustomUser, University
from transactions.models import Transaction, Review
from listings.models import Category, Listings

class TransactionOTPTestCase(TestCase):
    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.seller = CustomUser.objects.create(email='seller@test.edu', university=self.uni, first_name='S', last_name='S')
        self.buyer = CustomUser.objects.create(email='buyer@test.edu', university=self.uni, first_name='B', last_name='B')
        
        self.category = Category.objects.create(name='Tech')
        self.listing = Listings.objects.create(title='Laptop', description='Good', price=500.0, category=self.category, seller=self.seller, listing_type='product')
        
        self.transaction = Transaction.objects.create(seller=self.seller, buyer=self.buyer, listing=self.listing, agreed_price=500.0)

    def test_dual_otp_verification(self):
        seller_otp, buyer_otp = self.transaction.generate_otps()
        self.assertIsNotNone(seller_otp)
        self.assertIsNotNone(buyer_otp)
        
        # Test invalid OTP
        success, msg = self.transaction.verify_seller_otp('000000')
        self.assertFalse(success)
        
        # Test valid seller OTP
        success, msg = self.transaction.verify_seller_otp(seller_otp)
        self.assertTrue(success)
        self.assertTrue(self.transaction.seller_verified)
        self.assertEqual(self.transaction.status, 'pending')  # Still pending because buyer hasn't verified
        
        # Test valid buyer OTP
        success, msg = self.transaction.verify_buyer_otp(buyer_otp)
        self.assertTrue(success)
        self.assertTrue(self.transaction.buyer_verified)
        
        # Check completion
        self.assertEqual(self.transaction.status, 'completed')
        self.assertIsNotNone(self.transaction.completed_at)
        
        # Refresh listing from DB to check status
        self.listing.refresh_from_db()
        self.assertEqual(self.listing.status, 'sold')

    def test_otp_locks_out_after_five_failed_attempts(self):
        # verify_*_otp previously had no attempt cap, unlike the analogous
        # email-OTP flow — an unlimited number of guesses against a 6-digit
        # code let one party confirm the exchange without the other party
        # ever reading their code aloud.
        seller_otp, _ = self.transaction.generate_otps()
        wrong = '000000' if seller_otp != '000000' else '111111'

        for _ in range(5):
            success, _ = self.transaction.verify_seller_otp(wrong)
            self.assertFalse(success)

        # Even the correct code is now rejected until the trade is restarted.
        success, message = self.transaction.verify_seller_otp(seller_otp)
        self.assertFalse(success)
        self.assertIn('Too many failed attempts', message)

class UserReputationTestCase(TestCase):
    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.user = CustomUser.objects.create(email='user@test.edu', university=self.uni, first_name='U', last_name='U')
        self.other_user = CustomUser.objects.create(email='other@test.edu', university=self.uni, first_name='O', last_name='O')
        self.transaction = Transaction.objects.create(seller=self.user, buyer=self.other_user, agreed_price=10.0, status='completed')

    def test_reputation_calculation(self):
        self.assertEqual(self.user.reputation_score, 0.0)
        
        Review.objects.create(transaction=self.transaction, reviewer=self.other_user, reviewee=self.user, rating=4)
        self.assertEqual(self.user.reputation_score, 4.0)
        
        Review.objects.create(transaction=self.transaction, reviewer=self.user, reviewee=self.other_user, rating=5)
        self.assertEqual(self.user.reputation_score, 4.0) # User score is still 4.0
        
        # Another review for user to test average
        tx2 = Transaction.objects.create(seller=self.user, buyer=self.other_user, agreed_price=20.0, status='completed')
        Review.objects.create(transaction=tx2, reviewer=self.other_user, reviewee=self.user, rating=2)

        # Average of 4 and 2 is 3.0
        self.assertEqual(self.user.reputation_score, 3.0)


class InitiateTradeAPITestCase(APITestCase):
    """Covers /api/transactions/ create validation for both listing types."""

    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.seller = CustomUser.objects.create(email='seller2@test.edu', university=self.uni, first_name='S', last_name='S')
        self.buyer = CustomUser.objects.create(email='buyer2@test.edu', university=self.uni, first_name='B', last_name='B')
        self.category = Category.objects.create(name='Tech')

        self.product = Listings.objects.create(
            title='Product', description='d', price=100, category=self.category,
            seller=self.seller, listing_type='product', pricing_unit='fixed',
            condition='good', location='Campus', status='active'
        )
        self.service = Listings.objects.create(
            title='Service', description='d', price=50, category=self.category,
            seller=self.seller, listing_type='service', pricing_unit='hourly',
            location='Campus', status='active'
        )

    def _client_for(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        return client

    def test_buyer_can_initiate_on_product_and_service(self):
        for listing in (self.product, self.service):
            resp = self._client_for(self.buyer).post('/api/transactions/', {
                'listing': listing.id, 'agreed_price': str(listing.price)
            }, format='json')
            self.assertEqual(resp.status_code, 201, resp.data)

    def test_seller_can_initiate_with_explicit_buyer(self):
        resp = self._client_for(self.seller).post('/api/transactions/', {
            'listing': self.product.id, 'agreed_price': '100.00', 'buyer': self.buyer.id
        }, format='json')
        self.assertEqual(resp.status_code, 201, resp.data)

    def test_duplicate_pending_trade_is_blocked(self):
        self._client_for(self.buyer).post('/api/transactions/', {
            'listing': self.product.id, 'agreed_price': '100.00'
        }, format='json')
        resp = self._client_for(self.buyer).post('/api/transactions/', {
            'listing': self.product.id, 'agreed_price': '100.00'
        }, format='json')
        self.assertEqual(resp.status_code, 400)

    def test_sold_listing_cannot_start_new_trade(self):
        self.product.status = 'sold'
        self.product.save(update_fields=['status'])
        resp = self._client_for(self.buyer).post('/api/transactions/', {
            'listing': self.product.id, 'agreed_price': '100.00'
        }, format='json')
        self.assertEqual(resp.status_code, 400)

    def test_create_without_trailing_slash_does_not_redirect(self):
        # Vercel's edge strips a request's final trailing slash before it
        # reaches Django. Without the optional-slash prefix in backend/urls.py,
        # this 404s, Django's APPEND_SLASH redirects back to the slash version,
        # Vercel strips it again, and the browser sees net::ERR_TOO_MANY_REDIRECTS.
        resp = self._client_for(self.buyer).post('/api/transactions', {
            'listing': self.product.id, 'agreed_price': str(self.product.price)
        }, format='json')
        self.assertEqual(resp.status_code, 201, resp.data)
