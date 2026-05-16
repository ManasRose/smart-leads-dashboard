# Smart Leads API Documentation

**Base URL:** `http://localhost:5000/api`  
**Format:** JSON  
**Authentication:** Bearer JWT in `Authorization` header

---

## Authentication

### POST `/auth/register`

Register a new user.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "sales"
}
```

| Field    | Type   | Required | Notes                      |
|----------|--------|----------|----------------------------|
| name     | string | Yes      | 2–100 characters           |
| email    | string | Yes      | Valid email                |
| password | string | Yes      | Min 6 characters           |
| role     | string | No       | `"admin"` or `"sales"` (default: `"sales"`) |

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "64f...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
}
```

**Errors:**
- `409` — Email already registered
- `422` — Validation errors

---

### POST `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "64f...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
}
```

**Errors:**
- `401` — Invalid credentials
- `422` — Validation errors

---

### GET `/auth/me`

Get currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "success": true,
  "message": "User fetched successfully.",
  "data": {
    "id": "64f...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "sales",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## Leads

> All lead endpoints require `Authorization: Bearer <token>`.

---

### GET `/leads`

Get all leads with optional filtering, search, sorting, and pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Param  | Type   | Default  | Notes                                  |
|--------|--------|----------|----------------------------------------|
| page   | number | 1        | Page number                            |
| limit  | number | 10       | Records per page (max 50)              |
| status | string | —        | `New`, `Contacted`, `Qualified`, `Lost`|
| source | string | —        | `Website`, `Instagram`, `Referral`     |
| search | string | —        | Matches name or email (case-insensitive)|
| sort   | string | `latest` | `latest` or `oldest`                   |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1`

**Response `200`:**
```json
{
  "success": true,
  "message": "Leads fetched successfully.",
  "data": [
    {
      "_id": "64f...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Interested in premium plan",
      "createdBy": {
        "id": "64e...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "sales"
      },
      "createdAt": "2024-01-10T08:30:00.000Z",
      "updatedAt": "2024-01-12T11:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### GET `/leads/:id`

Get a single lead by ID.

**Response `200`:** Same lead object as above.

**Errors:**
- `404` — Lead not found
- `403` — Access denied (Sales trying to view another user's lead)

---

### POST `/leads`

Create a new lead.

**Request Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "New",
  "source": "Referral",
  "notes": "Referred by existing client"
}
```

| Field  | Type   | Required | Notes                        |
|--------|--------|----------|------------------------------|
| name   | string | Yes      | 2–100 characters             |
| email  | string | Yes      | Valid email                  |
| status | string | No       | Default: `New`               |
| source | string | Yes      | `Website`, `Instagram`, `Referral` |
| notes  | string | No       | Max 500 characters           |

**Response `201`:** Created lead object.

---

### PUT `/leads/:id`

Update a lead. All fields are optional.

**Request Body:**
```json
{
  "status": "Contacted",
  "notes": "Follow-up call scheduled"
}
```

**Response `200`:** Updated lead object.

**Errors:**
- `403` — Access denied (Sales updating another user's lead)
- `404` — Lead not found
- `422` — Validation errors

---

### DELETE `/leads/:id`

Delete a lead.

**Response `200`:**
```json
{
  "success": true,
  "message": "Lead deleted successfully."
}
```

**Errors:**
- `403` — Access denied
- `404` — Lead not found

---

### GET `/leads/export`

Export leads as a CSV file. Supports same filters as `GET /leads` (except page/limit).

**Query Parameters:** `status`, `source`, `search`

**Response:** CSV file download  
**Content-Type:** `text/csv`  
**Content-Disposition:** `attachment; filename=leads.csv`

**CSV Columns:** Name, Email, Status, Source, Notes, Created By, Created At

---

## Error Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

## HTTP Status Codes

| Code | Meaning                |
|------|------------------------|
| 200  | Success                |
| 201  | Created                |
| 401  | Unauthorized           |
| 403  | Forbidden              |
| 404  | Not Found              |
| 409  | Conflict               |
| 422  | Validation Error       |
| 429  | Too Many Requests      |
| 500  | Internal Server Error  |
