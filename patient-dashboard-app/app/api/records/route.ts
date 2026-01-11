import { NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function POST(req: Request) {
    try {
        const { walletAddress } = await req.json()

        if (!walletAddress) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
        }

        // Connect to DB
        const dbPath = join(process.cwd(), '../emr_platform/backend/emr_data.db')

        if (!existsSync(dbPath)) {
            console.error("DB Not Found at:", dbPath)
            return NextResponse.json({ error: "Database not found" }, { status: 500 })
        }

        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        // Query medical documents specifically for this wallet
        const records = await db.all(
            'SELECT * FROM medical_documents WHERE patient_wallet = ? ORDER BY timestamp DESC',
            walletAddress
        )

        await db.close()

        return NextResponse.json({ records })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
