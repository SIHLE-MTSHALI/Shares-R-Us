from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.app.core.security import create_access_token
from backend.app.utils.password import verify_password, hash_password
from backend.app.schemas.user import UserCreate, User, PasswordReset
from backend.app.crud.user import create_user, get_user_by_email, update_user_password
from backend.app.db.session import get_db
from backend.app.utils.email import send_reset_email
from backend.app.utils.security import create_reset_token, decode_reset_token

router = APIRouter()

@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

@router.post("/token", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/password-reset")
async def password_reset(request: PasswordReset, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    reset_token = create_reset_token(data={"sub": user.email})
    send_reset_email(user.email, reset_token)
    return {"msg": "Password reset email sent"}

@router.post("/password-reset/{token}")
async def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    email = decode_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hashed_password = hash_password(new_password)
    update_user_password(db, user, hashed_password)
    return {"msg": "Password updated successfully"}
