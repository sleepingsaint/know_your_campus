from django.db import models
from users.models import CustomUser as User
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericRelation
from comments.models import Comment

# Create your models here.
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tldr = models.CharField(max_length=100)
    review = models.TextField()
    tags = ArrayField(models.CharField(max_length=20))

    comments = GenericRelation(Comment, related_query_name='review')
    upvotes = ArrayField(models.IntegerField(), default=list)
    downvotes = ArrayField(models.IntegerField(), default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
