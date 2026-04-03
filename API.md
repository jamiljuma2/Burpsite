# API Documentation for Burpsite

Complete API reference for Burpsite backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}

Response: 201 Created
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  },
  "token": "jwt_token_string"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "string",
  "password": "string"
}

Response: 200 OK
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  },
  "token": "jwt_token_string"
}

Error: 401 Unauthorized
{
  "error": "Invalid credentials"
}
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": "user"
}
```

### Requests (Proxy & Repeater)

#### Get All Requests
```
GET /requests
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 1,
    "method": "GET",
    "url": "https://example.com",
    "headers": "{}",
    "body": null,
    "cookies": "{}",
    "response_status": 200,
    "response_headers": "{}",
    "response_body": "HTML content",
    "response_time": 1234,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Request
```
POST /requests
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "method": "POST",
  "url": "https://api.example.com/endpoint",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  "body": "{\"key\": \"value\"}",
  "cookies": {
    "session": "value"
  }
}

Response: 201 Created
{
  "id": 2,
  "user_id": 1,
  "method": "POST",
  "url": "https://api.example.com/endpoint",
  ...
}
```

#### Get Single Request
```
GET /requests/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  ...
}

Error: 404 Not Found
{
  "error": "Request not found"
}
```

#### Repeat Request
```
POST /requests/:id/repeat
Authorization: Bearer <token>

Response: 200 OK
{
  "status": 200,
  "headers": { ... },
  "body": "response body",
  "responseTime": 1234
}
```

#### Delete Request
```
DELETE /requests/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Request deleted"
}
```

### Scans (Scanner)

#### Start Scan
```
POST /scans/start
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "targetUrl": "https://example.com"
}

Response: 201 Created
{
  "id": 1,
  "user_id": 1,
  "target_url": "https://example.com",
  "status": "pending",
  "vulnerabilities": [],
  "progress": 0,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get All Scans
```
GET /scans
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "target_url": "https://example.com",
    "status": "completed",
    "vulnerabilities": [
      {
        "type": "SQL Injection",
        "severity": "high",
        "description": "...",
        "payload": "..."
      }
    ],
    "progress": 100,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Single Scan
```
GET /scans/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  ...same as above...
}
```

#### Delete Scan
```
DELETE /scans/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Scan deleted"
}
```

### Intruder (Attack Tool)

#### Start Attack
```
POST /intruder/start
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "method": "GET",
  "url": "https://example.com/search",
  "paramName": "q",
  "payloadType": "sql|xss|brute|pathTraversal",
  "position": "query|header|body"
}

Response: 201 Created
{
  "attackId": "attack-1704110400000",
  "message": "Attack started"
}
```

#### Get Attack Results
```
GET /intruder/attack/:attackId
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 1,
    "attack_id": "attack-1704110400000",
    "target_url": "https://example.com/search",
    "payload": "' OR '1'='1",
    "status_code": 200,
    "response_length": 5432,
    "response_time": 234,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Payloads
```
GET /intruder/payloads?type=sql|xss|brute|pathTraversal
Authorization: Bearer <token>

Response: 200 OK
{
  "type": "sql",
  "count": 5,
  "payloads": [
    "' OR '1'='1",
    "' OR 1=1 --",
    ...
  ]
}
```

### Targets (Target Mapping)

#### Start Crawl
```
POST /targets/crawl
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "baseUrl": "https://example.com"
}

Response: 201 Created
{
  "id": 1,
  "user_id": 1,
  "base_url": "https://example.com",
  "endpoints": null,
  "crawled_at": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get All Targets
```
GET /targets
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 1,
    "base_url": "https://example.com",
    "endpoints": {
      "endpoints": [
        "https://example.com/",
        "https://example.com/about",
        "https://example.com/contact"
      ],
      "tree": {...}
    },
    "crawled_at": "2024-01-01T00:05:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Single Target
```
GET /targets/:id
Authorization: Bearer <token>

Response: 200 OK
{...same as above...}
```

#### Delete Target
```
DELETE /targets/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Target deleted"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token" or "No token provided"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Limit: 100 requests per 15 minutes
- Header: `RateLimit-Limit: 100`
- Remaining: `RateLimit-Remaining: 95`
- Reset: `RateLimit-Reset: 1704110400`

## Data Types

### Severity Levels
- `high`: High severity vulnerability
- `medium`: Medium severity vulnerability
- `low`: Low severity vulnerability

### Scan Status
- `pending`: Scan queued, not started
- `running`: Scan in progress
- `completed`: Scan finished
- `failed`: Scan encountered error

### HTTP Methods
- `GET`: Retrieve data
- `POST`: Create data
- `PUT`: Update all fields
- `PATCH`: Update partial fields
- `DELETE`: Remove data
- `HEAD`: Like GET but no body
- `OPTIONS`: Describe communication options

### Payload Types
- `sql`: SQL injection payloads
- `xss`: Cross-site scripting payloads
- `brute`: Brute force/common passwords
- `pathTraversal`: Path traversal payloads

### Payload Positions
- `query`: URL query parameter
- `header`: HTTP header
- `body`: Request body

## Examples

### Complete Workflow Example

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tester",
    "email": "tester@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'

# Response includes token
TOKEN="token_from_response"

# 2. Create Request
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "GET",
    "url": "https://httpbin.org/get",
    "headers": {},
    "body": "",
    "cookies": {}
  }'

# 3. Start Scan
curl -X POST http://localhost:5000/api/scans/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://httpbin.org"
  }'

# 4. Get Scans
curl -X GET http://localhost:5000/api/scans \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- All timestamps are in ISO 8601 format
- JSON payloads (headers, cookies, bodies) are stored as strings
- Responses maintain the structure of requests for consistency
- Some endpoints process asynchronously (scans, crawling, attacks)
- Check the `status` field to monitor long-running operations

---

For more information, see [README.md](../README.md)
