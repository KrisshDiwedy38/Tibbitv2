from rest_framework.routers import DefaultRouter


class OptionalSlashRouter(DefaultRouter):
    """
    Vercel's edge strips trailing slashes before requests reach Django, which
    otherwise forces an extra redirect hop (and, for POST/PATCH/DELETE, risks
    the method/body not surviving it) before DRF's router-generated routes
    match. Matches the optional-slash pattern users/urls.py and
    transactions/urls.py already use for their hand-written re_path routes.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trailing_slash = '/?'
