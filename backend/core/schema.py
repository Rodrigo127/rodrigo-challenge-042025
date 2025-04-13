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

schema = graphene.Schema(query=Query)
