import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken
from .models import Conversation, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # AuthMiddlewareStack (asgi.py) only populates scope['user'] from a
        # Django session cookie, which this app never sets — auth here is
        # cookie-based JWT (same as CookieJWTAuthentication for REST), so it
        # has to be validated manually from the raw Cookie header.
        self.user = await self._authenticate()
        if self.user is None:
            await self.close(code=4001)
            return

        if not await self._is_participant(self.user, self.conversation_id):
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # sender is always the authenticated connection's user — never trust
        # a client-supplied id, or anyone could post messages as anyone else.
        new_msg = await self.save_message(self.user.id, self.conversation_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': new_msg.id,
                'message': message,
                'sender_id': self.user.id,
                'timestamp': str(new_msg.timestamp)
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'message': event['message'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp']
        }))

    async def _authenticate(self):
        headers = dict(self.scope.get('headers') or [])
        cookie_header = headers.get(b'cookie', b'').decode()
        cookies = {}
        for part in cookie_header.split(';'):
            if '=' in part:
                key, value = part.strip().split('=', 1)
                cookies[key] = value

        raw_token = cookies.get('access_token')
        if not raw_token:
            return None

        try:
            validated = AccessToken(raw_token)
            return await self._get_user(validated['user_id'])
        except (TokenError, KeyError):
            return None

    @database_sync_to_async
    def _get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def _is_participant(self, user, conversation_id):
        try:
            return Conversation.objects.filter(
                Q(buyer=user) | Q(seller=user), id=conversation_id
            ).exists()
        except (ValueError, TypeError):
            return False

    @database_sync_to_async
    def save_message(self, sender_id, conversation_id, content):
        return Message.objects.create(
            sender_id=sender_id,
            conversation_id=conversation_id,
            content=content
        )
