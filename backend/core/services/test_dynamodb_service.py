import pytest
import boto3
from moto import mock_dynamodb
from datetime import datetime
from dynamodb_service import DynamoDBService
import os

@pytest.fixture
def dynamodb_service():
    with mock_dynamodb():
        # Create the mock DynamoDB table
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

        
        # Create the table with the required schema
        table = dynamodb.create_table(
            TableName='columns',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        # Wait for the table to be created
        table.meta.client.get_waiter('table_exists').wait(TableName='columns')
        
        service = DynamoDBService(dynamodb)
        yield service

def test_create_column(dynamodb_service):
    # Test creating a new column
    title = "Test Column"
    result = dynamodb_service.create_column(title)
    
    assert result is not None
    assert result['title'] == title
    assert 'id' in result
    assert 'colIndex' in result
    assert 'cards' in result
    assert isinstance(result['cards'], list)
    assert len(result['cards']) == 0
    assert 'createdAt' in result
    assert 'updatedAt' in result

def test_get_column(dynamodb_service):
    # First create a column
    title = "Test Column"
    created_column = dynamodb_service.create_column(title)
    column_id = created_column['id']
    
    # Test getting the column
    result = dynamodb_service.get_column(column_id)
    
    assert result is not None
    assert result['id'] == column_id
    assert result['title'] == title

def test_get_columns(dynamodb_service):
    # Create multiple columns
    titles = ["Column 1", "Column 2", "Column 3"]
    for title in titles:
        dynamodb_service.create_column(title)
    
    # Test getting all columns
    results = dynamodb_service.get_columns()
    
    assert len(results) == len(titles)
    assert all('colIndex' in column for column in results)
    # Verify columns are sorted by colIndex
    assert all(results[i]['colIndex'] < results[i+1]['colIndex'] for i in range(len(results)-1))

def test_update_column_cards(dynamodb_service):
    # First create a column
    title = "Test Column"
    created_column = dynamodb_service.create_column(title)
    column_id = created_column['id']
    
    # Test updating the column
    new_cards = [{"id": "1", "content": "Test Card"}]
    new_title = "Updated Column"
    new_index = 2
    
    result = dynamodb_service.update_column_cards(column_id, new_cards, new_index, new_title)
    
    assert result is not None
    assert result['id'] == column_id
    assert result['title'] == new_title
    assert result['colIndex'] == new_index
    assert result['cards'] == new_cards

def test_remove_column(dynamodb_service):
    # First create a column
    title = "Test Column"
    created_column = dynamodb_service.create_column(title)
    column_id = created_column['id']
    
    # Test removing the column
    result = dynamodb_service.remove_column(column_id)
    assert result is True
    
    # Verify the column is removed
    result = dynamodb_service.get_column(column_id)
    assert result is None

def test_get_next_sk(dynamodb_service):
    # Test getting sequential numbers
    first_sk = dynamodb_service.get_next_sk()
    second_sk = dynamodb_service.get_next_sk()
    third_sk = dynamodb_service.get_next_sk()
    
    assert first_sk == 1
    assert second_sk == 2
    assert third_sk == 3 