import graphene
from graphene_django import DjangoObjectType
from .models import Review
from graphql_auth.bases import Output
from graphql_auth.constants import Messages
from django.core.exceptions import ObjectDoesNotExist
from users.models import CustomUser as User

class AuthorType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "avatar")

class ReviewType(DjangoObjectType):
    class Meta:
        model = Review
        fields = '__all__'

    user = graphene.Field(AuthorType)

def PermissionCheck(user, check_superuser=False):
    if not user.is_authenticated:
        raise Exception("Unauthenticated")
    if not user.status.verified:
        raise Exception("Please verify your account")
    if not user.is_active:
        raise Exception("Your account have been deactivated")
    if check_superuser and not user.is_superuser:
        raise Exception("You don't have enough permissions.")

class ReviewQuery(graphene.ObjectType):
    reviews = graphene.List(ReviewType)
    reviews_by_tags = graphene.Field(graphene.List(ReviewType), tags=graphene.List(graphene.String))
    review = graphene.Field(ReviewType, id=graphene.String())
    reviews_by_user = graphene.Field(graphene.List(ReviewType), id=graphene.String(required=True), tags=graphene.List(graphene.String))

    def resolve_reviews(root, info, **kwargs):
        PermissionCheck(info.context.user)
        return Review.objects.all()

    def resolve_reviews_by_tags(root, info, tags=[]):
        PermissionCheck(info.context.user)
        if tags:
            return Review.objects.filter(tags__contained_by=tags)
        return Review.objects.all()

    def resolve_review(root, info, id):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)
            return r
        except ObjectDoesNotExist:
            return None

    def resolve_reviews_by_user(root, info, id, tags=[]):
        PermissionCheck(info.context.user)
        if tags:
            return Review.objects.filter(user__id=id, tags__contained_by=tags)
        return Review.objects.filter(user__id=id)

# Mutations
class CreateReview(graphene.Mutation):
    class Arguments:
        review = graphene.String(required=True)
        tags = graphene.List(graphene.String)
        tldr = graphene.String()
    
    review = graphene.Field(ReviewType)

    @classmethod
    def mutate(cls, root, info, review, tags, tldr):
        PermissionCheck(info.context.user)
        r = Review(review=review, tags=tags, tldr=tldr, user=info.context.user)
        r.save()
        return CreateReview(review=r)


class ReviewMutation(graphene.ObjectType):
    create_review = CreateReview.Field()
