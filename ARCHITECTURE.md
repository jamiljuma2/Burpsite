# Architecture Documentation

Technical architecture and design decisions for Burpsite.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
        ┌────────────────┐    ┌──────────────────┐
        │   Frontend     │    │  Target Websites │
        │   (React)      │    │  Under Testing   │
        └────────┬───────┘    └──────────────────┘
                 │                     │
        API Calls│                     │ HTTP/HTTPS
                 │                     │
        ┌────────▼─────────────────────▼──────────┐
        │      Burpsite Backend (Express)         │
        │                                          │
        │  Authentication │ Request Processing    │
        │  Scanning      │ Crawling              │
        │  Fuzzing       │ Logging               │
        └────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   PostgreSQL       │
        │   Database         │
        └────────────────────┘
```

## Core Components

### Frontend Architecture

#### Technology Stack
- **React 18**: UI framework with hooks
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client with interceptors
- **React Router**: Client-side routing

#### Structure
```
App Component (Routes)
├── Auth Routes (Login/Register)
└── Protected Routes
    ├── Dashboard
    ├── Proxy Module
    ├── Repeater Module
    ├── Scanner Module
    ├── Intruder Module
    └── Target Mapper
```

#### State Management
- **authStore**: User authentication state
- **requestStore**: Request history state
- Local component state: UI state (tabs, modals, etc.)

#### Data Flow
```
User Action → Component → API Call → Store Update → Component Re-render
```

### Backend Architecture

#### Technology Stack
- **Node.js**: Runtime environment
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: Token-based authentication
- **jsdom**: DOM parsing for crawling
- **Axios**: HTTP client for requests

#### Middleware Stack
1. Helmet: Security headers
2. CORS: Cross-origin handling
3. Rate Limiting: Request throttling
4. Authentication: JWT verification
5. Error Handler: Error responses

#### Request Flow
```
HTTP Request
    ↓
Helmet (Security)
    ↓
CORS
    ↓
Rate Limiter
    ↓
Body Parser
    ↓
Route Handler
    ↓
Auth Middleware (if protected)
    ↓
Controller Logic
    ↓
Database Query
    ↓
Response
    ↓
Error Handler
    ↓
HTTP Response
```

## Module Architecture

### 1. Proxy Interceptor

**Responsibility**: Capture and store HTTP requests

**Flow**:
```
Browser Request → (Future: Proxy Server) → Target
                                           │
                                           ▼
                                    Store in Database
                                           │
                                           ▼
                                    Display in UI
```

**Current Implementation**: 
- Stores requests manually created in UI
- Future: Add actual proxy server capability

### 2. Request Repeater

**Responsibility**: Resend HTTP requests with modifications

**Flow**:
```
User Modifies Request
         ↓
Axios Sends Request
         ↓
Capture Response
         ↓
Update Database
         ↓
Display in UI
         ↓
User Compares Responses
```

**Key Features**:
- Multiple methods (GET, POST, PUT, DELETE, PATCH)
- Custom headers and body
- Response timing
- Response comparison

### 3. Scanner

**Responsibility**: Detect common vulnerabilities

**Architecture**:
```
Target URL
    ↓
Multiple Parallel Tests
├── SQL Injection Test
├── XSS Test
├── CSRF Test
└── Open Redirect Test
    ↓
Collect Results
    ↓
Assign Severity
    ↓
Store in Database
    ↓
Display Results
```

**Detection Methods**:
- Pattern matching in responses
- Error-based detection (SQL errors)
- Reflection testing (XSS)
- Form analysis (CSRF)
- Redirect testing

### 4. Intruder

**Responsibility**: Perform fuzzing and brute-force attacks

**Architecture**:
```
Configuration
├── Target URL
├── Parameter Name
├── Payload Type
└── Position (Query/Header/Body)
    ↓
Generate Payloads
    ↓
Sequential Requests
├── For Each Payload
├── Measure Response
├── Record Results
└── Log Timing
    ↓
Store Attack Results
    ↓
Analyze Patterns
    ↓
Display Results Table
```

**Payload Types**:
1. SQL Injection: SQL syntax payloads
2. XSS: JavaScript payloads
3. Brute Force: Common passwords
4. Path Traversal: Directory traversal payloads

### 5. Target Mapper

**Responsibility**: Discover website endpoints

**Architecture**:
```
Base URL
    ↓
Queue: [Base URL]
Visited: {}
    ↓
While Queue Not Empty
├── Pop URL
├── Check if in scope
├── Check if visited
├── Fetch page
├── Parse HTML
├── Extract links
├── Extract forms
├── Add to queue
└── Add to endpoints
    ↓
Build Tree Structure
    ↓
Store in Database
    ↓
Display
```

**Scope Control**:
- Only crawls same domain
- Prevents external site crawling
- Depth limiting (max 3 levels)

## Database Schema

### Users Table
```sql
id (PK) | username (UNIQUE) | email (UNIQUE) | password_hash | role | timestamps
```

### Requests Table
```sql
id | user_id (FK) | method | url | headers | body | cookies | 
response_status | response_headers | response_body | response_time | timestamps
```

### Scans Table
```sql
id | user_id (FK) | target_url | status | vulnerabilities (JSONB) | 
progress | timestamps
```

### Attack Results Table
```sql
id | user_id (FK) | attack_id | target_url | payload | 
status_code | response_length | response_time | timestamps
```

### Targets Table
```sql
id | user_id (FK) | base_url | endpoints (JSONB) | 
crawled_at | timestamps
```

## Security Architecture

### Authentication
- **Method**: JWT (JSON Web Tokens)
- **Storage**: LocalStorage (frontend)
- **Expiration**: 30 days
- **Refresh**: Manual re-login required

### Authorization
- **Scheme**: Role-based (user/admin)
- **Enforcement**: Middleware on protected routes
- **Data Isolation**: Users only see own data

### Network Security
- **HTTPS**: Required in production
- **CORS**: Whitelist in env
- **Rate Limiting**: 100 req/15 min per IP
- **Helmet**: Security headers (CSP, HSTS, etc.)

### Input Validation
- **Frontend**: Basic validation
- **Backend**: Strict validation (Joi will be added)
- **Database**: Prepared statements (pg library handles this)

### Password Security
- **Hashing**: bcryptjs (10 salt rounds)
- **Strength**: Minimum requirements enforced
- **Storage**: Never in logs or responses

## Deployment Architecture

### Development
```
Local Machine
├── Frontend Dev Server (port 3000)
├── Backend Dev Server (port 5000)
└── PostgreSQL (port 5432)
```

### Production (Docker)
```
Docker Host
├── Container: Frontend (nginx:3000)
├── Container: Backend (node:5000)
├── Container: PostgreSQL (5432)
└── Volumes: Database persistence
```

### Production (Recommended)
```
CDN → Load Balancer
      ├── Frontend Servers (nginx)
      ├── Backend Servers (node with PM2)
      └── Database (PostgreSQL with replication)
```

## Error Handling

### Frontend
```
API Request
    ↓
Success ──→ Update State → Render
    │
    └─→ Error ──→ Check Status
            ├─ 401: Redirect to login
            ├─ 4xx: Show error message
            └─ 5xx: Show generic error
```

### Backend
```
Request Handler
    ↓
Try {...}
Catch Error
    ├─ Validation Error → 400
    ├─ Auth Error → 401
    ├─ Permission Error → 403
    ├─ Not Found → 404
    ├─ Conflict → 409
    └─ Server Error → 500
```

## Performance Considerations

### Frontend
- Component code splitting (React.lazy)
- Memoization for heavy components
- Efficient rendering (avoid re-renders)
- Virtual scrolling for large lists

### Backend
- Connection pooling (pg pool)
- Async operations (non-blocking)
- Pagination for list endpoints
- Caching (future enhancement)

### Database
- Indexes on frequently queried columns
- JSONB for flexible data storage
- Cascading deletes for data cleanup
- Query optimization

## Monitoring & Logging

### Frontend
- Console errors logged (future: centralized logging)
- Network errors displayed to users
- Performance metrics (future)

### Backend
- Console logging for development
- Error stack traces in logs
- Request/response logging (future)
- Performance metrics (future)

### Database
- Query logging (development)
- Connection monitoring
- Backup verification

## Scalability Roadmap

1. **Phase 1**: Current single-server deployment
2. **Phase 2**: 
   - Database read replicas
   - Backend load balancing
   - Static asset CDN
3. **Phase 3**:
   - Microservices (scanner, intruder separate)
   - Message queue (background jobs)
   - Distributed caching (Redis)
4. **Phase 4**:
   - Kubernetes orchestration
   - Auto-scaling
   - Advanced monitoring

## Testing Architecture

### Unit Tests
- Backend: Jest for controllers/utils
- Frontend: React Testing Library

### Integration Tests
- API endpoint testing
- Database integration
- End-to-end workflows

### Load Tests
- Apache JMeter or similar
- Identify bottlenecks
- Capacity planning

---

For implementation details, see respective module documentation.
