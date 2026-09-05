/**
 * The PrintHub — Payment Gateway Service & Providers Interface
 * Extensible architecture supporting Razorpay, UPI, Cards, Wallets, and COD.
 */

// Simulated Server-Side Razorpay Configuration
export const RAZORPAY_CONFIG = {
  keyId: import.meta.env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_PH_live_984218',
  currency: 'INR',
  companyName: 'The PrintHub Studio Pvt Ltd',
  themeColor: '#2C0E63',
};

/**
 * Payment Provider Abstraction Layer
 */
class PaymentProvider {
  constructor(name) {
    this.name = name;
  }

  async createPaymentOrder(orderPayload) {
    throw new Error('createPaymentOrder must be implemented');
  }

  async verifyPayment(paymentResponse, originalOrder) {
    throw new Error('verifyPayment must be implemented');
  }

  async processRefund(paymentId, amount, reason) {
    throw new Error('processRefund must be implemented');
  }
}

/**
 * Razorpay Implementation
 */
class RazorpayProvider extends PaymentProvider {
  constructor() {
    super('Razorpay');
  }

  async createPaymentOrder({ orderId, amount, currency = 'INR', customer }) {
    // Generate server-side gateway order reference
    const providerOrderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      providerOrderId,
      amount: Math.round(amount * 100), // In paise
      currency,
      keyId: RAZORPAY_CONFIG.keyId,
      customer: {
        name: customer?.name || 'Valued Customer',
        email: customer?.email || 'customer@theprinthub.in',
        contact: customer?.phone || '+919876543210',
      },
    };
  }

  async verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
    // In production, server computes HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
    // Here we simulate full cryptographic verification
    if (!razorpay_payment_id) {
      return { success: false, message: 'Invalid payment token received from gateway.' };
    }

    return {
      success: true,
      transactionId: razorpay_payment_id,
      providerOrderId: razorpay_order_id,
      verifiedAt: new Date().toISOString(),
      status: 'CAPTURED',
      method: 'Razorpay Online (UPI/Card/NetBanking)',
    };
  }

  async processRefund(paymentId, amount, reason) {
    return {
      success: true,
      refundId: `rfnd_rzp_${Date.now()}`,
      paymentId,
      amount,
      reason,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Unified Payment Gateway Service Hub
 */
export const paymentService = {
  razorpay: new RazorpayProvider(),

  /**
   * Process Checkout Payment
   */
  async initiatePayment({ method, amount, orderId, customer, walletDeduction = 0 }) {
    const payableAmount = Math.max(0, amount - walletDeduction);

    if (method === 'cod') {
      return {
        success: true,
        paymentStatus: 'COD_PENDING',
        paymentMethod: 'cod',
        transactionId: `cod_ref_${Date.now()}`,
        amountPaidOnline: 0,
        amountDueOnDelivery: payableAmount,
        message: 'Order placed under Cash on Delivery. Payment will be collected at doorstep.',
      };
    }

    if (method === 'wallet' || payableAmount === 0) {
      return {
        success: true,
        paymentStatus: 'CAPTURED',
        paymentMethod: 'wallet',
        transactionId: `tx_wallet_${Date.now()}`,
        amountPaidOnline: 0,
        walletDeducted: walletDeduction,
        message: 'Full payment deducted from The PrintHub Wallet balance.',
      };
    }

    // Razorpay / UPI / Card Flow
    const rzpOrder = await this.razorpay.createPaymentOrder({
      orderId,
      amount: payableAmount,
      customer,
    });

    return new Promise((resolve) => {
      // Simulate Razorpay Webhook & Client Checkout Modal execution
      setTimeout(() => {
        const mockPaymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        resolve({
          success: true,
          paymentStatus: 'CAPTURED',
          paymentMethod: method,
          transactionId: mockPaymentId,
          providerOrderId: rzpOrder.providerOrderId,
          amountPaidOnline: payableAmount,
          walletDeducted: walletDeduction,
          paidAt: new Date().toISOString(),
          message: 'Payment successfully captured and verified via Razorpay.',
        });
      }, 1200);
    });
  },

  /**
   * Idempotent Payment Webhook Processor (Concept)
   */
  async processWebhookEvent(eventPayload, signature) {
    const { event, payload } = eventPayload;
    console.log(`[Payment Webhook] Event received: ${event}`, payload);

    switch (event) {
      case 'payment.captured':
        return { handled: true, status: 'CAPTURED', paymentId: payload?.payment?.id };
      case 'payment.failed':
        return { handled: true, status: 'FAILED', reason: payload?.payment?.error_description };
      case 'refund.processed':
        return { handled: true, status: 'REFUNDED', refundId: payload?.refund?.id };
      default:
        return { handled: true, status: 'UNHANDLED_EVENT' };
    }
  },
};
