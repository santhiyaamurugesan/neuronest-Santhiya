import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';


jest.unstable_mockModule('../services/orderService.js', () => ({
    createOrder: jest.fn(),
    getOrderById: jest.fn(),
    updateOrderToPaid: jest.fn(),
    getMyOrders: jest.fn(),
    getOrders: jest.fn(),
    updateOrderToDelivered: jest.fn(),
    cancelOrder: jest.fn(),
}));

jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
    protect: (req, res, next) => {
        req.user = { _id: 'testuserid' };
        next();
    },
    admin: (req, res, next) => {
        next();
    }
}));

const orderService = await import('../services/orderService.js');
const { default: orderRoutes } = await import('../routes/orderRoutes.js');
const { notFound, errorHandler } = await import('../middleware/errorMiddleware.js');
const dotenv = await import('dotenv');

dotenv.default.config();

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use(notFound);
app.use(errorHandler);

describe('Order API Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/orders - should create an order successfully', async () => {
        const mockOrder = {
            _id: 'order123',
            user: 'testuserid',
            totalPrice: 100,
            isPaid: false
        };

        orderService.createOrder.mockResolvedValue(mockOrder);

        const res = await request(app)
            .post('/api/orders')
            .send({
                orderItems: [{ name: 'Test Item', qty: 1, price: 100, product: 'prod123' }],
                totalPrice: 100,
                paymentMethod: 'Razorpay'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(mockOrder);
        expect(orderService.createOrder).toHaveBeenCalledWith('testuserid', expect.any(Object));
    });

    test('POST /api/orders - should fail if no items', async () => {
        orderService.createOrder.mockRejectedValue(new Error('No order items'));

        const res = await request(app)
            .post('/api/orders')
            .send({ orderItems: [] });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('No order items');
    });

    test('GET /api/orders/:id - should get order by id', async () => {
        const mockOrder = { _id: 'order123', totalPrice: 100 };
        orderService.getOrderById.mockResolvedValue(mockOrder);

        const res = await request(app).get('/api/orders/order123');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockOrder);
    });

    test('PUT /api/orders/:id/pay - should verify signature and mark paid', async () => {
        const mockPaidOrder = { _id: 'order123', isPaid: true };
        orderService.updateOrderToPaid.mockResolvedValue(mockPaidOrder);

        const res = await request(app)
            .put('/api/orders/order123/pay')
            .send({
                razorpay_payment_id: 'pay_123',
                razorpay_order_id: 'order_123',
                razorpay_signature: 'sig_123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockPaidOrder);
        expect(orderService.updateOrderToPaid).toHaveBeenCalledTimes(1);
    });
});
