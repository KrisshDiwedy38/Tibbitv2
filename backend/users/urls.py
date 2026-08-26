from django.urls import path, re_path
from .views import (
    UniversityListView,
    RegistrationView,
    OTPVerifyView,
    ResendOTPView,
    LoginView,
    LogoutView,
    UserProfileView,
    WaitlistCreateView,
    ContactFounderView,
    ReportBugView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    CookieTokenRefreshView,
    PublicUserProfileView
)

urlpatterns = [
    re_path(r'^universities/?$', UniversityListView.as_view(), name='university-list'),
    re_path(r'^register/?$', RegistrationView.as_view(), name='register'),
    re_path(r'^verify-otp/?$', OTPVerifyView.as_view(), name='verify-otp'),
    re_path(r'^resend-otp/?$', ResendOTPView.as_view(), name='resend-otp'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^logout/?$', LogoutView.as_view(), name='logout'),
    re_path(r'^password-reset/?$', PasswordResetRequestView.as_view(), name='password-reset'),
    re_path(r'^password-reset-confirm/?$', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    re_path(r'^token/refresh/?$', CookieTokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^profile/?$', UserProfileView.as_view(), name='profile'),
    re_path(r'^(?P<pk>[0-9]+)/profile/?$', PublicUserProfileView.as_view(), name='public-user-profile'),
    re_path(r'^(?P<pk>[0-9]+)/?$', PublicUserProfileView.as_view(), name='public-user-detail'),
    re_path(r'^waitlist/?$', WaitlistCreateView.as_view(), name='waitlist'),
    re_path(r'^contact/?$', ContactFounderView.as_view(), name='contact'),
    re_path(r'^report-bug/?$', ReportBugView.as_view(), name='report-bug'),
]
