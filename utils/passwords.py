from pwdlib import PasswordHash
from pwdlib.exceptions import UnknownHashError
from pwdlib.hashers.bcrypt import BcryptHasher


_password_hash = PasswordHash((BcryptHasher(),))


def hash_password(password: str) -> str:
    return _password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return _password_hash.verify(password, hashed_password)
    except UnknownHashError:
        return False
