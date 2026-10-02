from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import aiofiles
import aiofiles.os
from fastapi import UploadFile


UPLOAD_ROOT = Path(__file__).resolve().parent.parent / "uploads"
SUBMISSION_UPLOAD_DIR = UPLOAD_ROOT / "submissions"
ALLOWED_SUBMISSION_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
}
ALLOWED_MATERIAL_TYPES = ALLOWED_SUBMISSION_TYPES


async def _save_upload(file: UploadFile, destination: Path) -> None:
    await aiofiles.os.makedirs(destination.parent, exist_ok=True)
    try:
        async with aiofiles.open(destination, "wb") as output_file:
            while chunk := await file.read(1024 * 1024):
                await output_file.write(chunk)
    except BaseException:
        try:
            await aiofiles.os.unlink(destination)
        except FileNotFoundError:
            pass
        raise


async def save_submission_file(
    file: UploadFile,
    exercise_id: str,
    student_id: str,
) -> str:
    extension = ALLOWED_SUBMISSION_TYPES.get(file.content_type)
    if extension is None:
        raise ValueError("Only PDF, JPEG, and PNG files are allowed.")

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    filename = (
        f"exercise_{exercise_id}_student_{student_id}_"
        f"{timestamp}_{uuid4().hex}{extension}"
    )
    destination = SUBMISSION_UPLOAD_DIR / filename

    await _save_upload(file, destination)

    return f"/uploads/submissions/{filename}"


async def delete_submission_file(file_path: str) -> None:
    relative_path = Path(file_path.removeprefix("/uploads/"))
    if (
        relative_path.is_absolute()
        or not relative_path.parts
        or ".." in relative_path.parts
    ):
        raise ValueError("Upload path must remain inside the upload directory.")
    destination = UPLOAD_ROOT / relative_path
    try:
        await aiofiles.os.unlink(destination)
    except FileNotFoundError:
        pass


async def save_material_file(file: UploadFile, owner_type: str, owner_id: str) -> str:
    extension = ALLOWED_MATERIAL_TYPES.get(file.content_type)
    if extension is None:
        raise ValueError("Only PDF, JPEG, and PNG files are allowed.")

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    filename = f"{owner_type}_{owner_id}_{timestamp}_{uuid4().hex}{extension}"
    destination = UPLOAD_ROOT / "materials" / filename
    await _save_upload(file, destination)
    return f"/uploads/materials/{filename}"