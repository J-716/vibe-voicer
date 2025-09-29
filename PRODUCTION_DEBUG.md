# Production Debugging Guide

## Common Production Issues & Solutions

### 1. Environment Variables Not Set
**Problem**: 500 errors, email service not working
**Solution**: Add these to Vercel Environment Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_qVMPlpo5Yck6@ep-fancy-salad-adsgdmp0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
BETTER_AUTH_URL=https://your-app.vercel.app
BETTER_AUTH_SECRET=your-secret-key-here
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_FROM=noreply@vibevoicer.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Database Connection Issues
**Problem**: Prisma client not generated, database errors
**Solution**: Ensure DATABASE_URL is set and accessible

### 3. Email Service Issues
**Problem**: Signup fails, verification emails not sent
**Solution**: Set RESEND_API_KEY and SMTP_FROM in Vercel

### 4. Build Issues
**Problem**: Build fails on Vercel
**Solution**: Check vercel.json configuration

## Quick Fixes

### Fix 1: Update vercel.json for better Prisma support
```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm run build",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "true"
  }
}
```

### Fix 2: Add .npmrc for pnpm
```
enable-pre-post-scripts=true
```

### Fix 3: Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for errors

## Testing Steps

1. **Check Environment Variables**: Visit `/api/test-email` (if available)
2. **Test Database**: Try to sign up
3. **Test Email**: Check if verification emails are sent
4. **Check Console**: Look for JavaScript errors

## Emergency Fallback

If nothing works, temporarily disable email verification:
1. Set `requireEmailVerification: false` in auth.ts
2. Deploy
3. Test basic functionality
4. Re-enable email verification once other issues are fixed
