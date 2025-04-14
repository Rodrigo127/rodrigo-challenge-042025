from django.db import models

class Column(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    cards = models.JSONField(default=list)

    def __str__(self):
        return self.title

