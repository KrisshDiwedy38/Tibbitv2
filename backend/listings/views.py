from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Listings, SavedListing
from .serializers import (
    CategorySerializer,
    ListingSerializer,
    ListingCreateUpdateSerializer,
    SavedListingSerializer
)

from backend.permissions import IsOwnerOrReadOnly

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listings.objects.filter(status='active').select_related('category', 'seller').prefetch_related('images')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'condition']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ListingCreateUpdateSerializer
        return ListingSerializer

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save(self, request, pk=None):
        listing = self.get_object()
        saved_listing, created = SavedListing.objects.get_or_create(user=request.user, listing=listing)
        if created:
            return Response({'status': 'listing saved'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'listing already saved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unsave(self, request, pk=None):
        listing = self.get_object()
        SavedListing.objects.filter(user=request.user, listing=listing).delete()
        return Response({'status': 'listing unsaved'}, status=status.HTTP_200_OK)

class SavedListingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SavedListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedListing.objects.filter(user=self.request.user).select_related('listing')
