# Environment Configuration Guide

This document explains how to use environment variables for site configuration in the Inflation Impact Calculator.

## Overview

The application uses environment variables to manage external links, site information, and other configuration settings. This approach follows best practices for modular, maintainable code by:

1. Centralizing configuration in one place
2. Making the application adaptable to different environments
3. Keeping sensitive or environment-specific data separate from the codebase

## Setting Up Environment Variables

### Local Development

1. Copy the `.env.local.example` file to create a new `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit the `.env.local` file with your specific values:
   ```
   # Main Skynex website URLs
   NEXT_PUBLIC_MAIN_SITE_URL=https://www.skynexdigital.com
   NEXT_PUBLIC_PRIVACY_POLICY_URL=https://www.skynexdigital.com/privacy
   NEXT_PUBLIC_TERMS_URL=https://www.skynexdigital.com/terms
   NEXT_PUBLIC_CONTACT_URL=https://www.skynexdigital.com/contact
   
   # Current site info
   NEXT_PUBLIC_SITE_DOMAIN=inflation.skynexdigital.com
   NEXT_PUBLIC_SITE_NAME=Inflation Impact Calculator
   NEXT_PUBLIC_COMPANY_NAME=SKYNEX DIGITAL
   
   # Social media
   NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/skynex-digital
   NEXT_PUBLIC_TWITTER_URL=https://x.com
   ```

3. Restart your development server to apply the changes.

### Production Deployment

For production environments, set these environment variables in your hosting platform:

- **Vercel**: Add environment variables in the project settings
- **Netlify**: Add environment variables in the site settings
- **AWS/GCP/Azure**: Use the respective environment variable configuration options

## How Environment Variables Work in Next.js

### Client-Side Access

Variables prefixed with `NEXT_PUBLIC_` are accessible in both server and browser code. These are included in the JavaScript bundle that gets sent to the client.

Example in code:
```javascript
// This works in both client and server components
const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL;
```

### Server-Only Variables

Variables without the `NEXT_PUBLIC_` prefix are only available in server-side code. Use these for sensitive information that shouldn't be exposed to the browser.

## Configuration File

The application uses a central configuration file (`src/config/siteConfig.ts`) that reads environment variables and provides fallback values:

```typescript
// External URLs - Main Skynex website links
const externalUrls = {
  mainSite: process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.skynexdigital.com',
  privacyPolicy: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || 'https://www.skynexdigital.com/privacy',
  // ... other URLs
};

// Site Information
const siteInfo = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Inflation Impact Calculator',
  // ... other site info
};

// Social media links
const socialLinks = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/skynex-digital',
  // ... other social links
};

// Export all config values
const siteConfig = {
  externalUrls,
  siteInfo,
  socialLinks
};

export default siteConfig;
```

## Benefits of This Approach

1. **Modularity**: All configuration is centralized in one file
2. **Environment Adaptability**: Different environments can have different configurations
3. **Maintainability**: Changing a URL requires updating one value, not finding all instances throughout the code
4. **Consistency**: Components import and use the same configuration values
5. **Fallbacks**: Default values ensure the application works even if environment variables aren't set

## Adding New Configuration Values

To add new environment variables:

1. Add the variable to `.env.local.example` with a default/example value
2. Add it to your local `.env.local` file with the actual value
3. Update `src/config/siteConfig.ts` to include the new variable with a fallback
4. Use the configuration value in your components

Example:
```typescript
// In siteConfig.ts
const analytics = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'UA-XXXXXXXXX'
};

// Export in the config object
const siteConfig = {
  // ... other config sections
  analytics
};
```

Then in your component:
```typescript
import siteConfig from '@/config/siteConfig';

// Use the config value
const { googleAnalyticsId } = siteConfig.analytics;
```