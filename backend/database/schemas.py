from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database.models import ProcessingStatus

class LineItemOut(BaseModel):
    id: int
    description: Optional[str]
    quantity: Optional[float]
    unit_price: Optional[float]
    total: Optional[float]

    class Config:
        from_attributes = True

class InvoiceOut(BaseModel):
    id: int
    original_filename: str
    vendor_name: Optional[str]
    invoice_number: Optional[str]
    invoice_date: Optional[str]
    total_amount: Optional[float]
    currency: Optional[str]
    status: ProcessingStatus
    upload_timestamp: datetime

    class Config:
        from_attributes = True

class InvoiceDetailOut(InvoiceOut):
    due_date: Optional[str]
    error_message: Optional[str]
    processed_timestamp: Optional[datetime]
    line_items: List[LineItemOut] = []

    class Config:
        from_attributes = True