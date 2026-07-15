from django.db import models
from django.conf import settings

class StartupProject(models.Model):
    STATUS_CHOICES = [
        ('idea', 'Idea Phase'),
        ('building', 'Building'),
        ('launched', 'Launched'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    tagline = models.CharField(max_length=255)
    description = models.TextField()
    founder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='startup_projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='idea')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_projects'
        verbose_name = 'Startup Project'
        verbose_name_plural = 'Startup Projects'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class ProjectRole(models.Model):
    project = models.ForeignKey(StartupProject, on_delete=models.CASCADE, related_name='roles')
    title = models.CharField(max_length=150)
    description = models.TextField()
    is_filled = models.BooleanField(default=False)

    class Meta:
        db_table = 'project_roles'
        verbose_name = 'Project Role'
        verbose_name_plural = 'Project Roles'

    def __str__(self):
        return f"{self.title} at {self.project.name}"
