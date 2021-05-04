import graphene
from graphene_django import DjangoObjectType
from .models import Review
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
        interface = (graphene.relay.node, )

    user = graphene.Field(AuthorType)

class ReviewConnection(graphene.relay.Connection):
    class Meta:
        node = ReviewType

def PermissionCheck(user):
    if not user.is_authenticated:
        raise Exception("Unauthenticated")
    if not user.status.verified:
        raise Exception("Please verify your account")
    if not user.is_active:
        raise Exception("Your account have been deactivated")

class ReviewQuery(graphene.ObjectType):
    reviews = graphene.relay.ConnectionField(ReviewConnection)
    reviews_by_tags = graphene.relay.ConnectionField(ReviewConnection, tags=graphene.List(graphene.String))
    reviews_by_user = graphene.relay.ConnectionField(ReviewConnection, id=graphene.ID(required=True), tags=graphene.List(graphene.String))
    review = graphene.Field(ReviewType, id=graphene.String())

    def resolve_reviews(root, info):
        PermissionCheck(info.context.user)
        return Review.objects.all()

    def resolve_reviews_by_tags(root, info, tags = [], **kwargs):
        PermissionCheck(info.context.user)
        return Review.objects.filter(tags__contains=tags)

    def resolve_review(root, info, id):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)
            return r
        except ObjectDoesNotExist:
            return None

    def resolve_reviews_by_user(root, info, id, tags=[]):
        PermissionCheck(info.context.user)
        return Review.objects.filter(user__id=id, tags__contains=tags)

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

class UpdateReview(graphene.Mutation):
    class Arguments:
        review = graphene.String()
        tags = graphene.List(graphene.String)
        tldr = graphene.String()
        id = graphene.ID(required=True)

    review = graphene.Field(ReviewType)

    @classmethod
    def mutate(cls, root, info, id, review = None, tags = None, tldr = None):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)

            # only the owner can perform this action
            if r.user.id != info.context.user.id:
                raise Exception("You don't have permissions to perform this action.")

            if review is not None:
                r.review = review
            if tags is not None:
                r.tags = tags
            if tldr is not None:
                r.tldr = tldr
            r.save()
            return cls(review=r)

        except ObjectDoesNotExist:
            return UpdateReview(review=None)

class UpvoteReview(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    review = graphene.Field(ReviewType)

    @classmethod
    def mutate(cls, root, info, id):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)
            user_id = info.context.user.id
            if user_id in r.downvotes:
                r.downvotes.remove(user_id)
            if user_id not in r.upvotes:
                r.upvotes.append(user_id)
            r.save()
            return cls(review = r)
        except ObjectDoesNotExist:
            return cls(review=None)

class DownvoteReview(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    review = graphene.Field(ReviewType)

    @classmethod
    def mutate(cls, root, info, id):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)
            user_id = info.context.user.id
            if user_id in r.upvotes:
                r.upvotes.remove(user_id)
            if user_id not in r.downvotes:
                r.downvotes.append(user_id)
            r.save()
            return cls(review = r)
        except ObjectDoesNotExist:
            return cls(review=None)

class RemoveVote(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    review = graphene.Field(ReviewType)

    @classmethod
    def mutate(cls, root, info, id):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)
            user_id = info.context.user.id
            if user_id in r.upvotes:
                r.upvotes.remove(user_id)
            if user_id in r.downvotes:
                r.downvotes.remove(user_id)
            r.save()
            return cls(review = r)
        except ObjectDoesNotExist:
            return cls(review=None)

class DeleteReview(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, id):
        PermissionCheck(info.context.user)
        try:
            r = Review.objects.get(pk=id)

            # only the owner can perform this action
            if r.user.id != info.context.user.id and not info.context.user.is_superuser:
                raise Exception("You don't have permissions to perform this action.")
            r.delete()
            return cls(success=True)
        except ObjectDoesNotExist:
            return cls(success=False)

class ReviewMutation(graphene.ObjectType):
    create_review = CreateReview.Field()
    update_review = UpdateReview.Field()
    upvote_review = UpvoteReview.Field()
    downvote_review = DownvoteReview.Field()
    remove_vote = RemoveVote.Field()
    delete_review = DeleteReview.Field()