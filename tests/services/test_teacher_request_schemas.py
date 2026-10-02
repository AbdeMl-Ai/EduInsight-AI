from api.schemas.course_schema import TeacherCourseCreate
from api.schemas.exercise_schema import TeacherExerciseCreate
from utils.validation_course import CourseValidator


def test_teacher_course_request_does_not_accept_teacher_id():
    request = TeacherCourseCreate(
        title="Algebra",
        class_id="class-id",
    )

    assert not hasattr(request, "teacher_id")
    assert request.class_id == "class-id"


def test_teacher_exercise_request_accepts_max_score():
    request = TeacherExerciseCreate(
        course_id="course-id",
        max_score=25,
    )

    assert request.max_score == 25


def test_course_accepts_existing_class_name_as_level():
    CourseValidator.Validation_level("Class A")