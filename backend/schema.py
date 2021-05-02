import graphene
from graphql_auth.schema import UserQuery, MeQuery
from reviews.schema import ReviewQuery, ReviewMutation
from users.schema import AuthMutation

class Query(UserQuery, MeQuery, ReviewQuery, graphene.ObjectType):
    pass

class Mutation(AuthMutation, ReviewMutation, graphene.ObjectType):
   pass

schema = graphene.Schema(query=Query, mutation=Mutation)
