# EduInsight-AI API Reference

## Overview

This reference documents the FastAPI routes registered by `api/main.py` and the static upload route. The API is mounted at `http://localhost:8000` (also commonly accessed as `http://127.0.0.1:8000`). Interactive OpenAPI documentation is available at `/docs` while the backend is running.

Unless stated otherwise, protected endpoints require:

```http
Authorization: Bearer <access_token>
```

JSON request bodies use `Content-Type: application/json`. File uploads use `multipart/form-data`. FastAPI validation errors normally return `422` with a `detail` array; application errors use `{"detail":"..."}`. Invalid/expired tokens return `401`; wrong-role access returns `403`. Missing bearer credentials are rejected by `HTTPBearer` (typically `403`).

IDs are represented as strings in these API schemas. Timestamps are ISO 8601 date-time strings; date-only attendance fields use `YYYY-MM-DD`.

## Authentication and Account Provisioning

### `POST /auth/login`

- **Access:** Public.
- **Description:** Authenticates a user using OAuth2 password-form credentials and issues a JWT.
- **Request:** `application/x-www-form-urlencoded`, not JSON. Required fields: `username` (the login email/username) and `password`. OAuth2 optional form fields such as `scope` may also be accepted.
- **Success `200`:** `{"access_token":"<jwt>","token_type":"bearer","role":"student|teacher|admin|..."}`.
- **Errors:** `401` invalid credentials; `422` missing or malformed form values.

### `POST /auth/register`

- **Access:** Public.
- **Description:** Creates an active center administrator login in the `users` collection and matching profile in `admins`. The password is stored as a bcrypt hash, and the account can sign in to the admin dashboard immediately.
- **Request:** JSON: `{ "full_name": string, "email": string, "phone_number": string, "password": string }`. Email is normalized to lowercase; passwords must be 8–72 UTF-8 bytes.
- **Success `201`:** `{ "message": string, "email": string, "role": "admin", "account_status": "active" }`.
- **Errors:** `409` email already exists; `422` invalid fields.

### `GET /auth/google/login`

- **Access:** Public.
- **Description:** Starts Google OAuth and redirects to Google.
- **Request:** No body. Google client ID and secret must be configured.
- **Success:** Redirect response to Google authorization.
- **Errors:** `503` when Google OAuth is not configured; OAuth provider errors may interrupt the redirect flow.

### `GET /auth/google/callback`

- **Access:** OAuth provider callback; no bearer token is required.
- **Description:** Handles Google's authorization callback, validates a verified email, and logs in or provisions the Google user through the auth service.
- **Request:** OAuth query parameters, principally `code` and `state`, are supplied by Google.
- **Success:** If `FRONTEND_AUTH_REDIRECT_URL` is configured, redirects there with `access_token`, `token_type`, and `role` in the URL fragment. Otherwise returns the login token JSON shape from `POST /auth/login`.
- **Errors:** `401` if Google user information is missing, email is unverified, or profile identity is invalid. OAuth/session-state failures may also prevent callback completion.

### Signup and user creation

`POST /admin/setup` is the initial administrator bootstrap, not general signup. An administrator can create a password-based login with `POST /admin/users/create`; this creates a user credential record and does not return a JWT. Admin-managed student/teacher records are created through the endpoints in their respective sections.

Google OAuth's authorized redirect URI is the public FastAPI callback URL, configured with backend `GOOGLE_CALLBACK_URL` (for example, `https://<api-host>/auth/google/callback`). It is not the Vercel frontend URL. `FRONTEND_AUTH_REDIRECT_URL` is a separate setting that points to the frontend login page (for example, `https://<frontend-host>/login`).

## Payload and Response Shapes

The following shared schemas describe request bodies used below. Optional fields may be omitted; nullable fields may be sent as `null` where noted.

### Admin and class payloads

- `AdminSetupRequest`: `{ "name": string, "email": string, "phone_number": string }`.
- `AdminUserCreate`: `{ "name": string, "email": string, "role": "student"|"teacher"|"parent", "password": string }`.
- `ClassCreate`: `{ "teacher_id": string, "class_name": string, "subject": string, "class_level": string, "center_rent_fee_per_student": number, "teacher_teaching_fee_per_student": number, "student_monthly_fee": number }`.
- `ClassUpdate`: any subset of `ClassCreate` fields.
- Class response: `{ "id": string, "admin_id": string, "teacher_id": string, "class_name": string, "subject": string, "class_level": string, "center_rent_fee_per_student": number, "teacher_teaching_fee_per_student": number, "student_monthly_fee": number }`.

### Student and teacher payloads

- Admin student create: `{ "full_name": string, "email": string, "phone_number": string, "level": string, "age": number=0, "parent_id": string|null, "class_id": string|null, "class_ids": string[]=[] }`.
- Student create at `/students/`: `{ "full_name": string, "email": string, "phone_number": string="", "age": number=0, "level_academy": string, "parent_id": string|null, "class_id": string|null }`. The schema accepts `level` as an alias for `level_academy`.
- Student update: subset of `{ "full_name": string, "email": string, "phone_number": string, "age": number, "level_academy": string, "parent_id": string|null, "class_id": string|null }`.
- Admin student update: subset of `{ "full_name": string, "email": string, "phone_number": string, "level": string, "class_id": string|null, "class_ids": string[], "parent_id": string|null }`.
- Admin teacher create: `{ "full_name": string, "email": string, "phone_number": string, "class_ids": string[]|null, "specialties": string[]=[], "age": number=0, "is_state_teacher": boolean=false }`.
- Teacher create at `/teachers/`: `{ "full_name": string, "email": string, "phone_number": string="", "age": number=0, "is_state_teacher": boolean=false, "specialties": string[]=[] }`.
- Teacher update: subset of teacher profile fields (`full_name`, `email`, `phone_number`, `age`, `is_state_teacher`, `specialties`). Admin teacher update additionally accepts `class_ids`.
- Admin teacher-class assignment: `{ "class_ids": string[] }`.

Student response: `{ "student_id": string, "admin_id": string|null, "parent_id": string|null, "full_name": string, "age": number, "level_academy": string, "date_enjoined": string|null, "email": string, "phone_number": string, "level": string, "class_id": string|null }`. Public `user` accounts receive their profile and empty class/course/exercise/submission/grade/notification lists until they are enrolled; write operations still require a provisioned student account.

Teacher response: `{ "teacher_id": string, "admin_id": string, "full_name": string, "email": string, "phone_number": string, "age": number, "is_state_teacher": boolean, "specialties": string[], "date_enjoined": string|null, "classes": object[] }`.

### Courses, exercises, and submissions

- `CourseCreate`: `{ "teacher_id": string|null, "class_id": string, "title": string, "description": string="" }`.
- `CourseUpdate`: subset of `teacher_id`, `class_id`, `title`, and `description`.
- Course response: `{ "id": string, "admin_id": string, "teacher_id": string, "class_id": string, "title": string, "description": string, "created_at": string }`.
- `ExerciseCreate`: `{ "teacher_id": string|null, "class_id": string|null, "course_id": string, "course_title": string="", "file_path": string="", "max_score": number=20 }`.
- `ExerciseUpdate`: subset of `teacher_id`, `class_id`, `course_id`, `course_title`, `file_path`, and `max_score`.
- Exercise response: `{ "id": string, "admin_id": string, "teacher_id": string, "class_id": string, "course_id": string, "course_title": string, "file_path": string, "max_score": number, "created_at": string }`.
- Submission response: `{ "id": string, "admin_id": string, "student_id": string, "class_id": string, "exercise_id": string, "submission_status": string, "file_path": string, "score": number|null, "submitted_at": string|null, "graded_at": string|null }`.
- Submission update: subset of `{ "submission_status": string, "file_path": string, "score": number }`.

### Notification and attendance payloads

- `AdminNotificationCreate`: `{ "message": string, "student_id": string|null, "class_id": string|null }`; message length is 1–5000 and exactly one recipient (`student_id` or `class_id`) is required.
- `TeacherNotificationCreate`: `{ "message": string, "class_id": string|null, "student_id": string|null, "reference_link": string|null }`.
- `NotificationCreate`: `{ "receiver_id": string, "receiver_role": string="student", "message": string, "reference_link": string|null }`.
- `AttendanceSaveRequest`: `{ "class_id": string, "session_id": string|null, "date": "YYYY-MM-DD", "records": [{ "student_id": string, "status": "present"|"absent" }] }`. `session_id` identifies a scheduled lesson; omitted/null values remain compatible with legacy date-only entries.
- `StudentPaymentCreate`: `{ "student_id": string, "amount": number, "month": "YYYY-MM", "payment_date": "YYYY-MM-DD" }`. `amount` must be greater than zero, and `month` must match `payment_date`. `payment_date` defaults to the server's current date.
- Notification response fields: `id`, `admin_id`, `sender_id`, `receiver_id`, `receiver_role`, `notification_type`, `message`, `reference_link`, `is_read`, `created_at`; compatibility aliases `notification_id`, `title`, `teacher_id`, and `teacher_name` may also be present.

## Administrator Endpoints

All `/admin/...` routes require an administrator bearer token. `/students/`, `/teachers/`, and `/parents/` management routes are also admin-only.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `POST /admin/setup` | Initial administrator bootstrap. Public; intended for initial setup. | JSON `AdminSetupRequest`. | `200`: `{ "message": "Admin account ready.", "admin_id": string, "email": string, "phone_number": string }`. | `400` setup rejected. |
| `POST /admin/users/create` | Create a password-based user login. | JSON `AdminUserCreate`. | `200`: `{ "message": "User created successfully", "user_id": string }`. | `400` unsupported role or duplicate email; `401/403` auth. |
| `GET /admin/me` | Get the current admin profile. | None. | `AdminProfileResponse`: `admin_id`, `full_name`, `email`, `phone_number`. | `401/403`. |
| `PUT /admin/me` | Update admin profile. | JSON subset `{ "full_name": string, "email": string }`. | Updated `AdminProfileResponse`. | `400` update rejected; `401/403`. |
| `POST /admin/classes` | Create a class. | JSON `ClassCreate`. | `201`-style response body: class response shape above (actual status is FastAPI default `200`). | `400` invalid class; `401/403/422`. |
| `GET /admin/classes` | List admin's classes. | None. | Array of class response objects. | `401/403`. |
| `GET /admin/stats` | Get dashboard counts. | None. | `{ "total_students": number, "teaching_staff": number, "active_classes": number }`. | `401/403`. |
| `GET /admin/analytics/revenue-attendance` | Get every day's recorded present-student count and collected payment revenue for a month. Required query: `month` matching `YYYY-MM`. Attendance counts each present student attendance record; revenue is grouped by the payment's actual `payment_date`. | None. | `{ "month": string, "days": [{ "date": "YYYY-MM-DD", "attendance": number, "revenue": number }], "total_attendance": number, "total_revenue": number }`. Missing days are returned with zero values. | `401/403/422`. |
| `POST /admin/payments/transactions` | Record an amount-level student payment in the tenant-scoped `student_payments` collection. | JSON `StudentPaymentCreate`. | `201`: `{ "id": string, "student_id": string, "student_name": string, "amount": number, "payment_date": "YYYY-MM-DD", "month": "YYYY-MM" }`. | `400` student not found in this workspace or invalid student ID; `401/403/422`. |
| `PUT /admin/classes/{class_id}` | Update a class. Path: `class_id`. | JSON `ClassUpdate`. | `{ "message": string }`. | `400` inaccessible/invalid class; `401/403/422`. |
| `DELETE /admin/classes/{class_id}` | Delete a class. Path: `class_id`. | None. | `{ "message": string }`. | `404` class not found; `401/403`. |
| `POST /admin/students` | Create a student record. | JSON admin student create payload. | Student response shape above. | `400` validation/business failure; `401/403/422`. |
| `GET /admin/students` | List admin's students. | None. | Array of student response objects. | `401/403`. |
| `GET /admin/students/search` | Search students by full name. Query: required `full_name`. | None. | Array of student response objects. | `401/403/422`. |
| `PUT /admin/students/{student_id}` | Update a student. Path: `student_id`. | JSON admin student update payload. | `{ "message": string }`. | `400` update/access failure; `401/403/422`. |
| `DELETE /admin/students/{student_id}` | Delete a student. Path: `student_id`. | None. | `{ "message": string }`. | `404` not found; `401/403`. |
| `GET /admin/students/{student_id}/report` | Get a student's report. Path: `student_id`. | None. | `{ "student_id": string, "name": string, "email": string, "class_info": {"class_id":string,"name":string,"academic_year":string}|null, "exercises_and_exams": [{"exercise_id":string,"exercise_name":string,"score":number|null}] }`. | `404` student not found; `401/403`. |
| `POST /admin/students/{student_id}/class/{class_id}` | Assign a student to a class. Path: both IDs. | None. | `{ "message": string }`. | `400` invalid assignment/access; `401/403`. |
| `POST /admin/teachers` | Create a teacher record. | JSON admin teacher create payload. | Teacher response shape above. | `400` validation/business failure; `401/403/422`. |
| `GET /admin/teachers` | List admin's teachers. | None. | Array of teacher response objects. | `401/403`. |
| `GET /admin/teachers/search` | Search teachers. Query: required `full_name`. | None. | Array of teacher response objects. | `401/403/422`. |
| `PUT /admin/teachers/{teacher_id}` | Update a teacher. Path: `teacher_id`. | JSON admin teacher update payload. | `{ "message": string }`. | `400` update/access failure; `401/403/422`. |
| `DELETE /admin/teachers/{teacher_id}` | Delete a teacher. Path: `teacher_id`. | None. | `{ "message": string }`. | `404` not found; `401/403`. |
| `POST /admin/teachers/{teacher_id}/classes` | Assign additional classes to a teacher. | JSON `{ "class_ids": string[] }`. | `{ "message": string }`. | `400` invalid, inaccessible, or duplicate assignment; `401/403/422`. |
| `GET /admin/notifications` | List admin notifications. | None. | Array of notification response objects. | `401/403`. |
| `POST /admin/notifications` | Send an admin notification to one student or a class. | JSON `AdminNotificationCreate`. | `{ "message": string }`. | `400` recipient/business validation; `401/403/422`. |

## Teacher Endpoints

The `/teachers/me/...` routes require a teacher token. Teachers can only manage their assigned classes, courses, exercises, and submissions where checked by the handler.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /teachers/me` | Get teacher profile. | None. | Teacher response shape above. | `401/403`. |
| `GET /teachers/me/classes` | List assigned classes. | None. | Array of class objects as stored on the teacher profile. | `401/403`. |
| `PUT /teachers/me` | Update own profile. | JSON subset of teacher profile fields. | `{ "message": string }`. | `400` no fields or update rejected; `401/403/422`. |
| `GET /teachers/me/courses` | List courses owned by the teacher. | None. | Array of course response objects. | `401/403`. |
| `POST /teachers/me/courses` | Create course and optionally upload course notes/summary. A successful creation generates an admin activity notification. | Multipart form: required `title` (string), required `class_id` (string), optional `description` (string, default empty), optional `file` (PDF/JPEG/PNG material). | Course response object; material path is not included in this response. Student course listing exposes `material_file_path`. | `400` teacher is not assigned to the class or course creation fails; `401/403/422`. |
| `GET /teachers/me/exercises` | List teacher's exercises. | None. | Array of exercise response objects. | `401/403`. |
| `POST /teachers/me/exercises` | Create an exercise linked to a course and upload its prompt/material. A successful creation generates an admin activity notification. | Multipart form: required `course_id` (string), optional `max_score` (number, default `20`), required `file` (PDF, JPEG, or PNG). | Exercise response object. | `400` missing filename, unsupported media type, invalid course, or creation failure; `401/403/422`. |
| `POST /teachers/exercises` | Create graded work for an assigned class. A successful creation generates an admin activity notification. | Multipart form: required `class_id` and `title`; optional `course_id`, `description`, `max_score`, `due_date`, and `file`. | Exercise response object. | `400` class/course assignment or creation failure; `401/403/422`. |
| `GET /teachers/me/students` | List students in the teacher's classes. | None. | Array of `{ "student_id": string, "full_name": string, "email": string, "phone_number": string, "level_academy": string, "class_id": string }`. | `401/403`. |
| `GET /teachers/me/submissions` | List submissions for the teacher's exercises. | None. | Array of `{ "id": string, "student_id": string, "exercise_id": string, "submitted_at": string|null, "file_path": string, "submission_status": string, "score": number|null }`; empty array if no matching submissions. | `401/403`. |
| `PATCH /teachers/me/submissions/{submission_id}/score` | Assign/update a mark on a submission owned by this teacher. | Multipart form field `score` (number). | `{ "message": string }`. | `400` submission/exercise not found or does not belong to teacher; `401/403/422`. |
| `GET /teachers/me/grades` | List marks for the teacher's submissions. | None. | Array of `{ "grade_id": string, "score": number, "student_id": string, "exercise_id": string }`; ungraded submissions omitted. | `401/403`. |
| `POST /teachers/me/grades` | Legacy batch/single grading endpoint. | JSON object `{ "student_id": string, "exercise_id": string, "score": number }` or an array of such objects. | `{ "message": "N score(s) saved on submissions." }`. | `400` missing/invalid values or grading failure; `401/403/422`. |
| `PUT /teachers/me/grades/{grade_id}` | Update a mark using the submission ID as `grade_id`. | JSON `{ "score": number }`. | `{ "message": string }`. | `400` invalid score, missing submission, or exercise is not owned by teacher; `401/403/422`. |
| `POST /teachers/me/notifications` | Notify a class or all assigned class students. | JSON `TeacherNotificationCreate`; optional `class_id` must be one of the teacher's assigned classes. | `{ "message": string }`. | `400` class not assigned or notification rejected; `401/403/422`. |
| `POST /teachers/me/notifications/{student_id}` | Notify a specific student. Path: `student_id`. | JSON `TeacherNotificationCreate`. | `{ "message": string }`. | `400` student/notification invalid; `401/403/422`. |
| `GET /teachers/notifications` | List notifications for the current teacher, newest first. | None. | Array of notification objects including `is_read`. | `401/403`. |
| `PATCH /teachers/notifications/read` | Mark all unread notifications for the current teacher as read. | None. | `{ "message": string, "updated_count": number }`. | `401/403`. |
| `POST /teachers/messages` | Send a message to the admin, an assigned class, or an assigned student. | JSON `{ "target_type": "admin"|"class"|"student", "target_id": string, "subject": string, "message": string }`. | `{ "message": string, "recipient_name": string }`. | `400` recipient is invalid or not assigned; `401/403/422`. |

### Admin-managed teacher records

These `/teachers/...` routes are admin-only, not teacher self-service routes.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /teachers/` | List teacher records. | None. | Array of teacher response objects. | `401/403`. |
| `POST /teachers/` | Create a teacher record. | JSON `TeacherCreate` payload. | Teacher response object. | `409` duplicate/invalid teacher; `401/403/422`. |
| `GET /teachers/search` | Search teacher records. Query: required `full_name`. | None. | Array of teacher response objects. | `401/403/422`. |
| `GET /teachers/count` | Count teacher records. | None. | `{ "count": number }`. | `401/403`. |
| `GET /teachers/{teacher_id}` | Fetch teacher by ID. | None. | Teacher response object. | `404` not found; `401/403`. |
| `PUT /teachers/{teacher_id}` | Update teacher by ID. | JSON subset of teacher profile fields. | `{ "message": string }`. | `400` invalid update; `401/403/422`. |
| `DELETE /teachers/{teacher_id}` | Delete teacher by ID. | None. | `{ "message": string }`. | `404` not found; `401/403`. |

## Student Endpoints

The `/students/me/...` routes require a student token. Students see courses based on their class (or level when no class is assigned).

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /students/me` | Get own profile. | None. | Student response shape above. | `401/403`. |
| `PUT /students/me` | Update own profile. | JSON `StudentUpdate`. | Updated student response. | `400` no fields to update; `401/403/422`. |
| `GET /students/me/courses` | Fetch courses available to the student, including summary/material paths for PDF/image viewing. | None. | Array of `{ "id": string, "title": string, "description": string, "teacher_id": string, "class_id": string, "material_file_path": string|null }`. | `401/403`. |
| `GET /students/me/exercises` | Fetch exercises available to the student; group by `course_id` on the client. | None. | Array of `{ "id": string, "course_id": string, "course_title": string, "file_path": string, "material_file_path": string|null, "max_score": number, "score": number|null, "submission_status": string|null }`. | `401/403`. |
| `GET /students/me/submissions` | List own submissions. | None. | Array of submission response objects. | `401/403`. |
| `POST /students/me/submissions` | Submit an answer file for an exercise. This endpoint does not accept a text answer field. | Multipart form: `exercise_id` (string), `file` (uploaded file). | Submission response object with ID, status, path, score, and timestamps. | `400` invalid exercise/submission; `401/403/422`. |
| `PUT /students/me/submissions/{submission_id}` | Replace the uploaded file for own submission. | Multipart form: required `file`. | Updated submission response object. | `403` submission belongs to another student; `404` submission not found; `401/422`. |
| `DELETE /students/me/submissions/{submission_id}` | Delete own submission and stored file. | None. | `{ "message": "Submission deleted successfully." }`. | `403` submission belongs to another student; `404` not found; `401`. |
| `GET /students/me/grades` | Fetch personal graded results for tables and progress charts. Ungraded submissions are omitted. | None. | Array of `{ "submission_id": string, "score": number, "exercise_id": string, "graded_at": string|null }`. Join with exercise data for course/title/max-score chart points. | `401/403`. |
| `GET /students/me/notifications` | List notifications for the current student. | None. | Array of notification objects including `student_notification_id`, `notification_id`, `title`, `message`, `is_read`, `created_at`, sender/receiver fields, and optional `reference_link`. | `401/403`. |

### Admin-managed student records

These `/students/...` collection routes require an admin token.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /students/` | List students. | None. | Array of student response objects. | `401/403`. |
| `POST /students/` | Create student record. | JSON student create payload (not the admin student schema). | Student response object. | `409` duplicate email/record; `401/403/422`. |
| `GET /students/search` | Search students. Query: required `full_name`. | None. | Array of student response objects. | `401/403/422`. |
| `GET /students/count` | Count students. | None. | `{ "count": number }`. | `401/403`. |
| `GET /students/{student_id}` | Fetch student by ID. | None. | Student response object. | `404` not found; `401/403`. |
| `PUT /students/{student_id}` | Update student by ID. | JSON `StudentUpdate`. | `{ "message": string }`. | `400` invalid update; `401/403/422`. |
| `DELETE /students/{student_id}` | Delete student by ID. | None. | `{ "message": string }`. | `404` not found; `401/403`. |

## Courses and Exercises (Authenticated Users)

These collection/detail routes require a valid token. Write routes require a teacher token.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /courses/` | List tenant courses. This response contains no material URL; use `/students/me/courses` for student material links. | None. | Array of course response objects. | `401`; `422` on invalid auth context. |
| `POST /courses/` | Create a course through the JSON API (no file upload on this route). | JSON `CourseCreate`. | Course response object. | `400` course/class invalid; `401/403/422`. |
| `GET /courses/search` | Search courses. Query: required `query`. | None. | Array of course response objects. | `400` search rejected; `401/422`. |
| `GET /courses/count` | Count courses. | None. | `{ "count": number }`. | `401`. |
| `GET /courses/{course_id}` | Fetch course by ID. | None. | Course response object. | `404` not found; `401`. |
| `PUT /courses/{course_id}` | Update course. | JSON `CourseUpdate`. | `{ "message": string }`. | `400` update rejected; `401/403/422`. |
| `DELETE /courses/{course_id}` | Delete course. | None. | `{ "message": string }`. | `404` not found; `401/403`. |
| `GET /exercises/` | List tenant exercises. | None. | Array of exercise response objects. | `401`. |
| `POST /exercises/` | Create exercise through JSON metadata route. Teacher material upload is available at `/teachers/me/exercises`. | JSON `ExerciseCreate`. | Exercise response object. | `400` invalid course/exercise; `401/403/422`. |
| `PUT /exercises/{exercise_id}` | Update exercise metadata. | JSON `ExerciseUpdate`. | `{ "message": string }`. | `400` update rejected; `401/403/422`. |
| `DELETE /exercises/{exercise_id}` | Delete exercise. | None. | `{ "message": string }`. | `404` not found; `401/403`. |
| `GET /exercises/search` | Search exercises. Query: required `query`. | None. | Array of exercise response objects. | `400` search rejected; `401/422`. |
| `GET /exercises/count` | Count exercises. | None. | `{ "count": number }`. | `401`. |
| `GET /exercises/{exercise_id}` | Fetch exercise by ID. | None. | Exercise response object. | `404` not found; `401`. |

## Submissions (Authenticated Users)

The general submission reads require a valid token. Creation requires student; update requires teacher; deletion requires admin.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `POST /submissions/` | Alternate student file-submission endpoint. | Multipart form: `exercise_id` (string), `file` (file). | Submission response object. | `400` invalid exercise/submission; `401/403/422`. |
| `GET /submissions/` | List tenant submissions. | None. | Array of submission response objects. | `401`. |
| `GET /submissions/student/{student_id}` | List submissions for a student. | Path: `student_id`. | Array of submission response objects. | `404` no matching student/submissions; `401`. |
| `GET /submissions/exercise/{exercise_id}` | List submissions for an exercise. | Path: `exercise_id`. | Array of submission response objects. | `404` exercise/submissions not found; `401`. |
| `GET /submissions/count` | Count tenant submissions. | None. | `{ "count": number }`. | `401`. |
| `GET /submissions/{submission_id}` | Fetch one submission. | Path: `submission_id`. | Submission response object. | `404` not found; `401`. |
| `PUT /submissions/{submission_id}` | Update submission metadata/score for an exercise owned by the teacher. | JSON `SubmissionUpdate`. | `{ "message": string }`. | `403` submission's exercise belongs to another teacher; `400` update/not-found failure; `401/422`. |
| `DELETE /submissions/{submission_id}` | Delete a submission record. Admin only. | Path: `submission_id`. | `{ "message": string }`. | `404` not found; `401/403`. |

## Notifications

List/search/count/get require a valid token. Creating via `/notifications/` requires teacher. Single-notification mark-read requires student; the teacher inbox also supports bulk mark-read. Delete requires admin.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /notifications/` | List tenant notifications. | None. | Array of notification response objects. | `401`. |
| `GET /notifications/search` | Search notifications. Query: required `query`. | None. | Array of notification response objects. | `400` search rejected; `401/422`. |
| `GET /notifications/count` | Count tenant notifications. | None. | `{ "count": number }`. | `401`. |
| `GET /notifications/{notification_id}` | Fetch notification by ID. | Path: `notification_id`. | Notification response object. | `404` not found; `401`. |
| `POST /notifications/` | Teacher sends a notification to a student. `receiver_role` must be `student`. | JSON `NotificationCreate`. | `{ "message": string }`. | `400` invalid recipient/notification; `401/403/422`. |
| `PATCH /notifications/{notification_id}/read` | Mark notification as read. Student only. | Path: `notification_id`; no body. | `{ "message": string }`. | `403` non-student role; `404` not found; `401`. |
| `DELETE /notifications/{notification_id}` | Delete notification. Admin only. | Path: `notification_id`; no body. | `{ "message": string }`. | `403` non-admin role; `404` not found; `401`. |

## Parents (Administrator)

All `/parents/...` routes require an admin token.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `POST /parents/` | Create parent and optionally associate students. | JSON `{ "full_name": string, "email": string, "contact_number": string="", "student_ids": string[]=[] }`. | Parent response `{ "_id": string, "admin_id": string, "full_name": string, "email": string, "contact_number": string, "student_ids": string[] }`. | `400` invalid parent; `401/403/422`. |
| `GET /parents/` | List parents. | None. | Array of parent responses. | `401/403`. |
| `GET /parents/{parent_id}` | Fetch parent by ID. | Path: `parent_id`. | Parent response. | `404` not found; `401/403`. |
| `PATCH /parents/{parent_id}` | Partially update parent. | JSON subset of `full_name`, `email`, `contact_number`, `student_ids`. | Parent response. | `400` invalid update; `401/403/422`. |
| `POST /parents/{parent_id}/students/{student_id}` | Associate a student with a parent. | Path: `parent_id`, `student_id`; no body. | Parent response. | `400` invalid association; `401/403`. |
| `DELETE /parents/{parent_id}` | Delete parent. | Path: `parent_id`; no body. | `{ "message": "Parent deleted successfully." }`. | `404` not found; `401/403`. |

## Attendance

These routes are registered without a prefix. Teacher operations require teacher role; monthly report requires admin role.

| Method & route | Description and parameters | Request | Success response | Handler-specific errors |
|---|---|---|---|---|
| `GET /teachers/me/attendance/classes/{class_id}/students` | Get students in an assigned class for attendance. | Path: `class_id`. | Array of class student objects. | `400` class not assigned/invalid; `401/403`. |
| `POST /teachers/me/attendance` | Save attendance for a scheduled class session. | JSON `AttendanceSaveRequest`. | `{ "message": "Attendance saved successfully." }`. | `400` empty records, invalid status, duplicate student, wrong class membership, mismatched session, or invalid month/date; `401/403/422`. |
| `GET /teachers/me/attendance` | Fetch teacher attendance history. Query: optional `class_id`; optional `month` matching `YYYY-MM`. | None. | Array of `{ "student_id": string, "student_name": string|null, "class_id": string, "date": string, "session_id": string|null, "status": "present"|"absent" }`. | `400` invalid class/month; `401/403/422`. |
| `GET /admin/attendance/report` | Fetch monthly attendance records for a class. Required query: `class_id`, `month` (`YYYY-MM`). | None. | Array of attendance record objects. | `400` invalid class/month; `401/403/422`. |
| `GET /admin/attendance/report/summary` | Fetch the cumulative attendance rate for every currently enrolled student in a class. Required query: `class_id`. The session count is based on distinct `(session_id, date)` pairs; legacy records without a session ID count once per date. Unrecorded student/session entries count as absent. | None. | `{ "class_id": string, "total_sessions": number, "students": [{ "student_id": string, "student_name": string, "present_sessions": number, "absent_sessions": number, "total_sessions": number, "attendance_percentage": number }] }`. | `400` invalid class; `401/403/422`. |

## Static Files and Health Check

These are registered in `api/main.py`, not in a router module.

| Method & route | Description and parameters | Success response | Errors |
|---|---|---|---|
| `GET /` | Backend health/root message. | `{ "message": "EduAnalytics API is running" }`. | Deployment/server errors. |
| `GET /uploads/{path}` | Serves uploaded material/submission files from the configured upload directory. | File bytes with the detected media type. | `404` when the file does not exist. |

## Notes on Requested Functionalities

- **Course PDFs/images:** uploaded with `POST /teachers/me/courses`; student-facing paths are returned by `GET /students/me/courses` as `material_file_path`. The course response from the teacher upload itself does not include that path.
- **Exercises grouped by course:** `GET /students/me/exercises` returns a flat list with `course_id` and `course_title`; clients group by `course_id`.
- **Exercise submissions:** the backend accepts files only (`exercise_id` plus `file`). There is no text-answer field, `/student/exercises/submit` path, or AI feedback payload at present.
- **Grades/progression graph:** `GET /students/me/grades` returns scored submissions with `exercise_id`, `score`, and `graded_at`. Join these records with `/students/me/exercises` to obtain course title and `max_score`; there is no separate graph/progression endpoint.
- **Signup:** no public signup endpoint is implemented. Admin bootstraps through `/admin/setup` and creates credentials using `/admin/users/create`.
- **JWT delivery:** `/auth/login` returns the JWT in JSON; it does not set an HttpOnly cookie. Browser storage/security policy is a frontend concern unless a cookie/BFF login flow is added.
