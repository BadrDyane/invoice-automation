import pdfplumber
import pytesseract
from PIL import Image
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class OCRService:
    def extract_text(self, file_path: str) -> str:
        path = Path(file_path)
        suffix = path.suffix.lower()
        if suffix == ".pdf":
            return self._extract_from_pdf(file_path)
        elif suffix in [".png", ".jpg", ".jpeg"]:
            return self._extract_from_image(file_path)
        else:
            raise ValueError(f"Unsupported file type: {suffix}")

    def _extract_from_pdf(self, file_path: str) -> str:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if text.strip():
            logger.info("Native PDF text extracted.")
            return text
        logger.info("No native text. Falling back to OCR.")
        return self._ocr_pdf_as_images(file_path)

    def _ocr_pdf_as_images(self, file_path: str) -> str:
        import fitz
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            pix = page.get_pixmap(dpi=300)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            text += pytesseract.image_to_string(img) + "\n"
        return text

    def _extract_from_image(self, file_path: str) -> str:
        img = Image.open(file_path)
        return pytesseract.image_to_string(img)