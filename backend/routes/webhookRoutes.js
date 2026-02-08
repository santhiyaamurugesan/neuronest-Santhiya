import express from 'express';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';

const router = express.Router();

router.post('/razorpay', async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
        console.error('RAZORPAY_WEBHOOK_SECRET not set');
        return res.status(500).send('Configuration Error');
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const event = req.body.event;
        const payload = req.body.payload;

        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const orderId = payment.order_id; 

        
            console.log('Payment Captured Webhook Received:', payment.id);

        }
        res.json({ status: 'ok' });
    } else {
        res.status(400).send('Invalid Signature');
    }
});

export default router;
