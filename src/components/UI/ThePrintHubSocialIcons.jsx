import React from 'react';

/**
 * The PrintHub Social & Contact Icons
 * Strictly adhere to the 4-Color Luxury System:
 * - #183630 (Dark Green)
 * - #E5DAC9 (Beige)
 * - #E5C690 (Soft Gold)
 * - #B8A98F (Highlight Taupe)
 *
 * All icons use currentColor (#E5C690 by default) without third-party brand colors.
 */

export function IconWhatsApp({ className = 'w-4 h-4', size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fillOpacity="0.2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 3.5C7.4 3.5 3.63 7.27 3.63 11.91C3.63 13.43 4.03 14.89 4.79 16.17L3.8 19.8L7.52 18.82C8.75 19.52 10.15 19.91 11.62 19.91H12.04C16.68 19.91 20.45 16.14 20.45 11.91C20.45 9.66 19.57 7.55 17.98 5.96C16.39 4.37 14.28 3.5 12.04 3.5ZM16.32 14.23C16.09 14.11 14.95 13.55 14.74 13.47C14.53 13.39 14.37 13.35 14.22 13.59C14.07 13.83 13.62 14.35 13.49 14.5C13.36 14.66 13.22 14.68 12.98 14.56C12.75 14.44 12.01 14.2 11.13 13.41C10.45 12.8 9.98 12.05 9.87 11.81C9.75 11.58 9.86 11.45 9.98 11.33C10.08 11.23 10.21 11.07 10.32 10.93C10.44 10.79 10.48 10.7 10.56 10.54C10.64 10.38 10.6 10.24 10.54 10.12C10.48 10 10.04 8.91 9.85 8.47C9.67 8.04 9.49 8.1 9.36 8.1C9.23 8.09 9.09 8.09 8.94 8.09C8.79 8.09 8.55 8.15 8.36 8.36C8.16 8.58 7.61 9.09 7.61 10.15C7.61 11.2 8.38 12.22 8.49 12.36C8.6 12.5 10.01 14.67 12.16 15.6C12.67 15.82 13.07 15.96 13.38 16.06C13.9 16.22 14.36 16.2 14.74 16.14C15.15 16.08 16.01 15.62 16.19 15.11C16.37 14.6 16.37 14.17 16.32 14.08C16.26 13.99 16.12 13.95 15.96 13.87L16.32 14.23Z"
      />
    </svg>
  );
}

export function IconInstagram({ className = 'w-4 h-4', size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function IconFacebook({ className = 'w-4 h-4', size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function IconWhatsAppCatalog({ className = 'w-4 h-4', size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shopping Bag / Catalog Archive */}
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
      {/* Mini Catalog Tag indicator */}
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconGmail({ className = 'w-4 h-4', size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function IconGoogleMaps({ className = 'w-4 h-4', size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
