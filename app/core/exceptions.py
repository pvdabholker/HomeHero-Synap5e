from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
import logging
import traceback
from typing import Union

logger = logging.getLogger(__name__)


# base exception
class HomeHeroException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


# authentication related errors
class AuthenticationError(HomeHeroException):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


# authorization related errors
class AuthorizationError(HomeHeroException):
    def __init__(self, message: str = "Access Denied"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


# resource not found errors
class NotFoundError(HomeHeroException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


# Data validation errors
class ValidationError(HomeHeroException):
    def __init__(self, message: str = "Invalid data"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)


# business logic related errors
class BusinessLogicError(HomeHeroException):
    def __init__(self, message: str = "Business logic error"):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)


# global exception handler
async def global_exception_handler(request: Request, exc: Exception):

    if isinstance(exc, HomeHeroException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.__class__.__name__,
                "message": exc.message,
                "path": request.url.path,
            },
        )

    elif isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "HTTPException",
                "message": exc.detail,
                "path": request.url.path,
            },
        )

    elif isinstance(exc, RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "ValidationError",
                "message": "Invalid request data",
                "details": exc.errors(),
                "path": request.url.path,
            },
        )

    elif isinstance(exc, SQLAlchemyError):
        logger.error(f"Database error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "DatabaseError",
                "message": "Database operation failed",
                "path": request.url.path,
            },
        )

    else:
        # log unexpected errors
        logger.error(f"Unexpected error: {str(exc)}")
        logger.error(f"Traceback: {traceback.format_exc()}")

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "InternalServerError",
                "message": "An unexpected error occurred",
                "path": request.url.path,
            },
        )
