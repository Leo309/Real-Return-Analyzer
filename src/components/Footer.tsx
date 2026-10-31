'use client';

import React from 'react';
import Link from 'next/link';
import siteConfig from '@/config/siteConfig';

export default function Footer() {
  return (
    <footer className="bg-[#191919] text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Company Info */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <span className="text-xl font-bold tracking-tight text-white">
                SKYNEX
              </span>
            </div>
            <p className="mb-4 text-gray-400 text-sm leading-relaxed">
              SKYNEX DIGITAL<br />
              Building data-driven, AI-powered products to enhance financial, e-commerce, and business solutions globally.
            </p>
            <div className="flex space-x-4">
              <Link href={siteConfig.socialLinks.linkedin} className="text-gray-500 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.twitter} className="text-gray-500 hover:text-white transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:ml-auto">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-500 hover:text-white transition-colors text-sm">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href={siteConfig.externalUrls.mainSite} className="text-gray-500 hover:text-white transition-colors text-sm">
                  Main Site
                </Link>
              </li>
              <li>
                <Link href={siteConfig.externalUrls.contact} className="text-gray-500 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`https://${siteConfig.siteInfo.domain}`} className="text-gray-500 hover:text-white transition-colors text-sm">
                  {siteConfig.siteInfo.name}
                </Link>
              </li>
              <li>
                <span className="text-gray-600 text-sm">CollabOS</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-600 mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} SKYNEX DIGITAL. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <Link href={siteConfig.externalUrls.privacyPolicy} className="text-xs text-gray-600 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href={siteConfig.externalUrls.termsOfService} className="text-xs text-gray-600 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
