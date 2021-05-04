import graphene
from graphene_django import DjangoObjectType
from .models import Comment
from reviews.models import Review
from users.models import CustomUser as User
from reviews.schema import AuthorType, PermissionCheck
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.contenttypes.models import ContentType

REVIEW_CONTENT_TYPE = ContentType.objects.get(app_label='reviews', model='review')

class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = '__all__'
    user = graphene.Field(AuthorType)

class CommentConnection(graphene.relay.Connection):
    class Meta:
        node = CommentType

class CommentQuery(graphene.ObjectType):
    review_comments = graphene.relay.ConnectionField(CommentConnection, review_id=graphene.ID(required=True))
    comments_by_user = graphene.relay.ConnectionField(CommentConnection, user_id=graphene.ID(required=True))

    def resolve_review_comments(root, info, review_id, **kwargs):
        PermissionCheck(info.context.user)
        return Comment.objects.filter(object_id=review_id)

    def resolve_comments_by_user(root, info, user_id, **kwargs):
        PermissionCheck(info.context.user)
        return Comment.objects.filter(user__id=user_id)

# Comments Mutations
class CreateComment(graphene.Mutation):
    class Arguments:
        review_id = graphene.ID(required=True)
        comment = graphene.String()
    comment = graphene.Field(CommentType)

    @classmethod
    def mutate(cls, root, info, review_id, comment):
        PermissionCheck(info.context.user)
        try:
            c = Comment(comment=comment)
            c.user = info.context.user
            c.content_type = REVIEW_CONTENT_TYPE
            c.object_id = id
            c.save()
            return cls(comment=c)
        except ObjectDoesNotExist:
            return cls(comment=None)

class UpdateComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        comment = graphene.String()
    
    comment = graphene.Field(CommentType)

    @classmethod
    def mutate(cls, root, info, id, comment = None):
        PermissionCheck(info.context.user)
        try:
            c = Comment.objects.get(pk=id)
            if c.user.id != info.context.user.id:
                raise Exception("You don't have permission to do this action.")
            if comment is not None:
                c.comment = comment
            c.save()
            return cls(comment=c)
        except ObjectDoesNotExist:
            return cls(comment=None)

class DeleteComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, id, comment = None):
        PermissionCheck(info.context.user)
        try:
            c = Comment.objects.get(pk=id)
            if c.user.id != info.context.user.id and not info.context.user.is_superuser:
                raise Exception("You don't have permission to do this action.")
            c.delete()
            return cls(success=True)
        except ObjectDoesNotExist:
            return cls(success=False)

class CommentMutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()