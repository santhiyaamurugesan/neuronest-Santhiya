import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import type { RootState, Product as ProductType } from '../types';

interface ProductProps {
    product: ProductType;
}

const Product = ({ product }: ProductProps) => {
    const dispatch = useDispatch();
    const wishlist = useSelector((state: RootState) => state.wishlist);
    const wishlistItems = wishlist?.wishlistItems || [];
    const isWished = wishlistItems.find((x: any) => x._id === product._id);

    const wishlistHandler = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWished) {
            dispatch(removeFromWishlist(product._id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    return (
        <Card className="my-3 p-3 rounded h-100 border-0 shadow-sm product-card position-relative">
            {/* Wishlist Button */}
            <div
                onClick={wishlistHandler}
                className="position-absolute shadow-sm d-flex align-items-center justify-content-center"
                style={{
                    top: '25px',
                    right: '25px',
                    zIndex: 10,
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                }}
            >
                {isWished ? <HiHeart color="#B8904D" size={20} /> : <HiOutlineHeart color="#B8904D" size={20} />}
            </div>

            <Link to={`/product/${product._id}`} className="text-decoration-none">
                <div style={{ height: '250px', overflow: 'hidden', borderRadius: '4px' }}>
                    <Card.Img
                        src={product.image}
                        variant="top"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        className="product-img"
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80'; // Fallback
                        }}
                    />
                </div>
            </Link>

            <Card.Body className="d-flex flex-column px-0 pb-0 pt-3">
                <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <Card.Title as="h5" style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--secondary-color)',
                        marginBottom: '0.5rem'
                    }}>
                        {product.name}
                    </Card.Title>
                </Link>

                <div className="mt-auto">
                    <Card.Text as="h4" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="badge bg-light text-dark border">
                            {product.category}
                        </span>
                        {product.countInStock > 0 ? (
                            <span className="text-success small fw-bold">In Stock</span>
                        ) : (
                            <span className="text-danger small fw-bold">Out Of Stock</span>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Product;
