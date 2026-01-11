from pydantic import BaseModel
from typing import List, Optional

class VitalsBase(BaseModel):
    bpm: int
    spo2: int
    is_critical: bool
    ipfs_hash: Optional[str] = None
    session_address: Optional[str] = None
    timestamp: float

class VitalsCreate(VitalsBase):
    pass

class Vitals(VitalsBase):
    id: int
    patient_id: int

    class Config:
        orm_mode = True

class PatientBase(BaseModel):
    name: str
    age: int
    wallet_address: str

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    records: List[Vitals] = []

    class Config:
        orm_mode = True

class MedicalDocument(BaseModel):
    id: int
    patient_wallet: str
    file_name: str
    description: str
    is_secure: bool
    timestamp: Optional[str]

    class Config:
        orm_mode = True

class ShareRequest(BaseModel):
    recipient_wallet: str
    doc_ids: List[int]
