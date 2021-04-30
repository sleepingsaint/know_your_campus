from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
def default_info():
    return dict

class CustomUser(AbstractUser):
    email = models.EmailField(blank=False, max_length=254, verbose_name="email address")
    avatar = models.CharField(max_length=20)
    info = models.JSONField(default=default_info())

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"