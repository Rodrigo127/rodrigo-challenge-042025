from django.db import models


class Card(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title

class Column(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    cards = models.ManyToManyField(Card, blank=True)

    def __str__(self):
        return self.title

