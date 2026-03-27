from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UniversityListView,
    RegistrationView,
    OTPVerifyView,
    ResendOTPView,
    LoginView,
    UserProfileView,
    WaitlistCreateView
)

urlpatterns = [
    path('universities/', UniversityListView.as_view(), name='university-list'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('verify-otp/', OTPVerifyView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('waitlist/', WaitlistCreateView.as_view(), name='waitlist'),
]
