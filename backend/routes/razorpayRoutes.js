import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import paymentService from '../services/paymentService.js';
import Order from '../models/orderModel.js';

const router = express.Router();

  
router.post('/order', protect, asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to pay for this order');
    }

    const receipt = `receipt_${orderId}`;

    try {
        const razorpayOrder = await paymentService.createOrder(order.totalPrice, receipt);
        res.status(201).json(razorpayOrder);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}));


router.post('/verify', protect, asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    try {
        const isValid = paymentService.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isValid) {
            res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));

export default router;
