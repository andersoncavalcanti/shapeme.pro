from .categories import router as categories_router
from .recipes import router as recipes_router
from .admin import router as admin_router

__all__ = ["categories_router", "recipes_router", "admin_router"]