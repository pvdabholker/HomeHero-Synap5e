import structlog
import logging
import sys
from typing import Any, Dict
import json
from datetime import datetime, timezone

from app.core.config import settings


# Configure structured logging
def setup_logging():

    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="ISO"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # configure standard logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    )

    # set specific loggers
    logging.getLogger("uvicorn.access").disabled = True
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.WARNING if settings.ENVIRONMENT == "production" else logging.INFO
    )


# get structured logger instance
def get_logger(name: str = None) -> structlog.stdlib.BoundLogger:
    return structlog.get_logger(name)


# Middleware to log requests and responses
class LoggerMiddleware:
    def __init__(self, app):
        self.app = app
        self.logger = get_logger("api")

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request_logger = self.logger.bind(
                method=scope["method"],
                path=scope["path"],
                query_string=scope["query_string"].decode(),
                client=scope["client"][0] if scope["client"] else None,
                timestamp=datetime.now(timezone.utc),
            )

            # log request
            request_logger.info("Request started")

            status_code = 200

            async def send_wrapper(message):
                nonlocal status_code
                if message["type"] == "http.response.start":
                    status_code = message["status"]
                await send(message)

            try:
                await self.app(scope, receive, send_wrapper)
                request_logger.bind(status_code=status_code).info("Request completed")
            except Exception as e:
                request_logger.bind(
                    status_code=status_code, error=str(e), error_type=type(e).__name__
                ).error("Request failed")

        else:
            await self.app(scope, receive, send)
