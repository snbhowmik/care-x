import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { doctorAddress } = body

        if (!doctorAddress) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        // Proxy to Python Backend
        // Although schema expects 'doc_ids', we can send empty list as backend revokes ALL by wallet in crud.py
        const backendRes = await fetch('http://localhost:8000/api/v1/documents/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient_wallet: doctorAddress,
                doc_ids: []
            })
        })

        if (!backendRes.ok) {
            throw new Error('Backend failed to revoke permissions')
        }

        return NextResponse.json({ status: 'success' })
    } catch (error) {
        console.error('Revoke Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
