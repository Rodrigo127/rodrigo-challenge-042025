# services/dynamodb_service.py
import boto3
from botocore.config import Config
import uuid
from datetime import datetime

class DynamoDBService:
    def __init__(self):
        self.dynamodb = boto3.resource(
            'dynamodb',
            endpoint_url='http://localhost:8000',
            region_name='us-west-2',
            aws_access_key_id='dummy',
            aws_secret_access_key='dummy'
        )
        self.table = self.dynamodb.Table('columns')

    def get_next_sk(self):
        try:
            response = self.table.update_item(
                Key={
                    'PK': 'COUNTER',
                    'SK': 'COUNTER'
                },
                UpdateExpression='SET nextIndex = if_not_exists(nextIndex, :start) + :inc',
                ExpressionAttributeValues={
                    ':start': 0,
                    ':inc': 1
                },
                ReturnValues='UPDATED_NEW'
            )
            return response['Attributes']['nextIndex']
        except Exception as e:
            # If counter doesn't exist, create it
            self.table.put_item(
                Item={
                    'PK': 'COUNTER',
                    'SK': 'COUNTER',
                    'nextIndex': 1
                }
            )
            print('error', e)
            return 1

    def create_column(self, title):
        column_id = str(uuid.uuid4())
        sk = self.get_next_sk()
        self.table.put_item(
            Item={
                'PK': f'{column_id}',
                'SK': f'{sk}',
                'title': title,
                'cards': [],
                'createdAt': datetime.now().isoformat(),
                'updatedAt': datetime.now().isoformat()
            }
        )
        return self.get_column(column_id, sk)

    def get_column(self, column_id, sk):
        response = self.table.get_item(
            Key={
                'PK': f'{column_id}',
                'SK': f'{sk}'
            }
        )
        return response.get('Item')

    def get_columns(self):
        response = self.table.scan(
            FilterExpression='PK <> :counter_pk',
            ExpressionAttributeValues={
                ':counter_pk': 'COUNTER'
            }
        )
        return response.get('Items', [])

    def update_column_cards(self, column_id, cards, sk):
        self.table.update_item(
            Key={
                'PK': f'{column_id}',
                'SK': f'{sk}'
            },
            UpdateExpression='SET cards = :cards, updatedAt = :now',
            ExpressionAttributeValues={
                ':cards': cards,
                ':now': datetime.now().isoformat()
            }
        )
        return self.get_column(column_id, sk)