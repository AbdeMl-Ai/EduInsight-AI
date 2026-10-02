# Backend System Report

**Project:** EduInsight AI  
**Scope:** FastAPI and MongoDB backend at the workspace root  
**Reviewed:** 2026-09-26

This report describes the code currently in the workspace. The frontend lives separately under `frentend/education-ai/`; the similarly named mobile UI project is also outside the backend scope.

## Overview

The backend is organized as an asynchronous layered application:

```text
HTTP client
  -> FastAPI application and routes
  -> request/response schemas
  -> controllers
  -> services
  -> MongoDB repositories (Motor)
  -> MongoDB collections
```

The principal composition root is `api/dependencies.py`. It creates one shared Motor database handle, repositories, services, and controllers. `api/main.py` registers the routes and manages startup/shutdown. At startup, the application pings MongoDB and creates contact-number indexes plus unique Google identity indexes. Uploaded bytes are stored on the local filesystem under `uploads/`; document metadata and application data are stored in MongoDB.

## Important Runtime Flow

### Application startup

1. `app.py` imports `app` from `api/main.py`.
2. FastAPI enters the lifespan context in `api/main.py`.
3. `api/dependencies.py:connect_to_database()` pings MongoDB and creates indexes.
4. Requests are served until shutdown, when the Motor client is closed.

### Google OAuth authentication

```text
Client
  -> api/routes/auth_router.py
  -> controllers/auth_controller.py
  -> Google consent screen and verified user profile
  -> services/auth_service.py
      -> link existing account by email, or create MongoDB users identity
      -> return JWT bearer token
```

`GET /auth/google/login` starts the authorization-code flow. `GET /auth/google/callback` validates Google's verified email, links existing admin/student/teacher accounts by email or creates a generic Google identity, then returns a JWT. New generic users must be provisioned with an application role before accessing role-specific APIs.

### Tenant and document relationships

MongoDB does not enforce relational foreign keys here. Relationships are stored as stringified Mongo IDs. Tenant-owned records generally carry `admin_id`, which repository filters use for isolation. Student/class enrollment is represented on both the student (`class_id`, `class_ids`) and class (`embedded_students`) documents. Parents and students similarly refer to one another through `student_ids` and `parent_id`. Courses, exercises, and submissions carry IDs for their related records.

## Backend Folders

### `api/`

Owns the FastAPI app, request lifecycle, dependency graph, route handlers, and transport schemas.

- `api/__init__.py`: Empty package marker.
- `api/main.py`: Constructs the FastAPI app; registers CORS, static upload serving, route modules, and the lifespan that connects to MongoDB and closes the client.
- `api/dependencies.py`: Composition root. Creates the shared `AsyncIOMotorDatabase`, index creation, repositories, services, controllers, and JWT-based role dependencies (`get_current_user`, `require_student`, `require_teacher`, `get_current_admin`).

#### `api/routes/`

Route functions parse HTTP input, enforce dependencies, call controllers, translate expected errors to HTTP errors, and serialize responses.

- `api/routes/__init__.py`: Empty package marker.
- `api/routes/admin_router.py`: Admin setup/profile, workspace statistics, class/student/teacher management, reports, assignments, and admin notifications.
- `api/routes/attendance_router.py`: Teacher attendance class roster, attendance submission/history, and admin monthly reports.
- `api/routes/auth_router.py`: Google OAuth login redirect and callback endpoints under `/auth`.
- `api/routes/course_router.py`: Tenant-scoped course listing, creation, retrieval, search, count, update, and delete.
- `api/routes/exercise_router.py`: Exercise listing, creation, retrieval, search, count, update, and delete.
- `api/routes/notification_router.py`: Tenant-scoped notification listing, search, count, create, read-state change, and admin delete.
- `api/routes/parent_router.py`: Admin-only parent CRUD and student linking under `/parents`.
- `api/routes/student_router.py`: Student self-service profile, courses, exercises, submissions, scores, and notifications; admin student-management endpoints; upload replacement/deletion.
- `api/routes/submission_router.py`: Submission create/read/search/count/update/delete, with teacher ownership checks when changing scores.
- `api/routes/teacher_router.py`: Teacher self-service profile/classes/courses/exercises/students/submissions/grades/notifications and admin teacher management.

#### `api/schemas/`

Pydantic v2 request and response DTOs. These are separate from MongoDB domain documents.

- `api/schemas/__init__.py`: Empty package marker.
- `api/schemas/admin_schemas.py`: Admin profile/setup, class CRUD, admin-created student/teacher, teacher assignment, and student-report request/response models.
- `api/schemas/attendance_schema.py`: Attendance records and attendance-save payload.
- `api/schemas/auth_schema.py`: JWT access-token response shape.
- `api/schemas/course_schema.py`: Course create/update/response and teacher-course request shapes.
- `api/schemas/exercise_schema.py`: Exercise create/update/response and teacher-exercise request shapes.
- `api/schemas/notification_schema.py`: Notification create/update/response payloads and admin recipient validation.
- `api/schemas/parent_schema.py`: Parent create/update/response payloads.
- `api/schemas/student_exercise_schema.py`: Student-exercise response DTO with score/status/material path. It uses an integer exercise identifier and is not the active Mongo domain document shape.
- `api/schemas/student_schema.py`: Student create/update/response DTOs and aliases for legacy input field names.
- `api/schemas/submission_schema.py`: Submission create/update/response DTOs.
- `api/schemas/teacher_schema.py`: Teacher create/update/response DTOs.

### `controllers/`

Thin asynchronous facades between route code and service workflows.

- `controllers/__init__.py`: Empty package marker.
- `controllers/admin_controller.py`: Delegates admin setup/profile, student/teacher/class management, access checks, and reports.
- `controllers/attendance_controller.py`: Delegates attendance workflows.
- `controllers/auth_controller.py`: Delegates Google profile sign-in.
- `controllers/class_controller.py`: Delegates class CRUD/search.
- `controllers/course_controller.py`: Delegates course workflows and queries.
- `controllers/exercise_controller.py`: Delegates exercise workflows and queries.
- `controllers/material_controller.py`: Delegates material metadata lookup and creation.
- `controllers/notification_controller.py`: Delegates notification workflows and read-state management.
- `controllers/parent_controller.py`: Delegates parent CRUD and student linking.
- `controllers/student_controller.py`: Delegates student CRUD, class/exercise lookup, profile, search, and counts.
- `controllers/submission_controller.py`: Delegates submission workflows, teacher views, grading, and counts.
- `controllers/teacher_controller.py`: Delegates teacher CRUD, assignment, search, and counts.

### `services/`

Implements business validation, authorization, ownership checks, workflows, and orchestration across repositories.

- `services/__init__.py`: Empty package marker.
- `services/admin_service.py`: Admin setup/profile/password handling; orchestrates student/teacher creation and class assignments; validates tenant access and academic-level consistency.
- `services/analytics_service.py`: Empty file; no analytics service implementation is currently present.
- `services/attendance_service.py`: Checks teacher/class ownership and attendance records; validates dates/statuses and roster membership.
- `services/auth_service.py`: Google identity linking/creation and JWT generation.
- `services/class_service.py`: Class validation and tenant-scoped class CRUD/search.
- `services/course_service.py`: Course creation/updates with teacher/class ownership validation.
- `services/exercise_service.py`: Exercise workflows, course ownership checks, and maximum-score validation.
- `services/material_service.py`: Delegates learning-material metadata operations.
- `services/notification_service.py`: Validates recipients and orchestrates individual/class/admin notifications and read-state operations.
- `services/parent_service.py`: Parent account creation, student-link validation/synchronization, CRUD, and password hashing when a password is supplied.
- `services/student_service.py`: Student creation/profile/update/delete, password hashing, validation, class assignment, exercise/report access.
- `services/submission_service.py`: Submission creation and ownership checks, score validation, grading, and lookup workflows.
- `services/teacher_service.py`: Teacher creation/profile/update/delete and class-assignment validation.

### `repositories/`

Owns async Motor queries and conversion between MongoDB documents and domain models.

- `repositories/__init__.py`: Empty package marker.
- `repositories/admin_repository.py`: Admin account CRUD, email/phone lookup, and account-existence check.
- `repositories/attendance_repository.py`: Attendance persistence and tenant-filtered roster/history/report queries; attendance is held in the auxiliary `attendance` collection.
- `repositories/class_repository.py`: Class CRUD and embedded-student enrollment updates.
- `repositories/course_repository.py`: Course CRUD/search/count and tenant-scoped class/teacher queries.
- `repositories/exercise_repository.py`: Exercise CRUD/search/count and student/teacher exercise lookups; joins score/status from submissions by query.
- `repositories/material_repository.py`: Learning-material metadata in `learning_materials`, including latest-path lookup.
- `repositories/notification_repository.py`: Notification CRUD/search/count/read-state queries.
- `repositories/google_user_repository.py`: Async persistence for password-free Google identities in `users`.
- `repositories/parent_repository.py`: Parent CRUD and student linking.
- `repositories/student_repository.py`: Student CRUD, class membership, search/count, and email/phone authentication lookups.
- `repositories/submission_repository.py`: Submission CRUD/search/count, student/exercise lookups, and teacher submissions via exercises.
- `repositories/teacher_repository.py`: Teacher CRUD/search/count, class assignment, and email/phone authentication lookups.

### `models/`

- `models/__init__.py`: Empty package marker.
- `models/domain_models.py`: Active Pydantic v2 Mongo document models: `Admin`, `Student`, `Teacher`, `Parent`, `ClassDocument`, `Course`, `Exercise`, `Submission`, and `Notification`. Converts BSON ObjectIds to string IDs and defines document defaults/validation.
- `models/domain_models.py`: Includes the password-free Google identity document model.
- `models/admin.py`: Legacy plain Python admin object; not imported by runtime code.
- `models/attendance.py`: Legacy plain Python attendance object; not imported by runtime code.
- `models/class_group.py`: Legacy plain Python class object; not imported by runtime code.
- `models/course.py`: Legacy plain Python course object; not imported by runtime code.
- `models/exercise.py`: Legacy plain Python exercise object; not imported by runtime code.
- `models/notification.py`: Legacy plain Python notification object; not imported by runtime code.
- `models/student.py`: Legacy plain Python student object; only referenced by the stale `test_student_profile.py` test.
- `models/submission.py`: Legacy plain Python submission object; not imported by runtime code.
- `models/teacher.py`: Legacy plain Python teacher object; not imported by runtime code.

The active Mongo model module is `domain_models.py`; the older individual model files retain pre-Mongo fields/constructor patterns and are not used by current runtime repositories or services.

### Other backend/support folders

- `database/`: Mongo connection setup. `database/database.py` constructs `AsyncIOMotorClient`, selects database `MONGODB_DATABASE`, and exposes ping/close helpers.
- `utils/`: Shared security, validation, and upload helpers.
  - `utils/security.py`: Password hashing/verification with `pwdlib`, JWT encoding/decoding, HS256 algorithm, one-hour token expiry. `SECRET_KEY` is read from the environment, with a development fallback.
  - `utils/student_validation.py`: Student/admin name, email, password, phone, and level checks. Phone validation accepts local 10-digit numbers or a plus-prefixed international digit string.
  - `utils/teacher_validation.py`: Teacher name, email, password, and phone checks.
  - `utils/notification_validation.py`: Notification message/title validation.
  - `utils/submission_validation.py`: Allowed submission status validation.
  - `utils/submission_storage.py`: Creates `uploads/` paths, validates PDF/JPEG/PNG MIME types, asynchronously reads/writes uploads with `aiofiles`, returns public relative paths, and asynchronously deletes submission files.
  - `utils/validation_course.py`: Course title/description/level/semester checks.
  - `utils/validation_exercise.py`: Exercise name and level checks.
  - `utils/validators.py`: Numeric score and maximum-score validation.
  - `utils/__init__.py`: Not present; `utils` is imported as a namespace package.
- `data/`: Static datasets and a placeholder database module, not part of the active Mongo persistence path.
  - `data/fake_database.py`: Empty file.
  - `data/student_performance.csv`: Sample student performance/grade dataset.
  - `data/student-mat.csv`: Student Mathematics dataset.
  - `data/student-por.csv`: Student Portuguese dataset.
- `uploads/materials/`: Runtime storage for course/exercise PDF and image materials; currently contains uploaded files.
- `uploads/submissions/`: Runtime storage for student submission files; currently contains uploaded files.
- `config/`: No source/configuration files currently present.
- `interfaces/`: Empty.
- `views/`: Empty; HTTP response formatting is currently in route helpers.
- `test/`: Singular legacy directory with no test source files; current tests are under `tests/`.
- `tests/`: Automated tests. SQLite-era modules have been removed; remaining files are listed below.

### Current test files

- `tests/__init__.py`, `tests/controllers/__init__.py`, `tests/repositories/__init__.py`, `tests/services/__init__.py`: Empty package markers.
- `tests/controllers/test_controller_delegation.py`: Controller delegation test; currently targets an outdated synchronous controller signature.
- `tests/services/test_auth_google_service.py`: Isolated tests for Google identity linking/creation, JWT claims, and startup indexes.
- `tests/services/test_student_profile.py`: Legacy profile test using the old `models.student.Student` object and synchronous assumptions.
- `tests/services/test_teacher_request_schemas.py`: Tests course/exercise request schemas; currently uses obsolete field names and integer IDs.

## MongoDB Collections and Startup Indexes

The runtime uses these application collections:

- `admins`: Admin accounts; phone index on `phone_number`.
- `students`: Student accounts; tenant-owned by `admin_id`; phone index on `phone_number`.
- `teachers`: Teacher accounts; tenant-owned by `admin_id`; phone index on `phone_number`.
- `parents`: Parent accounts; tenant-owned by `admin_id`; phone index on `contact_number`.
- `classes`: Tenant-scoped class documents; includes embedded enrollment entries.
- `courses`: Tenant-scoped course documents.
- `exercises`: Tenant-scoped exercises and maximum scores.
- `submissions`: Tenant-scoped submissions and grading values/timestamps; there is no separate grade collection.
- `notifications`: Tenant-scoped notification documents.
- `attendance`: Tenant-scoped auxiliary attendance records.
- `learning_materials`: Tenant-scoped metadata for local material files.
- `users`: Google identities with unique indexes on `email` and `google_sub`.

Phone unique indexes are created independently per profile collection and use a partial filter for non-empty string phone fields. Phone numbers remain contact information and are not used for authentication.

## Configuration and Running

Install Python dependencies and start from the workspace root:

```powershell
python -m pip install -r requirements.txt
$env:MONGODB_URI = "mongodb://localhost:27017"
$env:MONGODB_DATABASE = "eduinsight"
$env:SECRET_KEY = "replace-with-a-long-random-secret"
$env:GOOGLE_CLIENT_ID = "your-google-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"
$env:GOOGLE_CALLBACK_URL = "http://localhost:8000/auth/google/callback"
$env:FRONTEND_AUTH_REDIRECT_URL = "http://localhost:3000/login"
uvicorn app:app --reload
```

`CORS_ORIGINS` optionally configures comma-separated browser origins; its default allows the documented local frontend origins. The app exposes `/docs` and `/redoc` through FastAPI and mounts local files at `/uploads`. The required runtime packages are recorded in `requirements.txt`, including FastAPI, Authlib, aiofiles, Motor/PyMongo, Pydantic, JWT utilities, multipart upload support, and Uvicorn.

## Known Caveats

- The current test suite was last run after SQLite test cleanup: 5 passed and 4 failed. Failures are in `test_controller_delegation.py`, `test_student_profile.py`, and two tests in `test_teacher_request_schemas.py`, which still expect removed synchronous behavior or old DTO fields.
- `services/analytics_service.py`, `data/fake_database.py`, `seed_db.py`, and `dvc.yaml` are empty; there is no implemented analytics service, fake database, seed script, or DVC pipeline in those files.
- `README.md` and `ARCHITECTURE.md` still contain references to the retired SQLite test modules; those references are outdated after their deletion.
- `README.md` refers to a `render.yaml` deployment manifest, but no such root file is present in the current workspace inventory.
- In `services/submission_service.py`, `update_submission()` references `submission.exercise_id` in the score-update path without assigning `submission` from the earlier lookup. Updating a score through this path can therefore raise `NameError`.
- Upload helpers use `UploadFile.read()`, `aiofiles.open()`, and asynchronous `aiofiles.os` operations for upload reads/writes and deletion.
- `utils/security.py` falls back to a known development secret if `SECRET_KEY` is unset. Production must set a strong stable secret.
- Existing unique phone indexes may fail at startup if a collection already contains duplicate non-empty phone values; resolve duplicates before deployment.

## Other Root-Level Files

- `app.py`: Exports the FastAPI `app` object for `uvicorn app:app`.
- `requirements.txt`: Python runtime and test dependencies.
- `README.md`: Project overview, setup, deployment, and frontend/backend guidance.
- `ARCHITECTURE.md`: Short backend layering, tenancy, collection, and lifecycle notes.
- `generate_diagram.py`: Optional script using `erdantic` to draw the Pydantic Mongo models into `architecture_diagram.png`.
- `architecture_diagram.png`: Generated model-diagram artifact; not loaded by the API runtime.
- `seed_db.py`: Empty; no database seed operation is implemented there.
- `dvc.yaml`: Empty; no DVC stages are configured there.
- Root `package.json` and `pnpm-lock.yaml`: JavaScript tooling/dependencies, not required to start the Python API.
- `prompt_frontend.md`: Frontend project prompt/document, not part of backend runtime.
