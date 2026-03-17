from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
import shutil, uuid
from database.models import Invoice
from database.connection import get_db
from processing.pipeline import process_invoice
from config import settings

router = APIRouter()
ALLOWED_TYPES = {"application/pdf", "image/png", "image/jpeg"}

@router.post("/upload", status_code=202)
async def upload_invoice(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only PDF, PNG, and JPG files are supported.")
    
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(exist_ok=True)
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = upload_dir / unique_name

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    invoice = Invoice(
        original_filename=file.filename,
        file_path=str(file_path),
        file_size=file_path.stat().st_size
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    background_tasks.add_task(process_invoice, invoice.id, db)

    return {"message": "Upload received. Processing started.", 
            "invoice_id": invoice.id, "status": "uploaded"}