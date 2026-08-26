from django.urls import path, re_path
from .views import TransactionViewSet, ReviewViewSet

urlpatterns = [
    # Context fetcher for active chat (must come before regex matching PK)
    re_path(r'^for_context/?$', TransactionViewSet.as_view({
        'get': 'for_context'
    }), name='transaction-for-context'),

    # Reviews collection & detail
    re_path(r'^reviews/?$', ReviewViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='review-list'),

    re_path(r'^reviews/(?P<pk>[0-9]+)/?$', ReviewViewSet.as_view({
        'get': 'retrieve'
    }), name='review-detail'),

    # Transaction OTP verification & actions
    re_path(r'^(?P<pk>[0-9]+)/verify_otp/?$', TransactionViewSet.as_view({
        'post': 'verify_otp'
    }), name='transaction-verify-otp'),

    re_path(r'^(?P<pk>[0-9]+)/cancel/?$', TransactionViewSet.as_view({
        'post': 'cancel'
    }), name='transaction-cancel'),

    # Single Transaction Detail
    re_path(r'^(?P<pk>[0-9]+)/?$', TransactionViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='transaction-detail'),

    # List & Create Transactions
    re_path(r'^$', TransactionViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='transaction-list'),
]
