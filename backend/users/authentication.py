from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Extract the token from the header first (in case we need to support mobile apps later)
        header = self.get_header(request)
        if header is None:
            # If not in header, look in cookies
            raw_token = request.COOKIES.get('access_token')
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except (AuthenticationFailed, InvalidToken) as e:
            # Optionally log the error or handle it specifically
            return None

        return self.get_user(validated_token), validated_token
