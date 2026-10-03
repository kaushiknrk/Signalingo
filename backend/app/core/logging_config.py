import logging
import os
from datetime import datetime

# Setup logs directory
logs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")
os.makedirs(logs_dir, exist_ok=True)
security_log_file = os.path.join(logs_dir, "security.log")

# Configure logger
logger = logging.getLogger("signalingo_security")
logger.setLevel(logging.INFO)

# File handler
fh = logging.FileHandler(security_log_file)
fh.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [SECURITY]: %(message)s')
fh.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(fh)

def log_security_event(event_type: str, user_email: str, details: str, status: str = "SUCCESS"):
    """
    Log a security-relevant event without exposing sensitive credentials (passwords, tokens).
    """
    log_msg = f"Event={event_type} | User={user_email} | Status={status} | Details={details}"
    if status == "SUCCESS":
        logger.info(log_msg)
    else:
        logger.warning(log_msg)
