import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueId = uuidv4()
    const extension = file.name.split('.').pop()
    const filename = `${uniqueId}.${extension}`

    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'uploads')
    const filepath = join(publicDir, filename)
    await writeFile(filepath, buffer)

    // Return the URL
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
} 