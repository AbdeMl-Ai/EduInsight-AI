import asyncio
from io import BytesIO

import aiofiles
import pytest
from fastapi import UploadFile

from utils import submission_storage


def test_submission_and_material_storage_use_async_io(tmp_path, monkeypatch):
    upload_root = tmp_path / "uploads"
    monkeypatch.setattr(submission_storage, "UPLOAD_ROOT", upload_root)
    monkeypatch.setattr(
        submission_storage, "SUBMISSION_UPLOAD_DIR", upload_root / "submissions"
    )

    async def run_round_trip():
        submission = UploadFile(
            filename="submission.pdf",
            file=BytesIO(b"submission payload"),
            headers={"content-type": "application/pdf"},
        )
        submission_path = await submission_storage.save_submission_file(
            submission, "exercise-id", "student-id"
        )
        submission_file = upload_root / submission_path.removeprefix("/uploads/")
        async with aiofiles.open(submission_file, "rb") as saved_submission:
            assert await saved_submission.read() == b"submission payload"
        await submission_storage.delete_submission_file(submission_path)
        await submission_storage.delete_submission_file(submission_path)
        assert not submission_file.exists()

        material = UploadFile(
            filename="material.pdf",
            file=BytesIO(b"material payload"),
            headers={"content-type": "application/pdf"},
        )
        material_path = await submission_storage.save_material_file(
            material, "course", "course-id"
        )
        material_file = upload_root / material_path.removeprefix("/uploads/")
        async with aiofiles.open(material_file, "rb") as saved_material:
            assert await saved_material.read() == b"material payload"

    asyncio.run(run_round_trip())


def test_delete_submission_rejects_paths_outside_upload_root(tmp_path, monkeypatch):
    monkeypatch.setattr(submission_storage, "UPLOAD_ROOT", tmp_path / "uploads")

    with pytest.raises(ValueError, match="inside the upload directory"):
        asyncio.run(submission_storage.delete_submission_file("/uploads/../secret"))