#!/bin/sh

# Wait for DynamoDB to be ready
sleep 5

# Create table if it doesn't exist
python core/create_table.py

# Start Django server
python manage.py runserver 0.0.0.0:8003