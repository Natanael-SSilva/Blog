import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = `${process.env.RESEND_FROM_NAME || 'Blog'} <${process.env.RESEND_FROM_EMAIL}>`
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'É um blog'
