from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .email_utils import send_contact_email, send_bug_report
from .serializers import (
    RegistrationSerializer,
    OTPVerifySerializer,
    ResendOTPSerializer,
    LoginSerializer,
    UniversitySerializer,
    WaitlistEntrySerializer,
    ContactFormSerializer,
    UserProfileUpdateSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PublicUserProfileSerializer
)
from .models import University, CustomUser
from django.conf import settings

class UniversityListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        universities = University.objects.filter(is_active=True)
        serializer = UniversitySerializer(universities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Registration successful. Please check your email for the OTP.",
                "email": user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            # The serializer validate method returns user and tokens
            user = serializer.validated_data['user']
            tokens = serializer.validated_data.get('tokens')
            waitlist_message = serializer.validated_data.get('waitlist_message')
            
            response_data = {
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }
            
            if tokens:
                response_data["message"] = "Email verified successfully."
                response_data["university_approved"] = True
                # We don't send tokens in JSON anymore, only cookies
                response = Response(response_data, status=status.HTTP_200_OK)
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'] if 'AUTH_COOKIE' in settings.SIMPLE_JWT else 'access_token',
                    value=tokens['access'],
                    expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure=not settings.DEBUG,
                    httponly=True,
                    samesite='Lax'
                )
                response.set_cookie(
                    key='refresh_token',
                    value=tokens['refresh'],
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=not settings.DEBUG,
                    httponly=True,
                    samesite='Lax'
                )
                return response
            else:
                response_data["message"] = waitlist_message
                response_data["university_approved"] = False
                response_data["university_name"] = user.university.name if user.university else "Your campus"
                return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.context['user']
            user.generate_otp()
            return Response({"message": "A new OTP has been sent to your email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = serializer.validated_data['tokens']
            response = Response({
                "message": "Login successful.",
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'] if 'AUTH_COOKIE' in settings.SIMPLE_JWT else 'access_token',
                value=tokens['access'],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=not settings.DEBUG,
                httponly=True,
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh_token',
                value=tokens['refresh'],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=not settings.DEBUG,
                httponly=True,
                samesite='Lax'
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.context['user']
            user.generate_otp()
            return Response({"message": "Password reset OTP sent to email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.context['user']
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            request.data['refresh'] = refresh_token
            
        try:
            response = super().post(request, *args, **kwargs)
        except (InvalidToken, TokenError) as e:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
            
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            if access_token:
                response.set_cookie(
                    key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'),
                    value=access_token,
                    expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure=not settings.DEBUG,
                    httponly=True,
                    samesite='Lax'
                )
            if refresh_token:
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=not settings.DEBUG,
                    httponly=True,
                    samesite='Lax'
                )
        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token") or request.data.get("refresh")
            if refresh_token:
                from rest_framework_simplejwt.tokens import RefreshToken
                token = RefreshToken(refresh_token)
                token.blacklist()
                
            response = Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
            response.delete_cookie(settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'))
            response.delete_cookie('refresh_token')
            return response
            
        except Exception as e:
            response = Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie(settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'))
            response.delete_cookie('refresh_token')
            return response

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileUpdateSerializer(user)
        data = serializer.data
        data["id"] = user.id
        data["email"] = user.email
        data["university"] = user.university.name if user.university else None
        data["reputation_score"] = user.reputation_score
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import generics

class WaitlistCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = WaitlistEntrySerializer



class ContactFounderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        message = serializer.validated_data['message']



        try:
            send_contact_email(email, message)
            return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Failed to send message. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReportBugView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        description = serializer.validated_data['message']



        try:
            send_bug_report(email, description)
            return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Failed to send report. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PublicUserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            user = CustomUser.objects.select_related('university').get(pk=pk, is_active=True)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PublicUserProfileSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class HealthCheckView(APIView):
    """
    Health check endpoint to keep the database awake.
    Performs a lightweight query on the University model.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            University.objects.exists()
            return Response({"status": "ok"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"status": "error", "message": "Service unavailable."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
