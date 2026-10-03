import os
import uuid
from fastapi import UploadFile, HTTPException, status

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB max

UPLOAD_BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

def save_uploaded_file(file: UploadFile, subfolder: str = "profiles") -> str:
    """
    Safely stores an uploaded file.
    Prevents path traversal, validates extensions and MIME types, and assigns a secure random UUID filename.
    """
    # Sanitize subfolder path
    safe_subfolder = os.path.basename(subfolder)
    target_dir = os.path.join(UPLOAD_BASE_DIR, safe_subfolder)
    os.makedirs(target_dir, exist_ok=True)
    
    # Check file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{ext}'. Only .jpg, .jpeg, .png, .webp allowed."
        )

    # Check content type / MIME
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid MIME type '{file.content_type}'. Must be image/png, image/jpeg, or image/webp."
        )
        
    # Generate random unique filename
    safe_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(target_dir, safe_filename)
    
    # Save file content securely with size limit
    size = 0
    with open(dest_path, "wb") as buffer:
        while chunk := file.file.read(8192):
            size += len(chunk)
            if size > MAX_FILE_SIZE:
                buffer.close()
                os.remove(dest_path)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File exceeds maximum allowed size of 5MB."
                )
            buffer.write(chunk)
            
    # Return relative static URL
    return f"/static/uploads/{safe_subfolder}/{safe_filename}"
