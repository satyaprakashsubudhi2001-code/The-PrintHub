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
    instagram: 'https://instagram.com/theprinthub',
    twitter: 'https://twitter.com/theprinthub',
    facebook: 'https://facebook.com/theprinthub',
  }
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
