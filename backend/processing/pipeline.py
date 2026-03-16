import logging
from datetime import datetime
from sqlalchemy.orm import Session
from database.models import Invoice, LineItem, ProcessingStatus
from services.ocr_service import OCRService
from services.ai_service import AIExtractionService

logger = logging.getLogger(__name__)
ocr_service = OCRService()
ai_service = AIExtractionService()

def process_invoice(invoice_id: int, db: Session):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        logger.error(f"Invoice {invoice_id} not found.")
        return

    try:
        # Stage 1: Mark as processing
        invoice.status = ProcessingStatus.PROCESSING
        db.commit()

        # Stage 2: OCR
        logger.info(f"[{invoice_id}] Running OCR on {invoice.file_path}")
        raw_text = ocr_service.extract_text(invoice.file_path)
        invoice.raw_extracted_text = raw_text

        if not raw_text.strip():
            raise ValueError("OCR produced no readable text.")

        # Stage 3: AI extraction
        logger.info(f"[{invoice_id}] Running AI extraction.")
        extracted = ai_service.extract_invoice_data(raw_text)

        # Stage 4: Save results
        invoice.vendor_name = extracted.get("vendor_name")
        invoice.invoice_number = extracted.get("invoice_number")
        invoice.invoice_date = extracted.get("invoice_date")
        invoice.due_date = extracted.get("due_date")
        invoice.total_amount = extracted.get("total_amount")
        invoice.currency = extracted.get("currency", "USD")

        for item in extracted.get("line_items", []):
            db.add(LineItem(
                invoice_id=invoice.id,
                description=item.get("description"),
                quantity=item.get("quantity"),
                unit_price=item.get("unit_price"),
                total=item.get("total")
            ))

        invoice.status = ProcessingStatus.PROCESSED
        invoice.processed_timestamp = datetime.utcnow()
        db.commit()
        logger.info(f"[{invoice_id}] Processing complete.")

    except Exception as e:
        logger.error(f"[{invoice_id}] Pipeline failed: {e}")
        invoice.status = ProcessingStatus.FAILED
        invoice.error_message = str(e)
        db.commit()