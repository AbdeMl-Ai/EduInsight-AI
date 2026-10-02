from pydantic import BaseModel, ConfigDict, Field


class ParentCreate(BaseModel):
    full_name: str
    email: str
    contact_number: str = ""
    student_ids: list[str] = Field(default_factory=list)


class ParentUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    contact_number: str | None = None
    student_ids: list[str] | None = None


class ParentResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    admin_id: str
    full_name: str
    email: str
    contact_number: str
    student_ids: list[str]
