export const AUTH_DB: Record<string, any> = {
    "patient@care.x": {
        "password": "password123",
        "name": "Subir Nath Bhowmik",
        "walletAddress": process.env.NEXT_PUBLIC_PATIENT_ZERO_ADDRESS || "",
        "privateKey": process.env.NEXT_PUBLIC_PATIENT_ZERO_KEY || ""
    },
    "aarav@care.x": {
        "password": "pass123",
        "name": "Aarav Sharma",
        "walletAddress": process.env.NEXT_PUBLIC_PATIENT_AARAV_ADDRESS || "",
        "privateKey": process.env.NEXT_PUBLIC_PATIENT_AARAV_KEY || ""
    },
    "priya@care.x": {
        "password": "pass123",
        "name": "Priya Patel",
        "walletAddress": process.env.NEXT_PUBLIC_PATIENT_PRIYA_ADDRESS || "",
        "privateKey": process.env.NEXT_PUBLIC_PATIENT_PRIYA_KEY || ""
    }
}
