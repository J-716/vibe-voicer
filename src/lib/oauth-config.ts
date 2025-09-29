/**
 * OAuth Configuration Utilities
 * 
 * This file provides utilities to check OAuth provider configuration
 * and determine which providers should be shown in the UI.
 */

export interface OAuthProvider {
  id: 'google' | 'github'
  name: string
  enabled: boolean
  icon?: string
}

/**
 * Check if OAuth providers are configured based on environment variables
 * This is a client-side check that can be used in components
 */
export function getOAuthProviders(): OAuthProvider[] {
  const providers: OAuthProvider[] = [
    {
      id: 'google',
      name: 'Google',
      enabled: typeof window !== 'undefined' && 
        (!!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
         process.env.NODE_ENV === 'development'),
      icon: '🔍'
    },
    {
      id: 'github',
      name: 'GitHub',
      enabled: typeof window !== 'undefined' && 
        (!!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 
         process.env.NODE_ENV === 'development'),
      icon: '🐙'
    }
  ]

  return providers.filter(provider => provider.enabled)
}


/**
 * Get the enabled OAuth providers for display in UI
 */
export function getEnabledOAuthProviders(): OAuthProvider[] {
  return getOAuthProviders().filter(provider => provider.enabled)
}

/**
 * Check if any OAuth providers are enabled
 */
export function hasOAuthProviders(): boolean {
  return getEnabledOAuthProviders().length > 0
}

/**
 * Get OAuth provider by ID
 */
export function getOAuthProvider(id: 'google' | 'github'): OAuthProvider | undefined {
  return getOAuthProviders().find(provider => provider.id === id)
}
