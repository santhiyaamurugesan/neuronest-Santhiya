import axios from 'axios';

export const sendWhatsAppMessage = async (to, templateName, components) => {
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneId || !token) {
        console.warn('WhatsApp credentials missing. Skipping message send.');
        return { skipped: true };
    }

    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

    const data = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
            name: templateName,
            language: { code: "en_US" },
            components: components
        }
    };

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, data, config);
        console.log('WhatsApp message sent successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error('WhatsApp API Error:', error.response.data);
            throw new Error(`WhatsApp API Error: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error('WhatsApp No Response:', error.request);
            throw new Error('WhatsApp API No Response');
        } else {
            console.error('WhatsApp Request Error:', error.message);
            throw new Error(`WhatsApp Request Error: ${error.message}`);
        }
    }
};

export const sendOrderConfirmation = async (order) => {
    if (!order.user || !order.user.phoneNumber) {
        console.log('No phone number for user, skipping WhatsApp notification.');
        return;
    }

    const itemsSummary = order.orderItems.map(item => `${item.name} (${item.qty})`).join(', ');
    const itemsStr = itemsSummary.length > 50 ? itemsSummary.substring(0, 47) + '...' : itemsSummary;

    const addressStr = order.shippingAddress
        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
        : 'Address N/A';

    const components = [
        {
            type: "body",
            parameters: [
                { type: "text", text: String(order._id) },
                { type: "text", text: itemsStr },
                { type: "text", text: String(order.totalPrice) },
                { type: "text", text: addressStr }
            ]
        }
    ];

    try {
        await sendWhatsAppMessage(order.user.phoneNumber, "payment_received", components);
    } catch (error) {
        console.error('Failed to send order confirmation WhatsApp:', error.message);
    }
};

export const sendOrderCancellation = async (order) => {
    if (!order.user || !order.user.phoneNumber) {
        console.log('No phone number for user, skipping WhatsApp notification.');
        return;
    }

    const itemsSummary = order.orderItems.map(item => `${item.name} (${item.qty})`).join(', ');
    const itemsStr = itemsSummary.length > 50 ? itemsSummary.substring(0, 47) + '...' : itemsSummary;

    const components = [
        {
            type: "body",
            parameters: [
                { type: "text", text: String(order._id) },
                { type: "text", text: itemsStr }
            ]
        }
    ];

    try {
        await sendWhatsAppMessage(order.user.phoneNumber, "order_cancelled", components);
    } catch (error) {
        console.error('Failed to send cancellation WhatsApp:', error.message);
    }
};
