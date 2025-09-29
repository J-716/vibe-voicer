# GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for your Vibe Voicer application.

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: `Vibe Voicer` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key-here"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vibe_voicer"
```

## Step 3: Production Setup

For production deployment:

1. Update your GitHub OAuth App settings:
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`

2. Update your environment variables:
   ```env
   BETTER_AUTH_URL="https://yourdomain.com"
   GITHUB_CLIENT_ID="your-production-client-id"
   GITHUB_CLIENT_SECRET="your-production-client-secret"
   ```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Navigate to `/login` or `/register`
3. Click the "GitHub" button
4. You should be redirected to GitHub for authorization
5. After authorization, you should be redirected back to your dashboard

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**:
   - Ensure the callback URL in your GitHub OAuth app matches exactly: `http://localhost:3000/api/auth/callback/github`

2. **"Client ID not found" error**:
   - Verify your `GITHUB_CLIENT_ID` environment variable is set correctly
   - Restart your development server after adding environment variables

3. **"Client secret mismatch" error**:
   - Verify your `GITHUB_CLIENT_SECRET` environment variable is set correctly
   - Ensure there are no extra spaces or quotes in the environment variable

4. **OAuth buttons not showing**:
   - Check that your environment variables are properly loaded
   - In development, OAuth buttons should always show (they're enabled by default)

### Debug Steps

1. Check your environment variables:
   ```bash
   echo $GITHUB_CLIENT_ID
   echo $GITHUB_CLIENT_SECRET
   ```

2. Check the browser console for any JavaScript errors

3. Check the server logs for authentication errors

4. Verify your GitHub OAuth app settings match your application URLs

## Security Notes

- Never commit your `.env.local` file to version control
- Use different OAuth apps for development and production
- Regularly rotate your client secrets
- Use strong, unique secrets for `BETTER_AUTH_SECRET`

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
