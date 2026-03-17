from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import csv, io
from database.connection import get_db
from database.models import Invoice, ProcessingStatus

router = APIRouter()

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).filter(Invoice.status == ProcessingStatus.PROCESSED).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Vendor", "Invoice #", "Date", "Total", "Currency", "Uploaded"])
    for inv in invoices:
        writer.writerow([
            inv.id, inv.vendor_name, inv.invoice_number,
            inv.invoice_date, inv.total_amount, inv.currency,
            inv.upload_timestamp.strftime("%Y-%m-%d %H:%M")
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=invoices.csv"}
    )