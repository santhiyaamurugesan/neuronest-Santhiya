import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer mt-5">
            <Container>
                <Row className="gy-4">
                    <Col lg={4} md={6}>
                        <h2 style={{
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--primary-color)',
                            letterSpacing: '3px',
                            marginBottom: '1.5rem',
                            fontSize: '1.8rem',
                            textTransform: 'uppercase'
                        }}>
                            GOLDENGRACE
                        </h2>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '300px', color: '#E2C299' }}>
                            Crafting excellence since 1995. Our jewelry is an embodiment of beauty,
                            designed to last an eternity. Each piece tells a story of elegance and tradition.
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            <a href="#" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}><FaFacebook size={20} /></a>
                            <a href="#" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}><FaInstagram size={20} /></a>
                            <a href="#" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}><FaTwitter size={20} /></a>
                            <a href="#" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}><FaPinterest size={20} /></a>
                        </div>
                    </Col>

                    <Col lg={2} md={6}>
                        <h4>Quick Links</h4>
                        <Link to='/category/Diamond'>Diamonds</Link>
                        <Link to='/category/Gold'>Gold Collection</Link>
                        <Link to='/category/Bridal'>Bridal Wear</Link>
                        <Link to='/category/Pearls'>Pearl Boutique</Link>
                        <Link to='/collections'>Special Collections</Link>
                    </Col>

                    <Col lg={3} md={6}>
                        <h4>Customer Care</h4>
                        <Link to='/contact'>Contact Us</Link>
                        <Link to='/shipping'>Shipping & Returns</Link>
                        <Link to='/track-order'>Track Your Order</Link>
                        <Link to='/jewelry-care'>Jewelry Care Guide</Link>
                        <Link to='/faq'>Frequently Asked Questions</Link>
                    </Col>

                    <Col lg={3} md={6}>
                        <h4>The Atelier</h4>
                        <p style={{ fontSize: '0.9rem', color: '#E2C299', marginBottom: '0.5rem' }}>
                            <strong> flagship Store:</strong><br />
                            123 Luxury Avenue, Diamond District<br />
                            Chennai, Tamil Nadu 600001
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#E2C299' }}>
                            <strong>Email:</strong> atelier@goldengrace.com<br />
                            <strong>Phone:</strong> +91 98765 43210
                        </p>
                    </Col>
                </Row>

                <hr style={{ borderColor: 'rgba(184, 144, 77, 0.2)', margin: '3rem 0 2rem' }} />

                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start">
                        <p className="mb-0" style={{ fontSize: '0.8rem', color: '#8E7C6F' }}>
                            &copy; {currentYear} GOLDENGRACE All Rights Reserved.
                        </p>
                    </Col>
                    <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
                        <p className="mb-0" style={{ fontSize: '0.8rem', color: '#8E7C6F' }}>
                            <Link to="/privacy" style={{ display: 'inline', margin: '0 10px', color: '#8E7C6F' }}>Privacy Policy</Link>
                            <Link to="/terms" style={{ display: 'inline', margin: '0 10px', color: '#8E7C6F' }}>Terms of Service</Link>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
