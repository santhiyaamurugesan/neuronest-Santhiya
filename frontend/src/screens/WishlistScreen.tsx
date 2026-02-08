import { Row, Col, ListGroup, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import Message from '../components/Message';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import type { RootState, Product } from '../types';

const WishlistScreen = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector((state: RootState) => state.wishlist);
    const wishlistItems = wishlist?.wishlistItems || [];

    const removeFromWishlistHandler = (id: string) => {
        dispatch(removeFromWishlist(id));
    };

    const addToCartHandler = (item: Product) => {
        dispatch(addToCart({ ...item, qty: 1, countInStock: item.countInStock || 0 } as any));
    };

    return (
        <Row>
            <Col md={12}>
                <h1 style={{ marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>My Wishlist</h1>
                {wishlistItems.length === 0 ? (
                    <Message>
                        Your wishlist is empty <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        {wishlistItems.map((item: Product) => (
                            <ListGroup.Item key={item._id} className="py-4 border-bottom">
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fluid
                                            rounded
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80';
                                            }}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'var(--secondary-color)', fontWeight: '600' }}>
                                            {item.name}
                                        </Link>
                                        <div className="mt-1" style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {item.purity} | {item.weight}g
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div style={{ fontWeight: 'bold' }}>₹{item.price.toLocaleString('en-IN')}</div>
                                    </Col>
                                    <Col md={4} className="text-end">
                                        <Button
                                            type='button'
                                            variant='primary'
                                            className="me-2"
                                            onClick={() => addToCartHandler(item)}
                                            style={{ background: 'var(--primary-color)', border: 'none' }}
                                        >
                                            <FaShoppingCart className="me-2" /> Add to Cart
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={() => removeFromWishlistHandler(item._id)}
                                        >
                                            <FaTrash color="red" />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
        </Row>
    );
};

export default WishlistScreen;
