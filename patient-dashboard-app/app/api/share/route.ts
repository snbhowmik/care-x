import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { recipient_wallet, doc_ids } = body

        if (!recipient_wallet || !doc_ids) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        // Proxy to Python Backend
        const backendRes = await fetch('http://localhost:8000/api/v1/documents/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient_wallet, doc_ids })
        })

        if (!backendRes.ok) {
            throw new Error('Backend failed to save permissions')
        }

        return NextResponse.json({ status: 'success' })
    } catch (error) {
        console.error('Share Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
