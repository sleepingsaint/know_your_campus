import graphene
from graphql_auth.schema import UserQuery, MeQuery
from reviews.schema import ReviewQuery, ReviewMutation
from users.schema import AuthMutation
from comments.schema import CommentQuery, CommentMutation

class Query(UserQuery, MeQuery, ReviewQuery, CommentQuery, graphene.ObjectType):
    pass

class Mutation(AuthMutation, ReviewMutation, CommentMutation, graphene.ObjectType):
   pass

schema = graphene.Schema(query=Query, mutation=Mutation)
