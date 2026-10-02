# Student Frontend Guide

This document describes the dedicated student experience in the Next.js frontend, where its code lives, how it gets data, and how to use its structure when building the teacher experience.

## Student Route Map

The student experience uses the Next.js App Router under `app/student/`:

| Route | File | What it does |
| --- | --- | --- |
| `/student` | `app/student/page.tsx` | Redirects to `/student/home`. |
| `/student/home` | `app/student/home/page.tsx` | Loads the student's profile, exercises, and grades; displays a greeting, graded-exercise progress, and shortcuts to other student pages. |
| `/student/courses` | `app/student/courses/page.tsx` | Lists assigned courses and opens attached PDF/image material in a modal. |
| `/student/exercises` | `app/student/exercises/page.tsx` | Groups exercises by course, shows materials and submission status, and supports submitting or replacing PDF/JPEG/PNG files. |
| `/student/grades` | `app/student/grades/page.tsx` | Combines grades with exercise metadata, displays score history, and charts dated scores. |
| `/student/notifications` | `app/student/notifications/page.tsx` | Lists student notifications and lets the student mark a notification as read. |
| `/student/profile` | `app/student/profile/page.tsx` | Displays the student's name, email, academic level, and age. |

All these routes are wrapped by `app/student/layout.tsx`. It supplies the student portal shell, active navigation state, a desktop sidebar, and mobile bottom navigation. `app/template.tsx` provides the shared page transition animation.

## Files and Responsibilities

```text
app/
  student/
    layout.tsx                 Shared student navigation and page shell
    page.tsx                   Redirect from /student to /student/home
    home/page.tsx              Student summary and progress
    courses/page.tsx           Course list and material viewer
    exercises/page.tsx         Coursework and file submissions
    grades/page.tsx            Grade history and chart
    notifications/page.tsx     Notifications and read state
    profile/page.tsx           Student profile details
  template.tsx                 Shared route transition
lib/
  student-api.ts               Student API types, requests, URL/error helpers
  axios.ts                     Shared Axios client, bearer token, 401 handling
components/
  student/StudentWorkspace.tsx Older role-based workspace wrapper
  app/LegacyApp.tsx             Older shared student/teacher/admin application
```

The `app/student/*/page.tsx` files are the dedicated student implementation. `components/student/StudentWorkspace.tsx` instead wraps the older role-based `ConnectedApp`; it is not what the `/student` route currently renders because that route redirects to `/student/home`.

## Data and Authentication Flow

`lib/student-api.ts` owns the student-facing TypeScript data shapes and request functions. Page components call those functions instead of constructing endpoint URLs directly. It also contains:

- `getApiErrorMessage`, which extracts useful FastAPI validation or detail messages.
- `getStudentAssetUrl`, which turns a stored material path into a browser URL.
- Types for student profiles, courses, exercises, submissions, grades, and notifications.

`lib/axios.ts` creates the shared Axios client. In the browser it sends requests through `/api-proxy`; on the server it uses `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE_URL` (defaulting to `http://127.0.0.1:8000`). It reads `eduinsight_access_token` from `localStorage` and attaches it as a bearer token. On a 401 response it clears the stored token and role, then navigates to `/login`.

Student API calls used by the pages:

| Frontend function | Backend request | Purpose |
| --- | --- | --- |
| `getStudentProfile` | `GET /students/me` | Profile and dashboard greeting. |
| `getStudentCourses` | `GET /students/me/courses` | Assigned courses and material paths. |
| `getStudentExercises` | `GET /students/me/exercises` | Assigned coursework and scores. |
| `getStudentSubmissions` | `GET /students/me/submissions` | Existing submissions for exercise actions. |
| `createStudentSubmission` | `POST /students/me/submissions` | Multipart upload with `exercise_id` and `file`. |
| `replaceStudentSubmission` | `PUT /students/me/submissions/{submission_id}` | Multipart replacement upload with `file`. |
| `getStudentGrades` | `GET /students/me/grades` | Graded submissions. |
| `getStudentNotifications` | `GET /students/me/notifications` | Student notifications. |
| `markStudentNotificationRead` | `PATCH /notifications/{notification_id}/read` | Marks a notification as read. |

The FastAPI routes are in `api/routes/student_router.py`; they use `require_student` for student-only data and actions. The frontend should therefore be opened with a valid student bearer token.

## Page Behavior and UI States

- Pages that fetch data show a loading state, a readable error state, and a retry action where appropriate. Empty collections have their own messages.
- Data-fetching effects pass an `AbortSignal` and abort requests when a page unmounts.
- The home page calculates progress as exercises with a corresponding grade divided by all assigned exercises. It is a frontend summary, not a separate backend progress endpoint.
- Courses opens material in a modal. Image paths render as images; other material paths are embedded as documents.
- Exercises accepts PDF, JPEG, and PNG files in the browser. If the student already has a submission for an exercise, the action replaces that submission; otherwise it creates one. The backend also validates uploads, so the frontend check is not the security boundary.
- Grades joins grade records to exercises to obtain course titles, exercise labels, and maximum scores for the chart and history.
- Notifications update their local read state after the read request succeeds.

## Visual and Component Patterns

The student shell uses a near-black background, muted white text, and a restrained gold accent. Navigation and content adapt to viewport size: a fixed sidebar on desktop and a fixed bottom tab bar on mobile. Page sections use small rounded borders, compact headings, Lucide icons, and Framer Motion entrance transitions. Keep the same shell and state patterns if the teacher portal is meant to feel like part of this product; teacher-specific navigation and data should stay separate from the student area.

## Starting the Teacher Experience

There is already an `app/teacher/page.tsx`, but it currently renders `components/teacher/TeacherWorkspace.tsx`, which wraps the older `ConnectedApp` from `components/app/LegacyApp.tsx`. It is not a set of dedicated teacher routes parallel to `app/student/` yet. The old `components/teacher/TeacherWorkspace.tsx` and `components/student/StudentWorkspace.tsx` are role wrappers around that shared application.

The FastAPI teacher endpoints are in `api/routes/teacher_router.py`. Useful authenticated endpoints for a dedicated teacher portal include:

| Teacher task | Backend request |
| --- | --- |
| Profile and assigned classes | `GET /teachers/me`, `GET /teachers/me/classes` |
| Update profile | `PUT /teachers/me` |
| List/create courses | `GET /teachers/me/courses`, `POST /teachers/me/courses` |
| List/create exercises | `GET /teachers/me/exercises`, `POST /teachers/me/exercises` |
| View assigned students | `GET /teachers/me/students` |
| Review submissions | `GET /teachers/me/submissions` |
| Score a submission | `PATCH /teachers/me/submissions/{submission_id}/score` |
| View grades | `GET /teachers/me/grades` |
| Notify a class or student | `POST /teachers/me/notifications`, `POST /teachers/me/notifications/{student_id}` |

Suggested implementation sequence:

1. Add a dedicated `app/teacher/layout.tsx` with teacher navigation and a responsive shell, following the structural role of `app/student/layout.tsx`.
2. Create teacher routes such as `/teacher/home`, `/teacher/courses`, `/teacher/exercises`, `/teacher/submissions`, `/teacher/students`, `/teacher/grades`, and `/teacher/notifications` under `app/teacher/`.
3. Add `lib/teacher-api.ts` with teacher-specific response types and request functions. Reuse the shared Axios client from `lib/axios.ts` so bearer-token and 401 behavior remain consistent.
4. Implement each page with the student pages' loading, error, empty, retry, and responsive-layout conventions, but use the teacher endpoint and permission boundaries.
5. Update login/role redirect behavior to send teacher accounts into the dedicated teacher route tree, then test each page with a teacher token and assigned classes.

For uploads, the teacher course and exercise creation endpoints use multipart form data. Course creation accepts `title`, `class_id`, `description`, and an optional `file`; exercise creation accepts `course_id`, `max_score`, and a required `file`. Scoring uses a multipart `score` field.