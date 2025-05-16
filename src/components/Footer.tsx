'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '@/config/siteConfig';

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-cyan-500/20 rounded-full filter blur-[80px]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Company Info */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <Image 
                src="/SKYNEX_500_WHITE.png" 
                alt="SKYNEX" 
                width={160} 
                height={48} 
                className="h-12 w-auto object-contain" 
              />
            </div>
            <p className="mb-4 text-gray-300">
              SKYNEX DIGITAL<br />
              Building data-driven, AI-powered products to enhance financial, e-commerce, and business solutions globally as SaaS.
            </p>
            <div className="flex space-x-4">
              <Link href={siteConfig.socialLinks.linkedin} className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.twitter} className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:ml-auto">
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href={siteConfig.externalUrls.mainSite} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Main Site
                </Link>
              </li>
              <li>
                <Link href={`${siteConfig.externalUrls.mainSite}/about`} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`${siteConfig.externalUrls.mainSite}/products`} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Our Products
                </Link>
              </li>
              <li>
                <Link href={siteConfig.externalUrls.contact} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Our Products
            </h3>
            <ul className="space-y-4">
              <li className="group">
                <Link href={`https://${siteConfig.siteInfo.domain}`} className="bg-white/5 backdrop-blur-sm hover:bg-white/10 p-3 px-4 rounded-lg border border-white/10 flex items-center transition-all duration-300">
                  <span className="h-9 w-9 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300 text-sm">
                      {siteConfig.siteInfo.name}
                    </span>
                  </div>
                </Link>
              </li>
              <li className="group">
                <div className="bg-white/5 backdrop-blur-sm p-3 px-4 rounded-lg border border-white/10 flex items-center transition-all duration-300">
                  <span className="h-9 w-9 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300 text-sm">
                      CollabOS
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-500 mb-3 md:mb-0">
            <p>&copy; {new Date().getFullYear()} SKYNEX DIGITAL. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href={siteConfig.externalUrls.privacyPolicy} className="text-xs text-gray-500 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href={siteConfig.externalUrls.termsOfService} className="text-xs text-gray-500 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}