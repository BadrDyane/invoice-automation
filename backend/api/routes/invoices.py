from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from database.connection import get_db
from database import crud, schemas

router = APIRouter()

@router.get("/invoices", response_model=list[schemas.InvoiceOut])
def list_invoices(
    vendor: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return crud.get_invoices(db, vendor=vendor, status=status, skip=skip, limit=limit)

@router.get("/invoices/{invoice_id}", response_model=schemas.InvoiceDetailOut)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = crud.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(404, "Invoice not found.")
    return invoice

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)