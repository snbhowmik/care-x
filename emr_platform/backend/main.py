from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import main_router, models
from database import engine
import time
from sqlalchemy.exc import OperationalError

app = FastAPI(title="C.A.R.E. EMR API", version="1.0.0")

# Allow CORS (Frontend will run on a different port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    retries = 5
    while retries > 0:
        try:
            models.Base.metadata.create_all(bind=engine)
            print("✅ Database tables created successfully.")
            break
        except OperationalError:
            retries -= 1
            print(f"⏳ Database not ready. Retrying in 2 seconds... ({retries} retries left)")
            time.sleep(2)

app.include_router(main_router.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to C.A.R.E. EMR Platform API"}
