// Test script for email service
// Run with: node test-email.js

const { sendEmail } = require('./src/lib/email.ts')

async function testEmail() {
  try {
    console.log('Testing email service...')
    
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from Vibe Voicer',
      text: 'This is a test email to verify the email service is working.',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email service is working.</p>'
    })
    
    console.log('✅ Email sent successfully!')
    console.log('Provider:', result.provider)
    console.log('Message ID:', result.messageId)
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message)
  }
}

testEmail()
