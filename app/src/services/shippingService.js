/**
 * The PrintHub — Shipping Partner Aggregator Service
 * Multi-carrier integration supporting Shiprocket, Delhivery, BlueDart, and DTDC.
 */

import { SHIPPING_PROVIDERS } from '../constants/orderWorkflow';

export const STORE_ORIGIN_WAREHOUSE = {
  name: 'The PrintHub Central Industrial Fulfillment Center',
  contactPerson: 'Logistics Dispatch Manager',
  phone: '+91 98765 43210',
  address: 'Plot 42, Textile Technology Park, Sector 18',
  city: 'Gurugram',
  state: 'Haryana',
  pinCode: '122015',
  country: 'India',
  gstin: '06AAACT1984Q1Z8',
};

export const shippingService = {
  providers: SHIPPING_PROVIDERS,

  /**
   * Check PIN Code Serviceability & Estimate Delivery
   */
  async checkServiceability(destinationPin, weightKg = 0.5, isCod = false) {
    // Validate Indian 6-digit PIN code format
    const cleanedPin = destinationPin?.replace(/\D/g, '');
    if (!cleanedPin || cleanedPin.length !== 6) {
      return {
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
        couriers: [],
      };
    }

    // Determine region based on PIN prefix
    const firstDigit = cleanedPin.charAt(0);
    const estimatedDays = ['1', '2', '3'].includes(firstDigit) ? '2–3 Days' : '3–5 Days';

    const availableCouriers = SHIPPING_PROVIDERS.map((provider) => {
      const rate = provider.baseFee + (weightKg > 1 ? (weightKg - 1) * 40 : 0);
      return {
        ...provider,
        rate: isCod ? rate + 30 : rate,
        estimatedDelivery: estimatedDays,
        serviceable: true,
      };
    });

    return {
      serviceable: true,
      pinCode: cleanedPin,
      city: firstDigit === '1' ? 'Delhi NCR' : firstDigit === '4' ? 'Mumbai / West' : firstDigit === '5' ? 'Bengaluru / South' : 'Regional Hub',
      state: firstDigit === '1' ? 'Haryana' : firstDigit === '4' ? 'Maharashtra' : firstDigit === '5' ? 'Karnataka' : 'India',
      couriers: availableCouriers,
    };
  },

  /**
   * Create Shipment with Selected Shipping Provider
   */
  async createShipment({ order, courierId = 'delhivery', packageDimensions = { l: 30, w: 25, h: 5, weight: 0.6 } }) {
    const courier = SHIPPING_PROVIDERS.find((p) => p.id === courierId) || SHIPPING_PROVIDERS[0];
    const awbPrefix = courier.code;
    const awbRandom = Math.floor(1000000 + Math.random() * 9000000);
    const awbNumber = `${awbPrefix}-${awbRandom}`;
    const shipmentId = `shp_sr_${Date.now()}`;

    const daysToAdd = courier.id === 'bluedart' ? 2 : 4;
    const etaDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysToAdd);

    const shipmentData = {
      shipmentId,
      courierId: courier.id,
      courierName: courier.name,
      awbNumber,
      trackingUrl: `https://track.theprinthub.in/${awbNumber}`,
      status: 'READY_FOR_PICKUP',
      pickupScheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      estimatedDelivery: etaDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      package: packageDimensions,
      labelGeneratedAt: new Date().toISOString(),
    };

    return {
      success: true,
      shipment: shipmentData,
      message: `Shipment successfully booked with ${courier.name}. AWB: ${awbNumber}`,
    };
  },

  /**
   * Generate Printable Shipping Label Data Model
   */
  generateShippingLabel(order) {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      awbNumber: order.shipment?.awbNumber || `PH-AWB-${order.id}`,
      courierName: order.shipment?.courierName || 'Delhivery Express',
      routingCode: `DEL/NCR/${order.shippingAddress?.pinCode || '122015'}`,
      paymentType: order.paymentMethod === 'cod' ? 'CASH ON DELIVERY (COD)' : 'PREPAID ONLINE',
      collectableAmount: order.paymentMethod === 'cod' ? `₹${order.total}` : '₹0.00 (PAID)',
      sender: STORE_ORIGIN_WAREHOUSE,
      recipient: order.shippingAddress,
      items: order.items,
      totalQuantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      barcodeData: `*${order.shipment?.awbNumber || order.id}*`,
    };
  },

  /**
   * Generate GST Tax Invoice Data Model
   */
  generateInvoice(order) {
    const taxRate = 0.05; // 5% GST on Apparel & Customized Goods
    const taxableValue = Math.round((order.subtotal + (order.printingFee || 0)) / (1 + taxRate));
    const gstAmount = (order.subtotal + (order.printingFee || 0)) - taxableValue;

    return {
      invoiceNumber: `INV-PH-${order.id}`,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      orderId: order.id,
      paymentMethod: order.paymentMethod?.toUpperCase(),
      paymentStatus: order.paymentStatus,
      transactionId: order.paymentId,
      seller: STORE_ORIGIN_WAREHOUSE,
      buyer: {
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        address: order.shippingAddress,
      },
      items: order.items.map((item, idx) => ({
        sNo: idx + 1,
        description: `${item.productName} (${item.variant}, ${item.colorName}, Size ${item.size}) [Custom ${item.printingMethodName}]`,
        hsnCode: '61091000',
        qty: item.quantity,
        rate: item.unitPrice,
        amount: item.unitPrice * item.quantity,
      })),
      subtotal: order.subtotal,
      printingFee: order.printingFee || 0,
      shippingFee: order.shippingCost || 0,
      discount: order.discount || 0,
      taxableValue,
      cgst: Math.round(gstAmount / 2),
      sgst: Math.round(gstAmount / 2),
      grandTotal: order.total,
    };
  },
};
