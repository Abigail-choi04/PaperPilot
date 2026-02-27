from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

from core.zipper import create_zip
from core.parser import parse_sections
from core.formatter import generate_formats, get_available_formats
from fastapi.responses import FileResponse
from file_handlers.docx_handler import extract_text_from_docx
from file_handlers.pdf_handler import extract_text_from_pdf
from file_handlers.txt_handler import extract_text_from_txt

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Research Paper Formatter API Running"}


@app.get("/formats/")
def list_formats():
    return {"available_formats": get_available_formats()}
@app.get("/download/")
def download_file(path: str):
    if not os.path.exists(path):
        return {"status": "error", "message": "File not found"}
    return FileResponse(path, filename=os.path.basename(path))


@app.post("/convert/")
async def convert_file(
    file: UploadFile = File(...),
    formats: str = Form(...),
    output_type: str = Form("pdf")  # "pdf" or "tex"
):
    try:
        # ---------------- Save Uploaded File ----------------
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ---------------- Extract + Parse ----------------
        filename_lower = file.filename.lower()

        if filename_lower.endswith(".docx"):
            raw_text = extract_text_from_docx(file_path)
            content = parse_sections(raw_text)

        elif filename_lower.endswith(".pdf"):
            raw_text = extract_text_from_pdf(file_path)
            content = parse_sections(raw_text)

        elif filename_lower.endswith(".txt"):
            raw_text = extract_text_from_txt(file_path)
            content = parse_sections(raw_text)

        else:
            return {
                "status": "error",
                "message": "Unsupported file type. Please upload .pdf, .docx, or .txt file."
    }

        # ---------------- Format Selection ----------------
        formats_list = [f.strip().lower() for f in formats.split(",")]

        available_formats = get_available_formats()

        selected_formats = [
            fmt for fmt in formats_list
            if fmt in available_formats
        ]

        if not selected_formats:
            return {"status": "error", "message": "No valid formats selected"}

        # ---------------- Generate Files ----------------
        outputs = generate_formats(content, selected_formats, output_type)

        if not outputs:
            return {"status": "error", "message": "No files generated"}

        # ---------------- ZIP Handling ----------------
        if len(outputs) > 1:
            zip_path = create_zip(outputs)
            return {
                "status": "success",
                "zip_file": zip_path
            }

        # ---------------- Single Format ----------------
        format_name = list(outputs.keys())[0]
        files = outputs[format_name]

        return {
            "status": "success",
            "format": format_name,
            "files": files
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }