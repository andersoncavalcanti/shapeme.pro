from sqlalchemy.orm import Session

from ..models import User
from ..schemas.user import UserCreate
from ..security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, is_admin: bool = False):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        hotmart_transaction_id=user.hotmart_transaction_id,
        is_admin=is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
