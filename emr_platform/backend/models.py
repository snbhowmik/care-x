from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import time

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    wallet_address = Column(String, unique=True, index=True)
    
    records = relationship("VitalsRecord", back_populates="patient")

class VitalsRecord(Base):
    __tablename__ = "vitals_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    
    bpm = Column(Integer)
    spo2 = Column(Integer)
    timestamp = Column(Float, default=time.time)
    
    is_critical = Column(Boolean, default=False)
    ipfs_hash = Column(String, nullable=True) # Anchored on blockchain
    session_address = Column(String, nullable=True) # Privacy-preserving transaction address
    
    patient = relationship("Patient", back_populates="records")

class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_wallet = Column(String, index=True)
    file_name = Column(String)
    description = Column(String)
    is_secure = Column(Boolean, default=True)
    timestamp = Column(String) # SQLite default CURRENT_TIMESTAMP is string

class DocumentPermission(Base):
    __tablename__ = "document_permissions"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, index=True)
    viewer_wallet = Column(String, index=True)
