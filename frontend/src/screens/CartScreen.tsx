import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap';
import { HiOutlineTrash } from 'react-icons/hi2';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import type { RootState, CartItem } from '../types';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state: RootState) => state.cart);
    const cartItems = cart?.cartItems || [];

    const addToCartHandler = async (product: CartItem, qty: number) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = async (id: string) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <Container className="py-5">
            <h1 className="mb-5" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--secondary-color)' }}>
                Your Shopping Bag
            </h1>
            <Row className="gy-4">
                <Col lg={8}>
                    {cartItems.length === 0 ? (
                        <Message>
                            Your shopping bag is empty. <Link to='/' className="fw-bold" style={{ color: 'var(--primary-color)' }}>Explore Our Collections</Link>
                        </Message>
                    ) : (
                        <ListGroup variant='flush' className="border-top">
                            {cartItems.map((item: CartItem) => (
                                <ListGroup.Item key={item._id} className="py-4 border-bottom px-0" style={{ background: 'transparent' }}>
                                    <Row className="align-items-center g-3">
                                        <Col xs={4} md={2}>
                                            <div style={{ border: '1px solid rgba(184, 144, 77, 0.1)', padding: '5px', borderRadius: '4px', background: 'white' }}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fluid
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={8} md={4}>
                                            <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'var(--secondary-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                                                {item.name}
                                            </Link>
                                            <div className="text-muted small mt-1" style={{ letterSpacing: '1px' }}>{item.category}</div>
                                        </Col>
                                        <Col xs={4} md={2} style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </Col>
                                        <Col xs={4} md={2}>
                                            <Form.Control
                                                as='select'
                                                value={item.qty}
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                                style={{
                                                    borderRadius: '0',
                                                    border: '1px solid rgba(184, 144, 77, 0.2)',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {[...Array(item.countInStock || 0).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col xs={4} md={2} className="text-end">
                                            <Button
                                                type='button'
                                                variant='link'
                                                onClick={() => removeFromCartHandler(item._id)}
                                                style={{ color: '#8E7C6F' }}
                                            >
                                                <HiOutlineTrash size={22} />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <div className="p-4 bg-white">
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--secondary-color)' }}>
                                Order Summary
                            </h3>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Subtotal ({cartItems.reduce((acc: number, item: any) => acc + (item.qty || 0), 0)} items)</span>
                                <span>₹{cartItems.reduce((acc: number, item: any) => acc + (item.qty || 0) * item.price, 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Shipping</span>
                                <span className="text-success fw-bold">Complimentary</span>
                            </div>
                            <hr style={{ opacity: '0.1' }} />
                            <div className="d-flex justify-content-between mb-5 mt-4">
                                <span style={{ fontWeight: '600', fontSize: '1.2rem', color: 'var(--secondary-color)' }}>Estimated Total</span>
                                <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                                    ₹{cartItems.reduce((acc: number, item: any) => acc + (item.qty || 0) * item.price, 0).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <Button
                                type='button'
                                className='btn-primary w-100 py-3'
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                                style={{ letterSpacing: '2px' }}
                            >
                                PROCEED TO CHECKOUT
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartScreen;
