# schema.py
import graphene
from .services.dynamodb_service import DynamoDBService

class ColumnType(graphene.ObjectType):
    id = graphene.String()
    PK = graphene.String()
    SK = graphene.String()
    title = graphene.String()
    cards = graphene.JSONString()

class Query(graphene.ObjectType):
    columns = graphene.List(ColumnType)

    def resolve_columns(self, info):
        dynamodb = DynamoDBService()
        return dynamodb.get_columns()

class CreateColumnMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String()

    column = graphene.Field(ColumnType)
    
    def mutate(self, info, title):
        dynamodb = DynamoDBService()
        column = dynamodb.create_column(title)
        return CreateColumnMutation(column=column)

class UpdateColumnCardsMutation(graphene.Mutation):
    class Arguments:
        PK = graphene.String()
        SK = graphene.String()
        cards = graphene.JSONString()

    column = graphene.Field(ColumnType)
    
    def mutate(self, info, PK, SK, cards):
        dynamodb = DynamoDBService()
        column = dynamodb.update_column_cards(PK, cards, SK)
        return UpdateColumnCardsMutation(column=column)

class Mutation(graphene.ObjectType):
    create_column = CreateColumnMutation.Field()
    update_column_cards = UpdateColumnCardsMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)