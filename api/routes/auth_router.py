import logging
import os

from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError

from api.dependencies import auth_controller, user_repo
from api.schemas.auth_schema import LoginResponse, RegistrationRequest
from utils.passwords import hash_password

router = APIRouter(prefix="/auth", tags=["authentication"])
logger = logging.getLogger(__name__)


@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        return await auth_controller.login(form_data.username, form_data.password)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error))


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: RegistrationRequest):
    try:
        if await user_repo.get_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        user = await user_repo.create(
            email=data.email,
            full_name=data.full_name,
            role="user",
            hashed_password=hash_password(data.password),
            phone_number=data.phone_number,
            account_status="pending",
        )
    except DuplicateKeyError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from error
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unexpected error while creating a registration account")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create your account. Please try again later.",
        ) from None

    return {
        "message": "Account created. An administrator must assign your workspace access.",
        "email": user.email,
        "account_status": "pending",
    }


oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def _google_credentials_configured() -> bool:
    return bool(os.getenv("GOOGLE_CLIENT_ID") and os.getenv("GOOGLE_CLIENT_SECRET"))


def _google_callback_uri() -> str:
    callback_url = os.getenv("GOOGLE_CALLBACK_URL")
    if callback_url:
        return callback_url

    render_url = os.getenv("RENDER_EXTERNAL_URL")
    if render_url:
        return f"{render_url.rstrip('/')}/auth/google/callback"

    environment = os.getenv(
        "APP_ENV", os.getenv("ENVIRONMENT", os.getenv("NODE_ENV", ""))
    ).lower()
    if os.getenv("VERCEL") or environment in {"prod", "production"}:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Set GOOGLE_CALLBACK_URL to the public FastAPI callback URL.",
        )
    return "http://localhost:8000/auth/google/callback"


@router.get("/google/login", name="google_login")
async def google_login(request: Request):
    if not _google_credentials_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured.",
        )

    return await oauth.google.authorize_redirect(request, _google_callback_uri())


@router.get("/google/callback", response_model=None, name="google_callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    profile = token.get("userinfo")

    if not isinstance(profile, dict):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google did not return a valid user profile.",
        )

    email = profile.get("email")
    subject = profile.get("sub")
    if (
        not isinstance(email, str)
        or not email.strip()
        or not isinstance(subject, str)
        or not subject
        or profile.get("email_verified") is not True
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A verified Google email is required.",
        )

    result = await auth_controller.login_with_google(profile)
    frontend_redirect = os.getenv("FRONTEND_AUTH_REDIRECT_URL")
    if frontend_redirect:
        fragment = (
            f"access_token={result['access_token']}"
            f"&token_type={result['token_type']}&role={result['role']}"
        )
        return RedirectResponse(f"{frontend_redirect}#{fragment}")
    return result
