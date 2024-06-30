from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate
from backend.app.utils.password import get_password_hash

def create_user(db: Session, user: UserCreate):
    """
    Create a new user in the database.
    """
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    """
    Get a user by email.
    """
    return db.query(User).filter(User.email == email).first()

def update_user_password(db: Session, user: User, new_password: str):
    """
    Update the user's password.
    """
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    return user