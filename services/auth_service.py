from utils.security import create_access_token
from utils.passwords import verify_password


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
        subject = str(profile["sub"])

        accounts = []
        for role, repository, lookup in (
            ("admin", self.admin_repo, "get_admin_by_email"),
            ("student", self.student_repo, "get_student_by_email"),
            ("teacher", self.teacher_repo, "get_teacher_by_email"),
            ("parent", self.parent_repo, "get_parent_by_email"),
        ):
            if repository is None:
                continue
            account = await getattr(repository, lookup)(email)
            if account is not None:
                accounts.append((role, account))

        if len(accounts) > 1:
            raise ValueError("This email is associated with multiple application accounts.")
        if accounts:
            role, account = accounts[0]
            payload = {"sub": str(account.id), "role": role}
            if role != "admin":
                payload["admin_id"] = str(account.admin_id)
            return self._token_response(payload, role)

        admin = await self.admin_repo.get_or_create_registered_admin(
            email=email,
            full_name=str(profile.get("name") or email.split("@", 1)[0]).strip(),
        )
        user = await self.user_repo.get_or_create(
            email=email,
            full_name=admin.full_name,
            google_sub=subject,
            role="admin",
            admin_id=admin.id,
        )
        if getattr(user, "role", None) != "admin":
            raise ValueError(f"User profile for {email} is not an administrator.")

        payload = {"sub": str(admin.id), "role": "admin"}
        return self._token_response(payload, "admin")

    async def login(self, email: str, password: str) -> dict[str, str]:
        email = email.strip().lower()
        
        user = await self.user_repo.get_by_email(email)
        if not user:
            raise ValueError("Invalid email or password")

        if user.account_status in {"inactive", "disabled", "suspended"}:
            raise ValueError("This account is inactive.")
        if not user.hashed_password or not verify_password(
            password, user.hashed_password
        ):
            raise ValueError("Invalid email or password")

        role = user.role
        if role == "user":
            if user.account_status == "pending":
                await self.user_repo.activate_registered_user(str(user.id))
            return self._token_response(
                {"sub": str(user.id), "role": "user"},
                "user",
            )

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
