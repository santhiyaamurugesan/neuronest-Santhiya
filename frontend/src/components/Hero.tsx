import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="hero-section mb-5" style={{
            background: 'linear-gradient(135deg, #FDFBF4 0%, #F5E6D3 100%)',
            padding: '100px 0',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            border: '1px solid rgba(184, 144, 77, 0.1)'
        }}>
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(184, 144, 77, 0.05) 0%, transparent 70%)',
                zIndex: 0
            }} />

            <Container style={{ position: 'relative', zIndex: 1 }}>
                <Row className="align-items-center">
                    <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
                        <h4 style={{
                            color: 'var(--primary-color)',
                            letterSpacing: '4px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase'
                        }}>
                            Exquisite Jewelry Collections
                        </h4>
                        <h1 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '4.5rem',
                            lineHeight: '1.1',
                            marginBottom: '2rem',
                            color: 'var(--secondary-color)'
                        }}>
                            GOLDENGRACE. <br />
                            <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Exquisite Mastery.</span>
                        </h1>
                        <p className="lead mb-4 mx-auto mx-lg-0" style={{
                            maxWidth: '500px',
                            color: 'var(--text-muted)',
                            fontSize: '1.1rem'
                        }}>
                            Explore our exclusive collections of certified diamonds, pure 22K gold,
                            and premium pearls, meticulously handcrafted for life's most precious moments.
                        </p>
                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3 mt-4">
                            <Link to="/search/Diamond">
                                <Button className="btn-primary py-3 px-5">Explore Diamond Collection</Button>
                            </Link>
                            <Link to="/search/Gold">
                                <Button variant="outline-dark" className="py-3 px-5" style={{
                                    borderRadius: 'var(--border-radius)',
                                    fontWeight: '600',
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem',
                                    border: '1px solid var(--secondary-color)'
                                }}>
                                    Shop Gold & Pearl
                                </Button>
                            </Link>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div style={{ position: 'relative', height: '500px' }}>
                            <img
                              src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600"
                                alt="Luxury Necklace"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '15px 150px 15px 15px',
                                    boxShadow: '20px 20px 60px rgba(60, 48, 40, 0.15)',
                                    border: '5px solid white'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                left: '-30px',
                                width: '220px',
                                height: '220px',
                                borderRadius: '15px',
                                border: '5px solid white',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600"
                                    alt="Gold Bracelet"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Hero;
