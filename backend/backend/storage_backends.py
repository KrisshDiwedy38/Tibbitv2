import os
from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    bucket_name = os.environ.get("SUPABASE_STORAGE_BUCKET_NAME", "tibbit-media")
    location = ''
    default_acl = 'public-read'

class AvatarStorage(S3Boto3Storage):
    bucket_name = os.environ.get("SUPABASE_AVATAR_BUCKET_NAME", "user-avatars")
    location = ''
    default_acl = 'public-read'
