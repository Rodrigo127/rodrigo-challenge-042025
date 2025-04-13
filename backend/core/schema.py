import graphene
from graphene_django.types import DjangoObjectType
from columns.models import Column, Card

class ColumnType(DjangoObjectType):
    class Meta:
        model = Column
        fields = ("id", "title", "cards")

class CardType(DjangoObjectType):
    class Meta:
        model = Card
        fields = ("id", "title", "description")

class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")

    columns = graphene.List(ColumnType)

    def resolve_columns(self, info):
        return Column.objects.all()
    
class CreateColumnMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String()

    column = graphene.Field(ColumnType)
    
    def mutate(self, info, title):
        column = Column(title=title)
        column.save()
        return CreateColumnMutation(column=column)

class Mutation(graphene.ObjectType):
    create_column = CreateColumnMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
