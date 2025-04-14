import graphene
from graphene_django.types import DjangoObjectType
from columns.models import Column

class ColumnType(DjangoObjectType):
    class Meta:
        model = Column
        fields = ("id", "title", "cards")

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


class UpdateColumnCardsMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
        cards = graphene.JSONString()

    column = graphene.Field(ColumnType)
    
    def mutate(self, info, id, cards):
        column = Column.objects.get(id=id)
        column.cards = cards
        column.save()
        return UpdateColumnCardsMutation(column=column)

class Mutation(graphene.ObjectType):
    create_column = CreateColumnMutation.Field()
    update_column_cards = UpdateColumnCardsMutation.Field()
schema = graphene.Schema(query=Query, mutation=Mutation)
