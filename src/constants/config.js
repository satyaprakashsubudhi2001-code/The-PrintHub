// Central Configuration for The PrintHub Platform

export const STORE_CONFIG = {
  storeName: 'The PrintHub',
  domain: 'theprinthub.in',
  siteUrl: 'https://theprinthub.in',
  tagline: 'Premium Custom Printing & Product Design Studio',
  supportEmail: 'theprinthub.in@gmail.com',
  // Configurable WhatsApp Business Contact Number (international format without + or spaces)
  whatsappNumber: import.meta.env?.VITE_WHATSAPP_NUMBER || '917992801158',
  supportPhone: '+91 79928 01158',
  currencySymbol: '₹',
  currencyCode: 'INR',
  socialLinks: {
    instagram: 'https://instagram.com/theprinthub_official',
    twitter: 'https://twitter.com/theprinthub',
    facebook: 'https://facebook.com/theprinthub',
  }
};

/**
 * Central Official The PrintHub Social & Contact Links Configuration
 * Used across Top Announcement Bar, Footer, and Floating widgets.
 */
export const OFFICIAL_CONTACT_LINKS = {
  WHATSAPP_URL: `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hi The PrintHub! I would like to enquire about custom merchandise and orders.')}`,
  INSTAGRAM_URL: 'https://instagram.com/theprinthub_official',
  FACEBOOK_URL: 'https://facebook.com/theprinthub',
  WHATSAPP_CATALOG_URL: `https://wa.me/c/${STORE_CONFIG.whatsappNumber}`,
  EMAIL_ADDRESS: STORE_CONFIG.supportEmail,
  GMAIL_URL: `mailto:${STORE_CONFIG.supportEmail}?subject=${encodeURIComponent('The PrintHub Inquiry')}`,
  GOOGLE_MAPS_URL: 'https://maps.google.com/?q=The+PrintHub+Sector+18+Gurugram+Haryana+122015',
  PHONE_NUMBER: STORE_CONFIG.supportPhone,
};

/**
 * Builds a contextual WhatsApp chat URL for design inquiries.
 */
export function getWhatsAppChatUrl({
  productName = 'Custom Merch',
  variant = '',
  colorName = '',
  size = '',
  quantity = 1,
  printingMethodName = '',
  totalPrice = 0,
}) {
  const number = STORE_CONFIG.whatsappNumber;
  let text = `Hi The PrintHub! I would like to enquire about custom merchandise: *${productName}*`;

  if (variant) text += ` (${variant})`;
  if (colorName) text += `\n• *Color*: ${colorName}`;
  if (size) text += `\n• *Size*: ${size}`;
  if (quantity) text += `\n• *Quantity*: ${quantity} pcs`;
  if (printingMethodName) text += `\n• *Print Method*: ${printingMethodName}`;
  if (totalPrice) text += `\n• *Starting Price*: ₹${totalPrice.toLocaleString()}`;

  text += `\n\nCould you please assist me with my design concept and quotation?`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
