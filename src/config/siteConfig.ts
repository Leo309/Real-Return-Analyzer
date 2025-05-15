// Site configuration values
// This centralized configuration helps maintain consistency across environments

// External URLs - Main Skynex website links
const externalUrls = {
  mainSite: process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.skynexdigital.com',
  privacyPolicy: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || 'https://www.skynexdigital.com/privacy',
  termsOfService: process.env.NEXT_PUBLIC_TERMS_URL || 'https://www.skynexdigital.com/terms',
  contact: process.env.NEXT_PUBLIC_CONTACT_URL || 'https://www.skynexdigital.com/contact'
};

// Site Information
const siteInfo = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Real Return Analyzer',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'realreturns.skynexdigital.com',
  company: process.env.NEXT_PUBLIC_COMPANY_NAME || 'SKYNEX DIGITAL',
  email: 'support@skynexdigital.com'
};

// Social media links
const socialLinks = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/skynex-digital',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/SKYNEX_Digital'
};

// Export all config values
const siteConfig = {
  externalUrls,
  siteInfo,
  socialLinks
};

export default siteConfig;