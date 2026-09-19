# Student Records API

A complete REST API for managing student records.

## Tech Stack
- Node.js (v24.14.1)
- Express.js
- TypeScript
- SQLite (via better-sqlite3)
- Jest + supertest (for testing)

## Prerequisites
- Node.js 18+
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup
Create a `.env` file from the example:
```bash
cp .env.example .env
```

## Running the Application
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm run build && npm start`

## Database
Uses a local SQLite database (`database/students.db`). The database directory and file are automatically created upon startup if they do not exist.

## API Endpoints

| Method | Path | Description | Status Codes |
|--------|------|-------------|--------------|
| GET | `/health` | Health check | 200 |
| POST | `/api/students` | Create student | 201, 400, 409 |
| GET | `/api/students` | List all students | 200 |
| GET | `/api/students/:id` | Get student by ID | 200, 404 |
| PUT | `/api/students/:id` | Update student | 200, 400, 404, 409 |
| DELETE | `/api/students/:id` | Delete student | 204, 404 |

### Request/Response Examples

**POST `/api/students`**
```json
// Request body
{
  "name": "Pranav A",
  "rollNumber": "67",
  "department": "Information Technology",
  "year": 3
}

// Response (201 Created)
{
  "id": 1,
  "name": "Pranav A",
  "rollNumber": "67",
  "department": "Information Technology",
  "year": 3,
  "createdAt": "2026-09-19T08:00:00.000Z",
  "updatedAt": "2026-09-19T08:00:00.000Z"
}
```

**GET `/api/students?department=Information Technology`**
```json
// Response (200 OK)
[
  {
    "id": 1,
    "name": "Pranav A",
    "rollNumber": "67",
    "department": "Information Technology",
    "year": 3,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

## Validation Rules
- **name**: string, required, non-empty, max 100 chars
- **rollNumber**: string, required, unique, non-empty
- **department**: string, required, non-empty, max 100 chars
- **year**: integer, required, 1-4

## Error Response Format
```json
{
  "error": "Validation failed",
  "details": ["Name is required and must be a non-empty string"],
  "statusCode": 400
}
```

## curl Examples

**Create a student:**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","rollNumber":"R123","department":"CS","year":2}'
```

**Get all students:**
```bash
curl http://localhost:3000/api/students
```

**Update a student:**
```bash
curl -X PUT http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"year":3}'
```

**Delete a student:**
```bash
curl -X DELETE http://localhost:3000/api/students/1
```

## Testing
Run the test suite using Jest:
```bash
npm test
```

## Project Structure
```
student-records-api/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── studentController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── models/
│   │   └── studentModel.ts
│   ├── routes/
│   │   └── studentRoutes.ts
│   └── types/
│       └── index.ts
├── tests/
│   └── students.test.ts
├── database/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

**Author**: Pranav A
