/**
 * SMS Service for sending magic links
 *
 * In development: Logs to console
 * In production: Integrates with Twilio (when configured)
 */

interface SendSMSParams {
  to: string
  message: string
}

interface SendSMSResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send an SMS message
 *
 * @param params - SMS parameters (to, message)
 * @returns Result object with success status
 */
export async function sendSMS({ to, message }: SendSMSParams): Promise<SendSMSResult> {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // In development mode, just log to console
  if (isDevelopment) {
    console.log('\n' + '='.repeat(60))
    console.log('📱 SMS SERVICE (Development Mode)')
    console.log('='.repeat(60))
    console.log(`To: ${to}`)
    console.log(`Message:\n${message}`)
    console.log('='.repeat(60) + '\n')

    return {
      success: true,
      messageId: `dev-${Date.now()}`
    }
  }

  // In production, use Twilio if configured
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.error('Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env')
    return {
      success: false,
      error: 'SMS service not configured'
    }
  }

  try {
    // Use Twilio SDK to send SMS
    const twilio = require('twilio')
    const client = twilio(twilioAccountSid, twilioAuthToken)

    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    })

    console.log(`SMS sent successfully. SID: ${result.sid}`)

    return {
      success: true,
      messageId: result.sid
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send a magic link via SMS
 *
 * @param phone - Phone number to send to
 * @param magicLink - Full URL of the magic link
 * @returns Result object with success status
 */
export async function sendMagicLink(phone: string, magicLink: string): Promise<SendSMSResult> {
  const message = `Your login link for No One Will Pay:\n\n${magicLink}\n\nThis link expires in 10 minutes.`

  return sendSMS({
    to: phone,
    message
  })
}

/**
 * Format phone number for display (mask middle digits)
 *
 * @param phone - Full phone number
 * @returns Masked phone number (e.g., "202***5678")
 */
export function maskPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '')

  if (digits.length < 10) {
    return phone // Don't mask if too short
  }

  // Show first 3 and last 4 digits
  const first = digits.slice(0, 3)
  const last = digits.slice(-4)
  const stars = '*'.repeat(Math.min(digits.length - 7, 4))

  return `${first}${stars}${last}`
}
