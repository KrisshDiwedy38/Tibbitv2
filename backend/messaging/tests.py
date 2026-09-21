from django.test import TestCase, TransactionTestCase
from django.contrib.contenttypes.models import ContentType
from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from rest_framework_simplejwt.tokens import AccessToken
from users.models import CustomUser, University
from listings.models import Listings, Category
from launchpad.models import StartupProject
from messaging.models import Conversation, Message
import messaging.routing

ws_application = URLRouter(messaging.routing.websocket_urlpatterns)

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


class ChatConsumerAuthTestCase(TransactionTestCase):
    """
    ChatConsumer used to accept any connection with no auth check and trust a
    client-supplied sender_id for every message — anyone could read/post into
    any conversation as anyone. Covers the fix: cookie-JWT auth required, and
    only the two participants may connect.

    TransactionTestCase (not TestCase) because database_sync_to_async runs
    DB access on a separate thread — TestCase's atomic-transaction wrapping
    doesn't survive that thread handoff and raises "connection already
    closed".
    """

    def setUp(self):
        self.uni = University.objects.create(name='Test Uni', email_domain='test.edu')
        self.buyer = CustomUser.objects.create(email='buyer@test.edu', university=self.uni, first_name='B', last_name='B')
        self.seller = CustomUser.objects.create(email='seller@test.edu', university=self.uni, first_name='S', last_name='S')
        self.outsider = CustomUser.objects.create(email='outsider@test.edu', university=self.uni, first_name='O', last_name='O')
        self.conversation = Conversation.objects.create(buyer=self.buyer, seller=self.seller)

    async def test_unauthenticated_connection_is_rejected(self):
        communicator = WebsocketCommunicator(ws_application, f"/ws/chat/{self.conversation.id}/")
        connected, _ = await communicator.connect()
        self.assertFalse(connected)
        await communicator.disconnect()

    async def test_non_participant_is_rejected(self):
        token = str(AccessToken.for_user(self.outsider))
        communicator = WebsocketCommunicator(
            ws_application, f"/ws/chat/{self.conversation.id}/",
            headers=[(b'cookie', f'access_token={token}'.encode())]
        )
        connected, _ = await communicator.connect()
        self.assertFalse(connected)
        await communicator.disconnect()

    async def test_participant_connects_and_sender_cannot_be_spoofed(self):
        token = str(AccessToken.for_user(self.buyer))
        communicator = WebsocketCommunicator(
            ws_application, f"/ws/chat/{self.conversation.id}/",
            headers=[(b'cookie', f'access_token={token}'.encode())]
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Attempt to spoof the seller as the sender — must be ignored in favor
        # of the authenticated connection's own identity.
        await communicator.send_json_to({'message': 'hi', 'sender_id': self.seller.id})
        response = await communicator.receive_json_from()
        self.assertEqual(response['sender_id'], self.buyer.id)

        await communicator.disconnect()
