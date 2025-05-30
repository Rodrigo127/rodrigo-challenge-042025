# services/dynamodb_service.py
import boto3
from botocore.config import Config
import uuid
from datetime import datetime
import os

class DynamoDBService:
    def __init__(self, dynamodb = None):
        if dynamodb:
            self.dynamodb = dynamodb
        else:
            self.dynamodb = boto3.resource(
                'dynamodb',
                endpoint_url=os.getenv('DYNAMODB_ENDPOINT_URL', 'http://localhost:8000'),
                region_name='us-west-2',
                aws_access_key_id='dummy',
                aws_secret_access_key='dummy'
            )

        self.table = self.dynamodb.Table('columns')
        # print the id of the variable set by the python interpreter

    def get_next_sk(self):
        try:
            response = self.table.update_item(
                Key={
                    'id': 'COUNTER',
                },
                UpdateExpression='SET nextIndex = if_not_exists(nextIndex, :start) + :inc',
                ExpressionAttributeValues={
                    ':start': 0,
                    ':inc': 1
                },
                ReturnValues='UPDATED_NEW'
            )
            return int(response['Attributes']['nextIndex'])
        except Exception as e:
            # If counter doesn't exist, create it
            try:
                self.table.put_item(
                    Item={
                        'id': 'COUNTER',
                        'order': 999,
                        'nextIndex': 1
                    }
                )
                return 1
            except Exception as e:
                print('error', e)
                return 1

    def create_column(self, title):
        column_id = str(uuid.uuid4())
        sk = self.get_next_sk()

        self.table.put_item(
            Item={
                'id': f'{column_id}',
                'colIndex': sk,
                'title': title,
                'cards': [],
                'createdAt': datetime.now().isoformat(),
                'updatedAt': datetime.now().isoformat()
            }
        )
        return self.get_column(column_id)

    def get_column(self, column_id):
        response = self.table.get_item(
            Key={
                'id': f'{column_id}',
            }
        )
        return response.get('Item')

    def get_columns(self):
        response = self.table.scan(
            FilterExpression='id <> :counter_id',
            ExpressionAttributeValues={
                ':counter_id': 'COUNTER'
            }
        )
        items = response.get('Items', [])
        items.sort(key=lambda x: x['colIndex'])
        return items


    def update_column_cards(self, column_id, cards, colIndex, title):
        self.table.update_item(
            Key={
                'id': f'{column_id}',
            },
            UpdateExpression='SET cards = :cards, updatedAt = :now, title = :title, colIndex = :colIndex',
            ExpressionAttributeValues={
                ':cards': cards,
                ':now': datetime.now().isoformat(),
                ':title': title,
                ':colIndex': colIndex
            }
        )
        return self.get_column(column_id)
    
    def remove_column(self, column_id):
        self.table.delete_item(
            Key={
                'id': f'{column_id}',
            }
        )
        return True