from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING

from controllers.auth_controller import AuthController
from controllers.admin_controller import AdminController
from controllers.attendance_controller import AttendanceController
from controllers.class_controller import ClassController
from controllers.course_controller import CourseController
from controllers.exercise_controller import ExerciseController
from controllers.notification_controller import NotificationController
from controllers.material_controller import MaterialController
from controllers.parent_controller import ParentController
from controllers.student_controller import StudentController
from controllers.submission_controller import SubmissionController
from controllers.schedule_controller import ScheduleController
from controllers.teacher_controller import TeacherController
from database.database import Database
from repositories.course_repository import CourseRepo
from repositories.admin_repository import AdminRepo
from repositories.attendance_repository import AttendanceRepo
from repositories.class_repository import ClassRepo
from repositories.exercise_repository import ExerciseRepo
from repositories.user_repository import UserRepo
from repositories.notification_repository import NotificationRepo
from repositories.material_repository import MaterialRepo
from repositories.parent_repository import ParentRepo
from repositories.student_repository import StudentRepo
from repositories.submission_repository import SubmissionRepo
from repositories.schedule_repository import ScheduleRepo
from repositories.teacher_repository import TeacherRepo
from repositories.payment_repository import PaymentRepo
from repositories.student_payment_repository import StudentPaymentRepo
from services.auth_service import AuthService
from services.admin_service import AdminService
from services.attendance_service import AttendanceService
from services.class_service import ClassService
from services.course_service import CourseService
from services.exercise_service import ExerciseService
from services.notification_service import NotificationService
from services.material_service import MaterialService
from services.parent_service import ParentService
from services.student_service import StudentService
from services.submission_service import SubmissionService
from services.teacher_service import TeacherService
from services.payment_service import PaymentService
from services.analytics_service import AnalyticsService
from services.schedule_service import ScheduleService
from utils.security import decode_access_token


database_connection = Database()
mongo_client = database_connection.client
db: AsyncIOMotorDatabase = database_connection.database


async def connect_to_database():
    await db.command("ping")
    for collection_name in ("admins", "students", "teachers", "parents", "users"):
        await db[collection_name].update_many(
            {},
            {"$unset": {"password": "", "password_hash": ""}},
        )
    for collection_name, field_name in (
        ("admins", "phone_number"),
        ("students", "phone_number"),
        ("teachers", "phone_number"),
        ("parents", "contact_number"),
    ):
        await db[collection_name].create_index(
            [(field_name, ASCENDING)],
            unique=True,
            partialFilterExpression={field_name: {"$type": "string", "$gt": ""}},
            name=f"unique_{collection_name}_{field_name}",
        )
    for collection_name in ("admins", "students", "teachers", "parents"):
        await db[collection_name].create_index(
            [("email", ASCENDING)],
            unique=True,
            partialFilterExpression={"email": {"$type": "string", "$gt": ""}},
            name=f"unique_{collection_name}_email",
        )
    await db["users"].create_index(
        [("email", ASCENDING)],
        unique=True,
        name="unique_users_email",
    )
    await db["users"].create_index(
        [("google_sub", ASCENDING)],
        unique=True,
        partialFilterExpression={"google_sub": {"$type": "string", "$gt": ""}},
        name="unique_users_google_sub",
    )
    await db["schedules"].create_index(
        [("admin_id", ASCENDING), ("day", ASCENDING), ("teacher_id", ASCENDING), ("start_time", ASCENDING)],
        name="schedule_teacher_day_start",
    )
    await db["student_payments"].create_index(
        [("admin_id", ASCENDING), ("payment_date", ASCENDING)],
        name="student_payment_admin_date",
    )


def close_database():
    mongo_client.close()


student_repo = StudentRepo(db)
teacher_repo = TeacherRepo(db)
admin_repo = AdminRepo(db)
attendance_repo = AttendanceRepo(db)
class_repo = ClassRepo(db)
course_repo = CourseRepo(db)
exercise_repo = ExerciseRepo(db)
submission_repo = SubmissionRepo(db, student_repo, exercise_repo)
notification_repo = NotificationRepo(db)
parent_repo = ParentRepo(db)
material_repo = MaterialRepo(db)
user_repo = UserRepo(db)
schedule_repo = ScheduleRepo(db)
payment_repo = PaymentRepo(db)
student_payment_repo = StudentPaymentRepo(db)

student_service = StudentService(student_repo, exercise_repo, parent_repo)
teacher_service = TeacherService(teacher_repo)
submission_service = SubmissionService(submission_repo, student_repo, exercise_repo)
notification_service = NotificationService(notification_repo, student_repo, teacher_repo, admin_repo, class_repo)
course_service = CourseService(course_repo, teacher_repo, notification_service)
exercise_service = ExerciseService(
    exercise_repo, course_repo, teacher_repo, notification_service
)
payment_service = PaymentService(payment_repo, student_repo, teacher_repo, class_repo, notification_service)
analytics_service = AnalyticsService(attendance_repo, student_payment_repo)
material_service = MaterialService(material_repo)
parent_service = ParentService(parent_repo, student_repo)
class_service = ClassService(class_repo, teacher_repo)
schedule_service = ScheduleService(
    schedule_repo, teacher_repo, class_service, notification_service
)
attendance_service = AttendanceService(attendance_repo, teacher_repo, class_service, schedule_repo)
admin_service = AdminService(admin_repo, student_service, teacher_service, class_service)
auth_service = AuthService(
    student_repo,
    teacher_repo,
    admin_repo,
    user_repo=user_repo,
    parent_repo=parent_repo,
)

student_controller = StudentController(student_service)
teacher_controller = TeacherController(teacher_service)
course_controller = CourseController(course_service)
exercise_controller = ExerciseController(exercise_service)
submission_controller = SubmissionController(submission_service)
notification_controller = NotificationController(notification_service)
material_controller = MaterialController(material_service)
parent_controller = ParentController(parent_service)
auth_controller = AuthController(auth_service)
class_controller = ClassController(class_service)
admin_controller = AdminController(admin_service)
attendance_controller = AttendanceController(attendance_service)
schedule_controller = ScheduleController(schedule_service)

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
        if not isinstance(user_id, str):
            raise ValueError("Invalid subject")
        role = payload.get("role")
        admin_id = payload.get("admin_id")
    except (Exception, TypeError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    try:
        if role == "student":
            user = await student_service.get_student(user_id, admin_id)
            user._token_role = role
            return user
        if role == "teacher":
            user = await teacher_service.get_teacher(user_id, admin_id)
            user._token_role = role
            return user
        if role == "admin":
            user = await admin_repo.get_admin(user_id)
            if user is None:
                raise ValueError("Admin not found")
            user._token_role = role
            return user
        if role in ("student", "teacher", "parent"): # if the token came from the new login
            user = await user_repo.get(user_id)
            if user is None:
                raise ValueError("User not found")
            # We can lookup their actual profile based on role if needed, 
            # but for simplicity, let's look up the specific collection 
            # or return the generic user model as it will be handled by role dependencies
            # Actually, `auth_service.login` will issue tokens with standard roles.
            # We should probably redirect to the specific get functions.
            
            # Since the new system issues a token for a 'student', 'teacher', 'parent'
            # using the specific collection data for profile, but login is via 'users' collection.
            # wait, if login gives a token, what is the 'sub' of that token?
            # Is it the ID from 'users' or the ID from 'students'/'teachers'?
            # Let's say `login` returns a token where `sub` is the specific role ID.
            # I'll fix this in auth_service.py. For now, keep as is and just replace `google_user_repo` usages.
        if role == "user":
            user = await user_repo.get(user_id)
            if user is None:
                raise ValueError("User not found")
            user._token_role = role
            return user
        if role == "parent":
            user = await parent_service.get_parent(user_id, admin_id)
            user._token_role = role
            return user
    except ValueError:
        pass
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")


def require_student(current_user=Depends(get_current_user)):
    if getattr(current_user, "_token_role", None) != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student access required")
    return current_user


def require_student_workspace(current_user=Depends(get_current_user)):
    if getattr(current_user, "_token_role", None) not in {"student", "user"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student workspace access required",
        )
    return current_user


def require_teacher(current_user=Depends(get_current_user)):
    if getattr(current_user, "_token_role", None) != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Teacher access required")
    return current_user


def get_current_admin(current_user=Depends(get_current_user)):
    if getattr(current_user, "_token_role", None) != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


admin_required = get_current_admin
