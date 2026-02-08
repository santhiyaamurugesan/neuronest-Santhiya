import { Container, Row, Col, Image } from 'react-bootstrap';

const AboutScreen = () => {
    return (
        <Container className="my-5">
            <Row>
                <Col md={6}>
                    <Image src="https://via.placeholder.com/600x400" fluid rounded />
                </Col>
                <Col md={6}>
                    <h2>About GoldenGrace</h2>
                    <p>
                        GoldenGrace is a premium jewellery brand that brings you the finest collection of Gold, Diamond, and Platinum jewellery.
                        Inspired by the royal heritage and modern aesthetics, our designs are crafted to perfection.
                    </p>
                    <p>
                        We believe in transparency, purity, and trust. Our products are Hallmarked and Certified.
                    </p>
                    <h4>Our Vision</h4>
                    <p>To be the most trusted and loved jewellery brand.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutScreen;
