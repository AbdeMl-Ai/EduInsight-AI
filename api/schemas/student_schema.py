from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator, model_validator

from utils.academic_catalog import normalize_academic_level


class StudentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    student_id: str = Field(validation_alias=AliasChoices("student_id", "id", "_id"))
    admin_id: str
    parent_id: str | None = None
    full_name: str
    age: int = 0
    level_academy: str = ""
    date_enjoined: datetime | None = None
    email: str
    phone_number: str = ""
    level: str = ""
    class_id: str | None = None
    class_ids: list[str] = Field(default_factory=list)


class StudentCreate(BaseModel):
    full_name: str
    email: str
    phone_number: str = ""
    age: int = 0
    level_academy: str = Field(validation_alias=AliasChoices("level_academy", "level"))
    parent_id: str | None = None
    class_id: str | None = None
    class_ids: list[str] = Field(default_factory=list)

    @field_validator("level_academy")
    @classmethod
    def validate_level(cls, value: str) -> str:
        return normalize_academic_level(value)

    @model_validator(mode="before")
    @classmethod
    def include_legacy_class_id(cls, value):
        if not isinstance(value, dict):
            return value
        data = dict(value)
        class_ids = list(data.get("class_ids") or [])
        class_id = data.get("class_id")
        if class_id is not None and all(str(item) != str(class_id) for item in class_ids):
            class_ids.insert(0, class_id)
        data["class_ids"] = list(dict.fromkeys(class_ids))
        return data


class StudentUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone_number: str | None = None
    age: int | None = None
    level_academy: str | None = Field(default=None, validation_alias=AliasChoices("level_academy", "level"))
    parent_id: str | None = None
    class_id: str | None = None
    class_ids: list[str] | None = None

    @field_validator("level_academy")
    @classmethod
    def validate_level(cls, value: str | None) -> str | None:
        return normalize_academic_level(value) if value is not None else None

    @model_validator(mode="before")
    @classmethod
    def include_legacy_class_id(cls, value):
        if not isinstance(value, dict):
            return value
        data = dict(value)
        class_id = data.get("class_id")
        class_ids = data.get("class_ids")
        if class_id is not None:
            class_ids = list(class_ids or [])
            if all(str(item) != str(class_id) for item in class_ids):
                class_ids.insert(0, class_id)
            data["class_ids"] = list(dict.fromkeys(class_ids))
        return data