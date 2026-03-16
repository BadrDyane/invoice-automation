from openai import OpenAI
import json
import logging
from config import settings

logger = logging.getLogger(__name__)

EXTRACTION_PROMPT = """You are an invoice data extraction system.
Extract structured data from the invoice text below.

Return ONLY a valid JSON object — no explanation, no markdown fences.

{
  "vendor_name": "string or null",
  "invoice_number": "string or null",
  "invoice_date": "YYYY-MM-DD or null",
  "due_date": "YYYY-MM-DD or null",
  "total_amount": number or null,
  "currency": "USD/EUR/GBP etc or null",
  "line_items": [
    {
      "description": "string",
      "quantity": number or null,
      "unit_price": number or null,
      "total": number or null
    }
  ]
}

Invoice text:
"""

class AIExtractionService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def extract_invoice_data(self, raw_text: str) -> dict:
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",  # cheapest model, perfect for extraction
            messages=[
                {"role": "user", "content": EXTRACTION_PROMPT + raw_text}
            ],
            max_tokens=1024
        )
        response_text = response.choices[0].message.content.strip()

        # Strip code fences if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:-1])

        data = json.loads(response_text)
        logger.info("AI extraction successful.")
        return data