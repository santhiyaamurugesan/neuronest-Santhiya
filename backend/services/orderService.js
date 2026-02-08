import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';
import { sendOrderConfirmation, sendOrderCancellation } from './notificationService.js';
import paymentService from './paymentService.js';

export const createOrder = async (userId, orderData) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = orderData;

    if (!orderItems || orderItems.length === 0) {
        throw new Error('No order items');
    }

    const order = new Order({
        orderItems,
        user: userId,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();
    return createdOrder;
};

export const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId).populate('user', 'name email phoneNumber');
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

export const updateOrderToPaid = async (orderId, paymentDetails) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session).populate('user', 'name email phoneNumber');

        if (!order) {
            throw new Error('Order not found');
        }

        if (paymentDetails.razorpay_signature) {
            try {
                paymentService.verifyPayment(
                    paymentDetails.razorpay_order_id,
                    paymentDetails.razorpay_payment_id,
                    paymentDetails.razorpay_signature
                );
            } catch (error) {
                throw new Error('Invalid Payment Signature');
            }
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: paymentDetails.razorpay_payment_id || paymentDetails.id,
            status: 'COMPLETED',
            update_time: String(Date.now()),
            email_address: paymentDetails.email_address || order.user.email,
        };

        const updatedOrder = await order.save({ session });

        const paymentRecord = new Payment({
            order: order._id,
            user: order.user._id,
            paymentMethod: order.paymentMethod,
            amount: order.totalPrice,
            status: 'Completed',
            paymentResult: order.paymentResult,
        });
        await paymentRecord.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Send notification separately so potential failure doesn't rollback payment
        sendOrderConfirmation(updatedOrder).catch(err =>
            console.error('Background Notification Error:', err)
        );

        return updatedOrder;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    const order = await Order.findById(orderId).populate('user', 'name email phoneNumber');

    if (!order) {
        throw new Error('Order not found');
    }

    if (order.isDelivered) {
        throw new Error('Cannot cancel delivered order');
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();

    const updatedOrder = await order.save();

    sendOrderCancellation(updatedOrder).catch(err =>
        console.error('Background Notification Error:', err)
    );

    return updatedOrder;
};

export const getMyOrders = async (userId) => {
    return await Order.find({ user: userId });
};

export const getOrders = async () => {
    return await Order.find({}).populate('user', 'id name');
};

export const updateOrderToDelivered = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error('Order not found');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    return await order.save();
};
