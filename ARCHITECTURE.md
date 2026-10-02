# Backend Architecture

## Design

The backend is a layered FastAPI application using asynchronous MongoDB persistence through Motor. HTTP and domain concerns are separated across route handlers, controllers, services, repositories, and Pydantic document models.

```text
HTTP client
  -> FastAPI router (api/routes)
  -> request/response DTO (api/schemas)
  -> Controller (controllers)
  -> Service (services)
  -> Repository (repositories)
  -> AsyncIOMotorDatabase
  -> MongoDB
```

## Layer Responsibilities

### Routes and schemas

`api/main.py` creates the FastAPI application, registers routers and middleware, mounts `/uploads`, and manages the application lifespan. Route modules handle HTTP concerns: parsing Pydantic DTOs, resolving authenticated users, calling controllers, mapping expected failures to HTTP status codes, and constructing responses. Schemas in `api/schemas/` define transport contracts; they are not database models.

### Controllers

Controllers are thin asynchronous use-case delegates. They adapt route calls to service methods and keep persistence details out of HTTP handlers. `AuthController` delegates Google profile sign-in to `AuthService`.

### Services

Services implement application rules and coordinate repositories. They validate input, enforce tenant and ownership boundaries, and coordinate multi-document workflows. Examples include checking that a teacher owns a course before creating an exercise, verifying a student's class membership before saving attendance, and synchronizing parent/student links.

### Repositories

Repositories own Mongo queries and document hydration. Database calls use Motor's async API and are awaited; cursor results are consumed asynchronously. Repository methods for tenant-owned data filter by `admin_id`. MongoDB does not supply foreign-key enforcement for the string ID references used by this application, so services verify relationships before writes.

### Models and database lifecycle

`models/domain_models.py` defines the active Pydantic v2 documents, including the password-free Google identity document. Mongo `_id` values are exposed as string IDs; references such as `admin_id`, `class_id`, `course_id`, and `student_id` are stored as strings. `database/database.py` creates the Motor client and selected database.

`api/dependencies.py` is the composition root: it constructs the shared `AsyncIOMotorDatabase`, repositories, services, controllers, and authentication dependencies. During FastAPI lifespan, `connect_to_database()` pings Mongo and provisions indexes; shutdown closes the client.

## Request Flow Example: Google OAuth

```text
GET /auth/google/login
  -> api/routes/auth_router.py
  -> Authlib redirects to Google's consent screen

GET /auth/google/callback
  -> validate Google ID token and verified email
  -> AuthController (controllers/auth_controller.py)
  -> AuthService (services/auth_service.py)
      -> link existing role account by email, or create users record
      -> return JWT access token
```

OAuth state is held in the signed Starlette session cookie. Mongo operations and the Authlib OAuth client are asynchronous.

## MongoDB Collections and Relationships

Account and tenant collections are `admins`, `students`, `teachers`, `parents`, `users`, and `classes`. Learning/workflow collections are `courses`, `exercises`, `submissions`, `notifications`, `attendance`, and `learning_materials`.

- Each tenant-owned document includes `admin_id`; admin accounts are the tenant roots.
- A class contains a `teacher_id` and embedded enrollment entries. Students also carry `class_id` and `class_ids` references.
- Courses refer to a teacher and class. Exercises refer to a teacher, class, and course.
- Submissions refer to a student, class, and exercise. Score and grading timestamps are fields on submissions; there is no separate grade collection.
- Parents store `student_ids`; students store an optional `parent_id`.
- Notifications store polymorphic sender/receiver string IDs plus `receiver_role`.
- Attendance rows and uploaded-material metadata are stored in auxiliary tenant-scoped collections.

Mongo startup creates a partial unique phone index per existing account collection and unique email and Google subject indexes for `users`. Existing duplicate non-empty values can prevent index creation.

## Authentication and Tenant Access

JWTs contain a subject and role. Student and teacher tokens also contain the `admin_id` tenant claim; parent tokens include their tenant claim; admin identity uses its own ID. `get_current_user` resolves the token subject against the appropriate service/repository, and role dependencies such as `require_student`, `require_teacher`, and `get_current_admin` gate protected routes.

Google sign-in links verified emails to existing admin, student, or teacher records. Otherwise it creates a generic Google user. Generic users receive a valid bearer JWT but must be assigned an application role before accessing role-specific endpoints. Phone numbers remain profile/contact fields and are not used for authentication.

## File Storage and External Services

MongoDB stores upload paths and material metadata, not file bytes. `utils/submission_storage.py` asynchronously reads/writes uploads with `UploadFile.read()` and `aiofiles`, and performs async directory creation and deletion. Files are stored under `uploads/submissions/` and `uploads/materials/`, then served from `/uploads`. Production must use a persistent volume or object storage if local container disks are ephemeral.

Google OAuth uses `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL`. `FRONTEND_AUTH_REDIRECT_URL` enables browser token handoff in the URL fragment; without it, the callback returns JSON. `SECRET_KEY` signs JWTs and OAuth session cookies; production requires a strong stable value.

## Configuration and Lifecycle

Required database settings:

```text
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=eduinsight
```

Run locally from the workspace root after installing `requirements.txt`:

```powershell
$env:MONGODB_URI = "mongodb://localhost:27017"
$env:MONGODB_DATABASE = "eduinsight"
$env:SECRET_KEY = "replace-with-a-long-random-secret"
$env:GOOGLE_CLIENT_ID = "your-google-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"
$env:GOOGLE_CALLBACK_URL = "http://localhost:8000/auth/google/callback"
$env:FRONTEND_AUTH_REDIRECT_URL = "http://localhost:3000/login"
uvicorn app:app --reload
```

The application fails startup if MongoDB cannot be reached or required indexes cannot be provisioned. Hosting must provide the same environment variables, a reachable MongoDB deployment, and persistent/object storage for uploaded files. `CORS_ORIGINS` can be set to a comma-separated list of allowed frontend origins.

## Tests

Run the current backend tests with:

```powershell
python -m pytest tests -q
```

`pytest-asyncio` supports async tests. The suite includes async controller delegation, Google identity/JWT flows and index provisioning, request schema checks, and async upload-storage tests.
