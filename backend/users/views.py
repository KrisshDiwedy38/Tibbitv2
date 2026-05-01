from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    RegistrationSerializer,
    OTPVerifySerializer,
    ResendOTPSerializer,
    LoginSerializer,
    UniversitySerializer,
    WaitlistEntrySerializer,
    ContactFormSerializer
)
from .models import University
import resend
import os
from django.conf import settings

resend.api_key = os.environ.get("RESEND_FOUNDER_API_KEY")
EMAIL_ADDRESS = os.environ.get("FOUNDER_EMAIL")
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
            tokens = serializer.validated_data['tokens']
            return Response({
                "message": "Email verified successfully.",
                "tokens": tokens,
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }, status=status.HTTP_200_OK)
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
            return Response({
                "message": "Login successful.",
                "tokens": tokens,
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "bio": user.bio,
            "graduation_year": user.graduation_year,
            "university": user.university.name if user.university else None
        }, status=status.HTTP_200_OK)

from rest_framework import generics

class WaitlistCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = WaitlistEntrySerializer

class ContactFormView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']
            
            try:
                resend.Emails.send({
                    "from": "Tibbit Platform <onboarding@resend.dev>",
                    "to": "[EMAIL_ADDRESS]",
                    "subject": f"Tibbit Contact Form from {email}",
                    "text": f"From: {email}\n\nMessage:\n{message}",
                    "reply_to": email
                })
                return Response({"message": "Message sent successfully!"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": "Failed to send message."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BugReportView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']
            
            try:
                resend.Emails.send({
                    "from": "Tibbit Platform <onboarding@resend.dev>",
                    "to": "[EMAIL_ADDRESS]",
                    "subject": f"CRITICAL: Tibbit Bug Report from {email}",
                    "text": f"Bug reported by: {email}\n\nDescription:\n{message}",
                    "reply_to": email
                })
                return Response({"message": "Bug report sent successfully!"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": "Failed to send bug report."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
