from utils.security import create_access_token
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(
        self,
        student_repo,
        teacher_repo,
        admin_repo,
        user_repo=None,
        parent_repo=None,
    ):
        self.student_repo = student_repo
        self.teacher_repo = teacher_repo
        self.admin_repo = admin_repo
        self.user_repo = user_repo
        self.parent_repo = parent_repo

    async def login_with_google(self, profile: dict[str, object]) -> dict[str, str]:
        email = str(profile["email"]).strip().lower()
        
        admin = await self.admin_repo.get_admin_by_email(email)
        if not admin:
            raise ValueError("Only Admins can log in via Google OAuth.")
        
        payload = {"sub": str(admin.id), "role": "admin"}
        return self._token_response(payload, "admin")

    async def login(self, email: str, password: str) -> dict[str, str]:
        email = email.strip().lower()
        
        user = await self.user_repo.get_by_email(email)
        if not user or not pwd_context.verify(password, user.hashed_password):
            raise ValueError("Invalid email or password")
            
        role = user.role
        
        if role == "student":
            account = await self.student_repo.get_student_by_email(email)
        elif role == "teacher":
            account = await self.teacher_repo.get_teacher_by_email(email)
        elif role == "parent":
            account = await self.parent_repo.get_parent_by_email(email)
        elif role == "admin":
            account = await self.admin_repo.get_admin_by_email(email)
        else:
            raise ValueError(f"Unknown role: {role}")
            
        if not account:
            raise ValueError(f"User profile for {email} with role {role} not found.")

        payload = {"sub": str(account.id), "role": role}
        if role != "admin":
            payload["admin_id"] = account.admin_id
            
        return self._token_response(payload, role)

    @staticmethod
    def _token_response(payload: dict[str, str], role: str) -> dict[str, str]:
        return {
            "access_token": create_access_token(payload),
            "token_type": "bearer",
            "role": role,
        }

