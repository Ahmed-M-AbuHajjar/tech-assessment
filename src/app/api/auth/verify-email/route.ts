import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const verificationToken = randomUUID()
    
    // Store verification token in database
    await db.user.update({
      where: { email },
      data: { verificationToken },
    })

    // Get the base URL from the request
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = req.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`

    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`

    await transporter.sendMail({
      from: {
        name: 'Blurr HR Portal',
        address: process.env.NODEMAILER_USER || '',
      },
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Email Verification</h1>
          <p>Please click the link below to verify your email address for your Blurr HR Portal account:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email Address</a>
          <p style="color: #666; font-size: 14px;">If you did not request this verification, please ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
} 