#!/bin/bash

# Todo API Test Script
# Run this after starting the server to verify all endpoints

BASE_URL="http://localhost:3000/api/v1"
TODO_ID=""

echo "======================================"
echo "Testing Todo REST API"
echo "======================================"
echo ""

# Health check
echo "1. Health Check"
curl -s http://localhost:3000/health | jq .
echo -e "\n"

# Create a todo
echo "2. Creating a new todo..."
RESPONSE=$(curl -s -X POST $BASE_URL/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API testing",
    "description": "Test all CRUD endpoints",
    "priority": "high",
    "dueDate": "2026-02-10T00:00:00.000Z"
  }')

echo $RESPONSE | jq .
TODO_ID=$(echo $RESPONSE | jq -r '.data.id')
echo "Created todo with ID: $TODO_ID"
echo -e "\n"

# Get all todos
echo "3. Getting all todos..."
curl -s $BASE_URL/todos | jq .
echo -e "\n"

# Get single todo
echo "4. Getting todo by ID..."
curl -s $BASE_URL/todos/$TODO_ID | jq .
echo -e "\n"

# Update todo
echo "5. Updating todo (mark as completed)..."
curl -s -X PATCH $BASE_URL/todos/$TODO_ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true, "priority": "medium"}' | jq .
echo -e "\n"

# Filter todos
echo "6. Filtering completed todos..."
curl -s "$BASE_URL/todos?completed=true" | jq .
echo -e "\n"

# Create another todo
echo "7. Creating another todo..."
curl -s -X POST $BASE_URL/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write documentation",
    "priority": "low"
  }' | jq .
echo -e "\n"

# Get with pagination
echo "8. Testing pagination (limit=1)..."
curl -s "$BASE_URL/todos?limit=1" | jq .
echo -e "\n"

# Delete todo
echo "9. Deleting todo..."
curl -s -X DELETE $BASE_URL/todos/$TODO_ID | jq .
echo -e "\n"

# Verify deletion
echo "10. Verifying deletion (should return 404)..."
curl -s $BASE_URL/todos/$TODO_ID | jq .
echo -e "\n"

# Test validation error
echo "11. Testing validation (should fail - empty title)..."
curl -s -X POST $BASE_URL/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "", "priority": "invalid"}' | jq .
echo -e "\n"

echo "======================================"
echo "API Testing Complete!"
echo "======================================"
