import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pypdf

app = FastAPI()

# CORS 설정 (Next.js 앱과 통신하기 위해 필요)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    # validate PDF extension
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Upload ONLY PDF file!")

    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)

        pdf_reader = pypdf.PdfReader(pdf_file)
        text = ""

        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        return {
            "filename": file.filename,
            "pages": len(pdf_reader.pages),
            "text": text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errors while processing pdf: {str(e)}")


@app.get('/')
async def root():
    return {"message": "PDF Parser API"}