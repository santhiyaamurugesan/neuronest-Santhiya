import asyncHandler from 'express-async-handler';
import * as orderService from '../services/orderService.js';


const addOrderItems = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.createOrder(req.user._id, req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const getOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});


const updateOrderToPaid = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToPaid(req.params.id, req.body);
        res.json(updatedOrder);
    } catch (error) {
        res.status(error.message === 'Order not found' ? 404 : 400);
        throw new Error(error.message);
    }
});


const updateOrderToDelivered = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToDelivered(req.params.id);
        res.json(updatedOrder);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});


const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getMyOrders(req.user._id);
    res.json(orders);
});


const getOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getOrders();
    res.json(orders);
});


const cancelOrder = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.cancelOrder(req.params.id);
        res.json(updatedOrder);
    } catch (error) {
        res.status(error.message === 'Order not found' ? 404 : 400);
        throw new Error(error.message);
    }
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    cancelOrder,
};
