from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` or `seller` or `buyer` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        # Check standard ownership attributes
        if hasattr(obj, 'seller'):
            return obj.seller == request.user
        if hasattr(obj, 'buyer'):
            return obj.buyer == request.user or (hasattr(obj, 'seller') and obj.seller == request.user)
        if hasattr(obj, 'author'):
            return obj.author == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'founder'):
            return obj.founder == request.user
        
        return False
