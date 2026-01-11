import { NextResponse } from 'next/server'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

export async function GET(
    request: Request,
    { params }: { params: { filename: string } }
) {
    const filename = params.filename

    // Security: Prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return new NextResponse('Invalid filename', { status: 400 })
    }

    // Files are served from the project root in this demo
    const filePath = join(process.cwd(), '../', filename)

    if (!existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = readFileSync(filePath)

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`
        }
    })
}
