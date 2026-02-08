import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation, useCancelOrderMutation } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { loadRazorpayScript } from '../utils/paymentUtils';
import type { RootState, RazorpayOptions, RazorpayResponse } from '../types';

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => { open: () => void };
    }
}

const OrderScreen = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId!);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

    const auth = useSelector((state: RootState) => state.auth);
    const userInfo = auth?.userInfo;

    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (order && !order.isPaid) {
        }
    }, [order]);

    const successPaymentHandler = async (paymentResult: RazorpayResponse) => {
        try {
            await payOrder({ orderId: orderId!, details: paymentResult });
            refetch();
            toast.success('Payment successful');
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Payment failed');
        }
    };

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId!);
            refetch();
            toast.success('Order delivered');
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Delivery update failed');
        }
    };

    const cancelOrderHandler = () => {
        setShowCancelModal(true);
    };

    const confirmCancelHandler = async () => {
        setShowCancelModal(false);
        try {
            await cancelOrder(orderId!).unwrap();
            refetch();
            toast.success('Order cancelled successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Order cancellation failed');
        }
    };



    const handleRazorpayPayment = async () => {
        if (!order || !userInfo) return;

        const res = await loadRazorpayScript();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/razorpay/order',
                { orderId: order._id },
                config
            );

            const { data: { key: razorpayKey } } = await axios.get('/api/config/razorpay');

            const options = {
                key: razorpayKey,
                amount: data.amount,
                currency: data.currency,
                name: "GoldenGrace Jewelry",
                description: `Order #${order._id}`,
                image: "/images/logo.png",
                order_id: data.id,
                handler: async function (response: RazorpayResponse) {
                    successPaymentHandler({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        email_address: userInfo.email
                    });
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: ""
                },
                theme: {
                    color: "#B8904D"
                },
                modal: {
                    ondismiss: function () {
                        toast.info('Payment cancelled');
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Could not initiate payment');
        }
    };

    if (isLoading) return <Loader />;

    if (error) {
        return <Message variant='danger'>{
            (error as any)?.data?.message ||
            (error as any).error ||
            'Error loading order details'
        }</Message>;
    }

    if (!order) {
        return <Message variant='info'>
            Order not found. It might not exist or you may not have permission to view it.
        </Message>;
    }

    return (
        <div className="order-screen">
            <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>Order #{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className="py-4">
                            <h3>Shipping</h3>
                            <p>
                                <strong>Name: </strong> {order.user?.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{' '}
                                <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress?.address}, {order.shippingAddress?.city}{' '}
                                {order.shippingAddress?.postalCode},{' '}
                                {order.shippingAddress?.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>
                                    Delivered on {order.deliveredAt?.substring(0, 10)}
                                </Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                            {order.isCancelled && (
                                <Message variant='danger'>Order Cancelled on {order.cancelledAt?.substring(0, 10)}</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item className="py-4">
                            <h3>Payment Method</h3>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt?.substring(0, 10)}</Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item className="py-4 border-0">
                            <h3>Order Items</h3>
                            <ListGroup variant='flush'>
                                {order.orderItems?.map((item: any, index: number) => (
                                    <ListGroup.Item key={index} className="px-0">
                                        <Row className="align-items-center g-3">
                                            <Col xs={4} md={2}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fluid
                                                    rounded
                                                    style={{ maxHeight: '50px', objectFit: 'cover' }}
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={8} md={6}>
                                                <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'var(--secondary-color)', fontWeight: '500' }}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                                                {item.qty} x ₹{item.price.toLocaleString('en-IN')} = <strong>₹{(item.qty * item.price).toLocaleString('en-IN')}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <ListGroup variant='flush'>
                            <ListGroup.Item className="bg-light p-4">
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Order Summary</h2>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Items:</span>
                                    <span>₹{(order.itemsPrice || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>₹{order.shippingPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tax:</span>
                                    <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span style={{ fontWeight: 'bold' }}>Total:</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>

                                {!order.isPaid && !order.isCancelled && (
                                    <div className="mt-3">
                                        {loadingPay && <Loader />}
                                        <Button
                                            onClick={handleRazorpayPayment}
                                            className='btn-block py-2 w-100'
                                            style={{ background: 'var(--primary-color)', border: 'none', fontWeight: 'bold' }}
                                        >
                                            PAY WITH RAZORPAY
                                        </Button>
                                    </div>
                                )}

                                {userInfo && !order.isPaid && !order.isDelivered && !order.isCancelled && (
                                    <div className="mt-3">
                                        {loadingCancel && <Loader />}
                                        <Button
                                            type='button'
                                            className='btn btn-block w-100 py-2'
                                            onClick={cancelOrderHandler}
                                            style={{ background: '#dc3545', border: 'none', fontWeight: 'bold' }}
                                        >
                                            CANCEL ORDER
                                        </Button>
                                    </div>
                                )}

                                {loadingDeliver && <Loader />}
                                {userInfo &&
                                    userInfo.isAdmin &&
                                    order.isPaid &&
                                    !order.isDelivered && (
                                        <div className="mt-3">
                                            <Button
                                                type='button'
                                                className='btn btn-block w-100 py-2'
                                                onClick={deliverOrderHandler}
                                                style={{ background: '#2c3e50', border: 'none', fontWeight: 'bold' }}
                                            >
                                                MARK AS DELIVERED
                                            </Button>
                                        </div>
                                    )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'var(--font-serif)' }}>Cancel Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel this order?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        No, Keep Order
                    </Button>
                    <Button variant="danger" onClick={confirmCancelHandler}>
                        Yes, Cancel Order
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderScreen;
