import os
import traceback

from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, HTTPException, Request, status, Depends
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from api.dependencies import auth_controller
from api.schemas.auth_schema import LoginResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        return await auth_controller.login(form_data.username, form_data.password)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error))

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


@router.get("/google/login", name="google_login")
async def google_login(request: Request):
    if not _google_credentials_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured.",
        )

    # ── DEBUG: Use 127.0.0.1 to match Google Console exactly ──
    redirect_uri = os.getenv(
        "GOOGLE_CALLBACK_URL",
        "http://127.0.0.1:8000/auth/google/callback",
    )
    auto_uri = str(request.url_for("google_callback"))
    print(f"[DEBUG google_login] GOOGLE_CALLBACK_URL env = {os.getenv('GOOGLE_CALLBACK_URL')!r}")
    print(f"[DEBUG google_login] redirect_uri sent to Google = {redirect_uri!r}")
    print(f"[DEBUG google_login] request.url_for('google_callback') = {auto_uri!r}")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", response_model=None, name="google_callback")
async def google_callback(request: Request):
    # ── Step 1: Log the exact incoming request URL ──
    print(f"\n{'='*60}")
    print(f"[DEBUG google_callback] request.url = {request.url}")
    print(f"[DEBUG google_callback] request.query_params = {dict(request.query_params)}")

    # ── Step 2: Inspect session state (catches "state mismatch" issues) ──
    session_state = request.session.get("_state_google_")
    query_state = request.query_params.get("state")
    print(f"[DEBUG google_callback] session '_state_google_' = {session_state!r}")
    print(f"[DEBUG google_callback] query param 'state' = {query_state!r}")
    if session_state and query_state:
        # Authlib stores the state data as a dict; the key inside is the state value
        if isinstance(session_state, dict) and query_state not in session_state:
            print(f"[WARNING] State MISMATCH! Query state {query_state!r} not found in session state keys {list(session_state.keys())}")
        else:
            print(f"[DEBUG google_callback] State looks OK")
    elif not session_state:
        print(f"[WARNING] No '_state_google_' in session — SessionMiddleware may be misconfigured or cookies lost")

    # ── Step 3: Exchange auth code for tokens (NO try/except — let it crash) ──
    print(f"[DEBUG google_callback] Calling authorize_access_token()...")
    token = await oauth.google.authorize_access_token(request)
    print(f"[DEBUG google_callback] Token response keys = {list(token.keys()) if isinstance(token, dict) else type(token)}")
    print(f"[DEBUG google_callback] Full token response = {token}")

    # ── Step 4: Extract user profile ──
    profile = token.get("userinfo")
    print(f"[DEBUG google_callback] userinfo from token = {profile}")

    if not isinstance(profile, dict):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google did not return a valid user profile. Got type={type(profile)}, value={profile!r}",
        )

    email = profile.get("email")
    subject = profile.get("sub")
    email_verified = profile.get("email_verified")
    print(f"[DEBUG google_callback] email={email!r}, sub={subject!r}, email_verified={email_verified!r}")

    if (
        not isinstance(email, str)
        or not email.strip()
        or not isinstance(subject, str)
        or not subject
        or email_verified is not True
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"A verified Google email is required. email={email!r}, sub={subject!r}, email_verified={email_verified!r}",
        )

    # ── Step 5: Database login/create (NO try/except — let it crash) ──
    print(f"[DEBUG google_callback] Calling auth_controller.login_with_google(profile)...")
    result = await auth_controller.login_with_google(profile)
    print(f"[DEBUG google_callback] login_with_google result = {result}")

    # ── Step 6: Redirect or return ──
    frontend_redirect = os.getenv("FRONTEND_AUTH_REDIRECT_URL")
    if frontend_redirect:
        fragment = (
            f"access_token={result['access_token']}"
            f"&token_type={result['token_type']}&role={result['role']}"
        )
        target = f"{frontend_redirect}#{fragment}"
        print(f"[DEBUG google_callback] Redirecting to frontend: {target}")
        return RedirectResponse(target)
    print(f"[DEBUG google_callback] Returning JSON result")
    return result
