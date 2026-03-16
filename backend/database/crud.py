from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models import Invoice, LineItem, ProcessingStatus
from typing import Optional

def get_invoice(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def get_invoices(db: Session, vendor: Optional[str] = None, 
                 status: Optional[str] = None, skip: int = 0, limit: int = 50):
    query = db.query(Invoice)
    if vendor:
        query = query.filter(Invoice.vendor_name.ilike(f"%{vendor}%"))
    if status:
        query = query.filter(Invoice.status == status)
    return query.order_by(Invoice.upload_timestamp.desc()).offset(skip).limit(limit).all()

def get_stats(db: Session):
    total = db.query(func.count(Invoice.id)).scalar()
    total_value = db.query(func.sum(Invoice.total_amount)).scalar() or 0
    processed = db.query(func.count(Invoice.id)).filter(
        Invoice.status == ProcessingStatus.PROCESSED).scalar()
    failed = db.query(func.count(Invoice.id)).filter(
        Invoice.status == ProcessingStatus.FAILED).scalar()
    by_vendor = (
        db.query(Invoice.vendor_name, func.sum(Invoice.total_amount))
        .filter(Invoice.vendor_name != None)
        .group_by(Invoice.vendor_name)
        .all()
    )
    return {
        "total_invoices": total,
        "total_value": round(total_value, 2),
        "processed": processed,
        "failed": failed,
        "by_vendor": [{"vendor": v, "total": round(t or 0, 2)} for v, t in by_vendor]
    }