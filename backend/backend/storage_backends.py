import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage, Storage
from django.utils.deconstruct import deconstructible
from storages.backends.s3boto3 import S3Boto3Storage

def has_supabase_credentials():
    access_key = os.environ.get("SUPABASE_ACCESS_KEY_ID")
    endpoint = os.environ.get("SUPABASE_S3_ENDPOINT_URL")
    return bool(access_key and endpoint and access_key.strip() and endpoint.strip())

@deconstructible
class S3MediaStorage(S3Boto3Storage):
    def __init__(self, *args, **kwargs):
        kwargs['access_key'] = os.environ.get("SUPABASE_ACCESS_KEY_ID")
        kwargs['secret_key'] = os.environ.get("SUPABASE_SECRET_ACCESS_KEY")
        kwargs['endpoint_url'] = os.environ.get("SUPABASE_S3_ENDPOINT_URL")
        kwargs['bucket_name'] = os.environ.get("SUPABASE_STORAGE_BUCKET_NAME", "tibbit-media")
        kwargs['region_name'] = os.environ.get("SUPABASE_REGION", "ap-south-1")
        kwargs['querystring_auth'] = False
        kwargs['default_acl'] = "public-read"
        super().__init__(*args, **kwargs)

@deconstructible
class S3AvatarStorage(S3Boto3Storage):
    def __init__(self, *args, **kwargs):
        kwargs['access_key'] = os.environ.get("SUPABASE_ACCESS_KEY_ID")
        kwargs['secret_key'] = os.environ.get("SUPABASE_SECRET_ACCESS_KEY")
        kwargs['endpoint_url'] = os.environ.get("SUPABASE_S3_ENDPOINT_URL")
        kwargs['bucket_name'] = os.environ.get("SUPABASE_AVATAR_BUCKET_NAME", "user-avatars")
        kwargs['region_name'] = os.environ.get("SUPABASE_REGION", "ap-south-1")
        kwargs['querystring_auth'] = False
        kwargs['default_acl'] = "public-read"
        super().__init__(*args, **kwargs)

@deconstructible
class ProxyStorage(Storage):
    """
    Dynamically routes to S3 storage if credentials are provided,
    or falls back to local FileSystemStorage for local dev.
    """
    def __init__(self, s3_class=None, local_location=None, base_url='/media/'):
        self.s3_class = s3_class
        self.local_location = local_location or os.path.join(settings.BASE_DIR, 'media')
        self.base_url = base_url
        self._storage = None

    @property
    def storage(self):
        if self._storage is None:
            if has_supabase_credentials() and self.s3_class:
                try:
                    self._storage = self.s3_class()
                except Exception:
                    self._storage = FileSystemStorage(location=self.local_location, base_url=self.base_url)
            else:
                self._storage = FileSystemStorage(location=self.local_location, base_url=self.base_url)
        return self._storage

    def _open(self, name, mode='rb'):
        return self.storage._open(name, mode)

    def _save(self, name, content):
        return self.storage._save(name, content)

    def delete(self, name):
        return self.storage.delete(name)

    def exists(self, name):
        return self.storage.exists(name)

    def url(self, name):
        if not name:
            return None
        try:
            return self.storage.url(name)
        except Exception:
            return f"/media/{name}"

    def size(self, name):
        try:
            return self.storage.size(name)
        except Exception:
            return 0

    def get_available_name(self, name, max_length=None):
        return self.storage.get_available_name(name, max_length=max_length)

@deconstructible
class MediaStorage(ProxyStorage):
    def __init__(self):
        super().__init__(S3MediaStorage, os.path.join(settings.BASE_DIR, 'media'), '/media/')

@deconstructible
class AvatarStorage(ProxyStorage):
    def __init__(self):
        super().__init__(S3AvatarStorage, os.path.join(settings.BASE_DIR, 'media', 'avatars'), '/media/avatars/')
