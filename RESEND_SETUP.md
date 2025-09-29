# Resend Email Setup Guide

This guide will help you set up Resend for email verification and password reset in your Vibe Voicer app.

## 🚀 Quick Setup

### 1. Sign Up for Resend
1. Go to [resend.com](https://resend.com)
2. Click "Get Started" and sign up with your email
3. Verify your email address

### 2. Get Your API Key
1. Once logged in, go to the [API Keys](https://resend.com/api-keys) page
2. Click "Create API Key"
3. Give it a name like "Vibe Voicer Production"
4. Copy the API key (starts with `re_`)

### 3. Update Your Environment Variables
Add to your `.env` file:
```bash
RESEND_API_KEY="re_your_actual_api_key_here"
SMTP_FROM="noreply@vibevoicer.com"
```

**Note:** The app now requires Resend - there's no fallback email service.

## 🌐 Domain Verification (For Production)

### Option 1: Use Resend's Test Domain (Quick Start)
For immediate testing, you can use Resend's test domain:
```bash
SMTP_FROM="onboarding@resend.dev"
```
This works immediately without domain verification.

### Option 2: Add Your Own Domain (Recommended for Production)

#### Step 1: Add Domain in Resend
1. Go to [Domains](https://resend.com/domains) in your Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Click "Add Domain"

#### Step 2: Verify Domain Ownership
Resend will provide DNS records to add to your domain:

**For most domains, add these DNS records:**

1. **TXT Record for Domain Verification:**
   - Name: `@` (or your domain)
   - Value: `resend._domainkey.yourdomain.com`
   - TTL: 3600

2. **CNAME Record for DKIM:**
   - Name: `resend._domainkey`
   - Value: `resend._domainkey.resend.com`
   - TTL: 3600

3. **TXT Record for SPF:**
   - Name: `@` (or your domain)
   - Value: `v=spf1 include:resend.com ~all`
   - TTL: 3600

#### Step 3: Update Environment Variables
Once verified, update your `.env`:
```bash
RESEND_API_KEY="re_your_actual_api_key_here"
SMTP_FROM="noreply@yourdomain.com"
```

## 🧪 Testing Your Setup

### Test Email Sending
1. Start your development server: `npm run dev`
2. Try to register a new account
3. Check your email for the verification link
4. Check the console logs to see which provider was used

### Console Logs
You should see one of these messages:
- `Email sent via Resend: [message-id]` (if using Resend)
- `Using SMTP fallback (Ethereal Email)` (if using fallback)

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid API key" error:**
   - Make sure your API key starts with `re_`
   - Check that it's correctly set in your `.env` file

2. **"Domain not verified" error:**
   - Use `onboarding@resend.dev` for testing
   - Or complete domain verification steps above

3. **Emails not being sent:**
   - Check console logs to see which provider is being used
   - Verify your API key is correct
   - Check Resend dashboard for any errors

### Error Handling
If Resend fails, the app will show a clear error message indicating that the RESEND_API_KEY is required.

## 📊 Resend Free Tier Limits

- **3,000 emails per month**
- **100 emails per day**
- **Perfect for small to medium apps**

## 🚀 Production Checklist

- [ ] Sign up for Resend account
- [ ] Get API key
- [ ] Add domain (optional, can use test domain)
- [ ] Verify domain (if using custom domain)
- [ ] Update environment variables
- [ ] Test email sending
- [ ] Monitor usage in Resend dashboard

## 📈 Monitoring

Check your email sending stats in the Resend dashboard:
- [Resend Dashboard](https://resend.com/emails)
- View sent emails, delivery rates, and errors
- Monitor your monthly usage

## 🔒 Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Rotate your API keys regularly
- Monitor for unusual sending patterns

---

**Need Help?**
- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)
- Check the console logs for detailed error messages
