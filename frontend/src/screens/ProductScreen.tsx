import { useState } from 'react';
import { Row, Col, Image, Form, Button, Accordion, Container } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { HiArrowLeft } from 'react-icons/hi2';

const ProductScreen = () => {
    const { id: productId } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId!);

    const addToCartHandler = () => {
        if (product) {
            dispatch(addToCart({ ...product, qty }));
            navigate('/cart');
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <Message variant='danger'>{(error as any)?.data?.message || 'Error loading product'}</Message>;
    if (!product) return null;

    return (
        <Container className="product-screen py-5">
            <Link className='d-inline-flex align-items-center mb-5 text-decoration-none' to='/' style={{ color: 'var(--primary-color)', fontWeight: '600', letterSpacing: '1px', fontSize: '0.85rem' }}>
                <HiArrowLeft className="me-2" /> GO BACK TO COLLECTION
            </Link>

            <Row className="gy-5">
                <Col md={6}>
                    <div className="product-image-frame p-4 bg-white shadow-sm" style={{ border: '1px solid rgba(184, 144, 77, 0.1)', borderRadius: '4px' }}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            fluid
                            style={{ borderRadius: '2px', width: '100%', objectFit: 'cover' }}
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80';
                            }}
                        />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="ps-md-5">
                        <div className="mb-2" style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>
                            {product.category}
                        </div>
                        <h1 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '3rem',
                            lineHeight: '1.2',
                            marginBottom: '1.5rem',
                            color: 'var(--secondary-color)'
                        }}>
                            {product.name}
                        </h1>

                        <div className="d-flex align-items-center mb-4">
                            <h2 className="price-tag m-0" style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                                ₹{product.price.toLocaleString('en-IN')}
                            </h2>
                            {product.purity && <span className="purity-badge ms-4" style={{ height: 'fit-content' }}>{product.purity}</span>}
                        </div>

                        <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{product.description}</p>

                        <hr className="my-5" style={{ opacity: '0.1' }} />

                        {product.countInStock > 0 ? (
                            <div className="my-4">
                                <Row className="align-items-center mb-4">
                                    <Col xs={3}>
                                        <span style={{ fontWeight: '600', color: 'var(--secondary-color)', fontSize: '0.9rem', letterSpacing: '1px' }}>QUANTITY</span>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Control
                                            as='select'
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            style={{
                                                borderRadius: '0',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                padding: '0.6rem',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {[...Array(product.countInStock || 0).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Row>

                                <Button
                                    onClick={addToCartHandler}
                                    className='btn-primary w-100 py-3 mb-3'
                                    type='button'
                                    style={{ fontSize: '1rem', letterSpacing: '2px' }}
                                >
                                    ADD TO SHOPPING BAG
                                </Button>
                            </div>
                        ) : (
                            <Message variant="danger">Exclusively Out of Stock</Message>
                        )}

                        <Accordion flush className="mt-5">
                            <Accordion.Item eventKey="0" className="border-top border-bottom">
                                <Accordion.Header><span style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem' }}>PRODUCT SPECIFICATIONS</span></Accordion.Header>
                                <Accordion.Body className="py-4">
                                    <Row className="gy-3" style={{ fontSize: '0.95rem' }}>
                                        <Col xs={6} className="text-muted">Metal Purity:</Col><Col xs={6} className="fw-bold">{product.purity || 'N/A'}</Col>
                                        <Col xs={6} className="text-muted">Total Weight:</Col><Col xs={6} className="fw-bold">{product.weight ? `${product.weight}g` : 'N/A'}</Col>
                                        <Col xs={6} className="text-muted">Stone Details:</Col><Col xs={6} className="fw-bold">{product.stone || 'Pure Metal'}</Col>
                                        <Col xs={6} className="text-muted">Item Category:</Col><Col xs={6} className="fw-bold">{product.category}</Col>
                                        <Col xs={6} className="text-muted">Inventory:</Col>
                                        <Col xs={6} className="fw-bold" style={{ color: (product.countInStock || 0) > 0 ? 'green' : 'red' }}>
                                            {(product.countInStock || 0) > 0 ? 'Exquisite Piece Available' : 'Currently Unavailable'}
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductScreen;
