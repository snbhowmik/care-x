# Project C.A.R.E - X

### General Instructions
You are a Senior Level Software Engineer with decades of experience. You are now building a  Blockchain based healthcare system that allows patients to share data by consent from hospital to another hospital or doctor. there are a lot of features to implement right now. 



## Ganache Account and their address
INDEX:0
ADD: 0xe430070E1A202a48619717D6B23718128b612899
KEY: 0xcea2ccd6e3b765aca58826ce5f532d7aed2ad0db916a42a0f25d673241539da4

INDEX:1
ADD: 0xC21fBA67bE5DBA545a8017A244afb4E49716d4C0
KEY: 0x77cfb412469110023ffe978c9abe8ffc25b5ca781465a3f32aff67f6efe964fd

INDEX:2
ADD: 0x65A6fb5E4528af73D8bdD0576A637ec7980a972a
KEY: 0x0b86b01165070dc4f3b7668eb63220a9073cb3bd26b886bfe9212715b20fd06d

INDEX:3
ADD: 0x4508aFC5257654F7CA73565CFC1321819a6FCDD5
KEY: 0x7a7bc143a20aeb9494420fe58e139663b9cffe80c8f82068b90f758476a0c7f5

INDEX:4
ADD: 0x8014871f85CEFB91Ab4687a14703324EB8c12191
KEY: 0xb4cea968dc4be6594915a105ac795717eb9df82f2e48fca343920a6b2eaee081

INDEX:5
ADD: 0xC43E7673E1444Cd838600976237C7997D43C02a9
KEY: 0xc39b385f335e9af77a1e84bd9c0ebae04ca7bcfa40a0f9399b72956b72784b16

INDEX:6
ADD: 0x51DF150cc592483B778cb08CcC0DbCB2F395f6fF
KEY: 0x647a69466674058dc6ce8bae0780fbf4ef57f0cc7b0887aca8301c477a686614

INDEX:7
ADD: 0xA440ADcF31B838862BaCDF6a3B75b325D38eFBbA
KEY: 0xd433bcf144a655d2ae99fb8a5010d5071f1f026aa88dea3ed2eefcc2e0169baa

INDEX:8
ADD: 0xD046c5ab11CDf7D09d27d352E22c875C197d43eB
KEY: 0x3269eb511b2e2aa37f0a9f30858d7af1508743568920b63c9238806574c9f72f

INDEX:9
ADD: 0x10ff73EeF6BeC122Ab78e04E128dAeB8e6542756
KEY: 0x629247a0db256005cfae8c3d32d701175fbf5661b176573279304412d8103d96

# System Architecture — Decentralized Healthcare Trust Layer

## Overview

This architecture represents a **decentralized, privacy-preserving healthcare monitoring system** integrating:

- Medical hardware
- Hospital EMR systems (EPIC / CERNER)
- IPFS for distributed storage
- A public blockchain for trust anchoring
- A unified dashboard for clinicians and auditors
- Remote medical practitioners

The design ensures **immutability, interoperability, and patient-controlled privacy**.

---

## High-Level Architecture Diagram

```mermaid
flowchart LR
    %% =========================
    %% Left Healthcare Provider
    %% =========================
    subgraph HOSPITAL_A["Healthcare Provider A"]
        A1[Activity & Medical<br/>Record Hardware]
        A2[EPIC / CERNER EMR]
        A3[Distributed Databases]
        A4[IPFS Node]

        A1 --> A2
        A2 <--> A3
        A3 --> A4
    end

    %% =========================
    %% Right Healthcare Provider
    %% =========================
    subgraph HOSPITAL_B["Healthcare Provider B"]
        B1[Activity & Medical<br/>Record Hardware]
        B2[EPIC / CERNER EMR]
        B3[Distributed Databases]
        B4[IPFS Node]

        B1 --> B2
        B2 <--> B3
        B3 --> B4
    end

    %% =========================
    %% Public Blockchain
    %% =========================
    BC[Public Blockchain]

    HOSPITAL_A <--> BC
    HOSPITAL_B <--> BC

    %% =========================
    %% Dashboard Layer
    %% =========================
    subgraph DASH["Dashboard"]
        D1[Distributed Databases]
        D2[IPFS Node]
    end

    BC <--> DASH

    %% =========================
    %% Remote Medical Proctor
    %% =========================
    subgraph REMOTE["Remote Medical Proctor"]
        R1[Activity & Medical<br/>Record Hardware]
    end

    DASH <--> REMOTE
