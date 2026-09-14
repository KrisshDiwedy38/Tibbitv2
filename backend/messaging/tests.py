from django.test import TestCase
from django.contrib.contenttypes.models import ContentType
from users.models import CustomUser, University
from listings.models import Listings, Category
from launchpad.models import StartupProject
from messaging.models import Conversation, Message

class PolymorphicMessagingTestCase(TestCase):
    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.buyer = CustomUser.objects.create(email='buyer@test.edu', university=self.uni, first_name='B', last_name='B')
        self.seller = CustomUser.objects.create(email='seller@test.edu', university=self.uni, first_name='S', last_name='S')
        
        self.category = Category.objects.create(name='Tech')
        self.listing = Listings.objects.create(title='Laptop', description='Good', price=500.0, category=self.category, seller=self.seller)
        
        self.project = StartupProject.objects.create(name='Cool App', tagline='App', description='Building', founder=self.seller)

    def test_listing_conversation(self):
        # Conversation tied to a Marketplace Listing
        ctype = ContentType.objects.get_for_model(Listings)
        conv = Conversation.objects.create(
            buyer=self.buyer, 
            seller=self.seller, 
            content_type=ctype, 
            object_id=self.listing.id
        )
        self.assertEqual(conv.content_object, self.listing)
        self.assertIn('Laptop', str(conv))

    def test_startup_conversation(self):
        # Conversation tied to a Startup Project
        ctype = ContentType.objects.get_for_model(StartupProject)
        conv = Conversation.objects.create(
            buyer=self.buyer, 
            seller=self.seller, 
            content_type=ctype, 
            object_id=self.project.id
        )
        self.assertEqual(conv.content_object, self.project)
        self.assertIn('Cool App', str(conv))

    def test_direct_message_conversation(self):
        # Direct Message (no content object)
        conv = Conversation.objects.create(
            buyer=self.buyer, 
            seller=self.seller
        )
        self.assertIsNone(conv.content_object)
        self.assertIn('Direct Message', str(conv))
