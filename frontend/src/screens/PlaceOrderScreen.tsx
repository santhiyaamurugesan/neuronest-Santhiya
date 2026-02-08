import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import type { RootState, CartItem } from '../types';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress?.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress?.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems.map((item) => ({
                    ...item,
                    product: item._id,
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: Number(cart.itemsPrice),
                shippingPrice: Number(cart.shippingPrice),
                taxPrice: Number(cart.taxPrice),
                totalPrice: Number(cart.totalPrice),
            }).unwrap();
            toast.success('Order placed successfully');
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err: any) {
            toast.error(err?.data?.message || err.message || 'Failed to place order');
        }
    };

    return (
        <div className="place-order-screen py-3">
            <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Final Review</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className="py-4">
                            <h3 style={{ fontSize: '1.4rem' }}>Shipping Details</h3>
                            <p className="mb-0">
                                <strong>Delivery to: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                                {cart.shippingAddress.postalCode},{' '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item className="py-4">
                            <h3 style={{ fontSize: '1.4rem' }}>Payment Method</h3>
                            <p className="mb-0">
                                <strong>Selected: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item className="py-4 border-0">
                            <h3 style={{ fontSize: '1.4rem' }}>Order Items</h3>
                            {cart.cartItems.length === 0 ? (
                                <Message>Your cart is empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item: CartItem, index: number) => (
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
                                                    <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'var(--secondary-color)', fontWeight: '500' }}>
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
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm border-top border-primary border-4" style={{ borderRadius: '8px' }}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item className="p-4">
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Order Summary</h2>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Items Subtotal:</span>
                                    <span>₹{Number(cart.itemsPrice).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping Charges:</span>
                                    <span>₹{Number(cart.shippingPrice).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>GST (3%):</span>
                                    <span>₹{Number(cart.taxPrice).toLocaleString('en-IN')}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total Amount:</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.1rem' }}>₹{Number(cart.totalPrice).toLocaleString('en-IN')}</span>
                                </div>

                                {error && (
                                    <Message variant='danger'>{(error as any)?.data?.message || 'Error creating order'}</Message>
                                )}

                                <Button
                                    type='button'
                                    className='btn-block py-3'
                                    disabled={cart.cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                    style={{ width: '100%', background: 'var(--primary-color)', border: 'none', fontWeight: 'bold', letterSpacing: '1px' }}
                                >
                                    PROCEED TO PLACE ORDER
                                </Button>
                                {isLoading && <Loader />}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;
