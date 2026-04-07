'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C2340] border-t border-[#1a3a5c]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-great-vibes text-3xl text-white">AndyLukJr</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Capturing moments that tell stories, preserving memories that last forever.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c3.4386 0 3.866.015 5.2166.076 1.3448.061 2.267.284 3.075.598.835.325 1.542.76 2.248 1.466.64.64 1.14 1.418 1.466 2.248.314.808.537 1.73.598 3.075.061 1.35.076 1.778.076 5.2166 0 3.4386-.015 3.866-.076 5.2166-.061 1.3448-.284 2.267-.598 3.075-.325.835-.76 1.542-1.466 2.248-.64.64-1.418 1.14-2.248 1.466-.808.314-1.73.537-3.075.598-1.35.061-1.778.076-5.2166.076-3.4386 0-3.866-.015-5.2166-.076-1.3448-.061-2.267-.284-3.075-.598-.835-.325-1.542-.76-2.248-1.466-.64-.64-1.14-1.418-1.466-2.248-.314-.808-.537-1.73-.598-3.075-.061-1.35-.076-1.778-.076-5.2166 0-3.4386.015-3.866.076-5.2166.061-1.3448.284-2.267.598-3.075.325-.835.76-1.542 1.466-2.248.64-.64 1.418-1.14 2.248-1.466.808-.314 1.73-.537 3.075-.598 1.35-.061 1.778-.076 5.2166-.076zm0-2.001c-3.488 0-3.927.015-5.295.077-1.3668.062-2.298.285-3.115.603-.848.33-1.562.77-2.278 1.486-.65.65-1.155 1.428-1.485 2.277-.318.818-.54 1.75-.603 3.115-.062 1.368-.077 1.807-.077 5.295 0 3.488.015 3.927.077 5.295.062 1.3668.285 2.298.603 3.115.33.848.77 1.562 1.486 2.278.65.65 1.428 1.155 2.277 1.485.818.318 1.75.54 3.115.603 1.368.062 1.807.077 5.295.077 3.488 0 3.927-.015 5.295-.077 1.3668-.062 2.298-.285 3.115-.603.848-.33 1.562-.77 2.278-1.486.65-.65 1.155-1.428 1.485-2.277.318-.818.54-1.75.603-3.115.062-1.368.077-1.807.077-5.295 0-3.488-.015-3.927-.077-5.295-.062-1.3668-.285-2.298-.603-3.115-.33-.848-.77-1.562-1.486-2.278-.65-.65-1.428-1.155-2.277-1.485-.818-.318-1.75-.54-3.115-.603-1.368-.062-1.807-.077-5.295-.077z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M12.315 5.665a6.335 6.335 0 100 12.67 6.335 6.335 0 000-12.67zm0 10.669a4.334 4.334 0 110-8.668 4.334 4.334 0 010 8.668z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M17.25 5.03a1.115 1.115 0 100 2.23 1.115 1.115 0 000-2.23z" clipRule="evenodd"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Upload
                </Link>
              </li>
              <li>
                <Link href="/edit" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Edit
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@andylukijr.com" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  contact@andylukijr.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400 text-sm">Lusaka, Zambia</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest photography updates and featured works.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1a3a5c] border border-[#2a4a6c] text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-white text-[#0C2340] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#1a3a5c] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Andy Luki Jr. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}