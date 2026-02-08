import { Row, Col, Form, Button, Offcanvas } from 'react-bootstrap';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Hero from '../components/Hero';
import { useParams, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import { useState } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

const HomeScreen = () => {
    const { keyword, category: categoryParam } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const category = categoryParam || searchParams.get('category') || '';
    const purity = searchParams.get('purity') || '';
    const stone = searchParams.get('stone') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const minWeight = searchParams.get('minWeight') || '';
    const maxWeight = searchParams.get('maxWeight') || '';
    const sort = searchParams.get('sort') || '';
    const pageNumber = searchParams.get('pageNumber') || '1';

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
        category,
        purity,
        stone,
        sort,
        minPrice,
        maxPrice,
        minWeight,
        maxWeight
    });

    const sortHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', e.target.value);
        setSearchParams(newParams);
    };

    return (
        <div className="main-container container">
            {!keyword && !category && !purity && !stone && !minPrice && !maxPrice && !minWeight && !maxWeight && <Hero />}

            <Row className="mt-4">
                <Col md={3} className="d-none d-md-block">
                    <FilterSidebar />
                </Col>
                <Col md={9}>
                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                        <div className="d-flex align-items-center">
                            <Button
                                variant="outline-secondary"
                                className="d-md-none me-3 d-flex align-items-center gap-2"
                                onClick={() => setShowFilters(true)}
                                style={{ fontSize: '0.9rem' }}
                            >
                                <HiOutlineAdjustmentsHorizontal size={20} /> Filters
                            </Button>

                            <h2 className="m-0" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                                {category ? `${category}` : 'All Jewellery'}
                                <span className="ms-2 text-muted d-none d-sm-inline" style={{ fontSize: '1rem', fontWeight: '400', fontFamily: 'var(--font-sans)' }}>
                                    ({(data as any)?.products?.length || 0} Designs)
                                </span>
                            </h2>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="me-2 text-muted d-none d-sm-inline" style={{ fontSize: '0.9rem' }}>Sort By:</span>
                            <Form.Select
                                size="sm"
                                value={sort}
                                onChange={sortHandler}
                                style={{ width: '150px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="">Relevance</option>
                                <option value="newest">New Arrivals</option>
                                <option value="lowest">Price: Low to High</option>
                                <option value="highest">Price: High to Low</option>
                                <option value="toprated">Best Sellers</option>
                            </Form.Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>
                            {(error as any)?.data?.message || 'Error loading products'}
                        </Message>
                    ) : (
                        <Row>
                            {(data as any)?.products?.map((product: any) => (
                                <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>

            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontFamily: 'var(--font-serif)' }}>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <FilterSidebar />
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default HomeScreen;
