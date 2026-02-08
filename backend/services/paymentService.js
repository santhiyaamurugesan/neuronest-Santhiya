import Razorpay from 'razorpay';
import crypto from 'crypto';

class PaymentService {
    constructor() {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error("FATAL: Razorpay credentials missing in environment variables.");
        }
        this.instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    async createOrder(amount, receipt) {
        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: receipt,
            payment_capture: 1,
        };

        try {
            const order = await this.instance.orders.create(options);
            return order;
        } catch (error) {
            throw new Error(`Razorpay Order Creation Failed: ${error.message}`);
        }
    }

    verifyPayment(razorpayOrderId, razorpayPaymentId, signature) {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            throw new Error("FATAL: Razorpay secret key is missing in environment variables.");
        }

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== signature) {
            throw new Error('Payment verification failed: Invalid Signature');
        }
        return true;
    }
}

export default new PaymentService();
