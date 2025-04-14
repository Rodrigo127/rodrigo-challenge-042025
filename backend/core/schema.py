# schema.py
import graphene
from .services.dynamodb_service import DynamoDBService

class ColumnType(graphene.ObjectType):
    id = graphene.String()
    colIndex = graphene.Int()
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
        id = graphene.String()
        colIndex = graphene.Int()
        cards = graphene.JSONString()
        title = graphene.String()

    column = graphene.Field(ColumnType)
    
    def mutate(self, info, id, colIndex, cards, title):
        dynamodb = DynamoDBService()
        column = dynamodb.update_column_cards(id, cards, colIndex, title)
        return UpdateColumnCardsMutation(column=column)

class RemoveColumnMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, id):
        dynamodb = DynamoDBService()
        success = dynamodb.remove_column(id)
        return RemoveColumnMutation(success=success)

class Mutation(graphene.ObjectType):
    create_column = CreateColumnMutation.Field()
    update_column_cards = UpdateColumnCardsMutation.Field()
    remove_column = RemoveColumnMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)