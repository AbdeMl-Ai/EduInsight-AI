# EduInsight AI

EduInsight AI is an education platform for managing schools/workspaces, classes, students, teachers, parents, courses, exercises, submissions, attendance, and notifications. The workspace contains a FastAPI backend and a separate Next.js frontend.

## Backend Capabilities

- Role-aware JWT authentication for admins, teachers, students, and parents.
- Google OAuth sign-in with JWT bearer tokens.
- Tenant-scoped management of classes, student/teacher records, parents, courses, and exercises.
- Student file submissions, teacher materials, grading, attendance, and notifications.
- Async MongoDB persistence through Motor; uploaded file bytes are kept in local upload directories.

## Backend Layout

```text
app.py                    Uvicorn application entry point
api/
  main.py                 FastAPI app, lifespan, middleware, router registration
  dependencies.py         Shared Mongo handle and Controller-Service-Repository wiring
  routes/                 HTTP handlers
  schemas/                Pydantic request/response DTOs
controllers/              Async use-case delegates
services/                 Validation, authorization, and workflows
repositories/             Async Motor persistence
models/                    Mongo document models
database/                  Motor client configuration
utils/                     Security, validation, and async file storage
uploads/                   Local materials and submissions
tests/                     Controller, service, schema, and utility tests
```

For layer responsibilities, request flow, collections, and indexes, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Requirements

- Python 3.10 or newer.
- A reachable MongoDB deployment.
- Google OAuth client credentials and a registered callback URL.

Install dependencies from the workspace root. On Windows PowerShell:

```powershell
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Configure environment variables in the shell or your deployment environment:

```powershell
$env:MONGODB_URI = "mongodb://localhost:27017"
$env:MONGODB_DATABASE = "eduinsight"
$env:SECRET_KEY = "replace-with-a-long-random-secret"
$env:GOOGLE_CLIENT_ID = "your-google-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"
$env:GOOGLE_CALLBACK_URL = "http://localhost:8000/auth/google/callback"
$env:FRONTEND_AUTH_REDIRECT_URL = "http://localhost:3000/login"
$env:CORS_ORIGINS = "http://localhost:3000"
```

Set a strong, stable `SECRET_KEY` in every non-development environment. Register the callback URL above in Google Cloud Console. `CORS_ORIGINS` is optional; its default permits common local frontend origins. A comma-separated list is supported.

Run the API:

```powershell
uvicorn app:app --reload
```

The API root is `http://127.0.0.1:8000/`; OpenAPI documentation is at `/docs` and `/redoc`. Startup pings MongoDB and creates required indexes. Start Google sign-in at `GET /auth/google/login`; the callback redirects to the configured frontend with the bearer token in the URL fragment, or returns the token as JSON when `FRONTEND_AUTH_REDIRECT_URL` is unset. Existing admin, student, and teacher accounts are linked by their verified email. New Google users are created with the generic `user` role and must be provisioned before accessing role-specific APIs.

## Authentication

The `/auth` API exposes `GET /auth/google/login` and `GET /auth/google/callback`. Google identities are stored in the `users` collection with a unique email index; matching existing role accounts receive their established role in the JWT.

## API Areas

| Router | Base paths and responsibilities |
| --- | --- |
| Authentication | `/auth`: Google OAuth sign-in and JWT issuance |
| Admin | `/admin`: workspace setup/profile, classes, students, teachers, reports, notifications |
| Students | `/students`: admin management and student self-service |
| Teachers | `/teachers`: admin management and teacher self-service |
| Parents | `/parents`: admin-managed parents and student links |
| Courses | `/courses`: course management and queries |
| Exercises | `/exercises`: exercise management and queries |
| Submissions | `/submissions`: uploads, queries, scoring, and deletion |
| Notifications | `/notifications`: send, query, and read-state operations |
| Attendance | Teacher attendance endpoints and `/admin/attendance/report` |

Protected endpoints use JWT Bearer authentication. Teachers and students carry an `admin_id` tenant claim; admin-owned operations use the admin ID as the tenant key.

## MongoDB and Files

`database/database.py` creates an `AsyncIOMotorClient` using `MONGODB_URI` and selects `MONGODB_DATABASE`. Application data is stored in `admins`, `students`, `teachers`, `parents`, `users`, `classes`, `courses`, `exercises`, `submissions`, `notifications`, `attendance`, and `learning_materials`. Document references are stringified Mongo IDs rather than relational foreign keys; tenant-owned repository queries include `admin_id`.

At startup, the backend creates per-collection unique phone indexes for existing contact fields and unique email/Google-subject indexes for Google identities. Existing duplicate non-empty contact values can prevent index creation and should be resolved before deployment.

Course/exercise materials and student submissions are stored beneath `uploads/materials/` and `uploads/submissions/`. The backend serves the upload root at `/uploads`. The storage helpers use `aiofiles` for async reads, writes, directory creation, and deletion. Local disk is suitable for development; production should use persistent storage or object storage because container filesystems can be ephemeral.

Allowed upload MIME types are PDF (`application/pdf`), JPEG (`image/jpeg`), and PNG (`image/png`). MongoDB stores paths/metadata, not the file contents.

## Testing

Run the backend test suite from the workspace root:

```powershell
python -m pytest tests -q
```

`pytest-asyncio` is included for async tests. Current tests cover Controller delegation, Google identity/JWT behavior and startup indexes, request schemas, and async upload storage.

## Frontend

The Next.js frontend is under `frentend/education-ai/`. Its setup and frontend-specific architecture are documented in [frentend/education-ai/Documentation.md](frentend/education-ai/Documentation.md). Run the frontend separately from the backend; configure its API base URL to point at the FastAPI host.
