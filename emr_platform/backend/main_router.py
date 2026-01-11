from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import crud, models, schemas
from database import SessionLocal, engine

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/patients/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    db_patient = crud.get_patient_by_wallet(db, wallet_address=patient.wallet_address)
    if db_patient:
        raise HTTPException(status_code=400, detail="Patient already registered")
    return crud.create_patient(db=db, patient=patient)

@router.get("/patients/", response_model=List[schemas.Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = crud.get_patients(db, skip=skip, limit=limit)
    return patients

@router.get("/patients/by-wallet/{wallet_address}", response_model=schemas.Patient)
def read_patient_by_wallet(wallet_address: str, db: Session = Depends(get_db)):
    db_patient = crud.get_patient_by_wallet(db, wallet_address=wallet_address)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.post("/patients/{patient_id}/vitals/", response_model=schemas.Vitals)
def create_vitals_for_patient(
    patient_id: int, vitals: schemas.VitalsCreate, db: Session = Depends(get_db)
):
    return crud.create_patient_vitals(db=db, vitals=vitals, patient_id=patient_id)

@router.get("/patients/{patient_id}/vitals/", response_model=List[schemas.Vitals])
def read_vitals(patient_id: int, db: Session = Depends(get_db)):
    return crud.get_vitals(db, patient_id=patient_id)
@router.get("/patients/by-wallet/{wallet_address}/documents", response_model=List[schemas.MedicalDocument])
def read_documents_by_wallet(wallet_address: str, viewer_wallet: str = None, db: Session = Depends(get_db)):
    return crud.get_documents_by_wallet(db, wallet_address=wallet_address, viewer_wallet=viewer_wallet)

@router.post("/documents/share")
def share_documents(req: schemas.ShareRequest, db: Session = Depends(get_db)):
    count = crud.grant_document_access(db, req.doc_ids, req.recipient_wallet)
    return {"status": "success", "granted_count": count}
@router.post("/documents/revoke")
def revoke_documents(req: schemas.ShareRequest, db: Session = Depends(get_db)):
    # Using ShareRequest to get recipient_wallet. We'll revoke ALL docs for this viewer.
    # In a real app we might want specific doc revocations too, but here we align with blockchain logic which revokes relationship.
    count = crud.revoke_document_access(db, req.recipient_wallet)
    return {"status": "success", "revoked_count": count}
