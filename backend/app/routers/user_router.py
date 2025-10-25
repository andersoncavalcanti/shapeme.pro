from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.user import UserCreate, UserResponse, UserBase
from ..models import User
from ..security import get_password_hash
from ..services.user_service import get_user_by_email, create_user as create_user_service

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já registrado")
    return create_user_service(db=db, user=user, is_admin=False)

@router.post("/admin", response_model=UserResponse)
async def create_admin_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já registrado")
    return create_user_service(db=db, user=user, is_admin=True)

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
