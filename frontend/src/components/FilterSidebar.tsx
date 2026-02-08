import { useState, useEffect } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [purity, setPurity] = useState(searchParams.get('purity') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [stone, setStone] = useState(searchParams.get('stone') || '');
    const [minWeight, setMinWeight] = useState(searchParams.get('minWeight') || '');
    const [maxWeight, setMaxWeight] = useState(searchParams.get('maxWeight') || '');

    useEffect(() => {
        setCategory(searchParams.get('category') || '');
        setPurity(searchParams.get('purity') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setStone(searchParams.get('stone') || '');
        setMinWeight(searchParams.get('minWeight') || '');
        setMaxWeight(searchParams.get('maxWeight') || '');
    }, [searchParams]);

    const applyFilterHandler = () => {
        const params: any = {};
        if (category) params.category = category;
        if (purity) params.purity = purity;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (stone) params.stone = stone;
        if (minWeight) params.minWeight = minWeight;
        if (maxWeight) params.maxWeight = maxWeight;

        const keyword = searchParams.get('keyword');
        if (keyword) params.keyword = keyword;

        const sort = searchParams.get('sort');
        if (sort) params.sort = sort;

        setSearchParams(params);
    };

    const clearFilters = () => {
        setCategory('');
        setPurity('');
        setMinPrice('');
        setMaxPrice('');
        setStone('');
        setMinWeight('');
        setMaxWeight('');

        const params: any = {};
        const keyword = searchParams.get('keyword');
        if (keyword) params.keyword = keyword;

        setSearchParams(params);
    };

    return (
        <div className="filter-sidebar bg-white p-4 h-100 shadow-sm rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="m-0 text-uppercase ls-1" style={{ fontFamily: 'var(--font-serif)', fontWeight: 'bold' }}>Filters</h5>
                <Button
                    variant="link"
                    className="p-0 text-muted hover-underline"
                    onClick={clearFilters}
                    style={{ fontSize: '0.85rem', textDecoration: 'none' }}
                >
                    Clear All
                </Button>
            </div>

            <Accordion defaultActiveKey={['0']} alwaysOpen flush className="mb-4">
                <Accordion.Item eventKey="0" className="border-bottom">
                    <Accordion.Header>Category</Accordion.Header>
                    <Accordion.Body className="px-0 pt-0">
                        {['Rings', 'Earrings', 'Necklaces', 'Bangles', 'Pendants'].map((cat) => (
                            <Form.Check
                                key={cat}
                                type="radio"
                                id={`cat-${cat}`}
                                label={cat}
                                name="category"
                                checked={category === cat}
                                onChange={() => setCategory(cat)}
                                className="mb-2 custom-radio"
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1" className="border-bottom">
                    <Accordion.Header>Price Range (₹)</Accordion.Header>
                    <Accordion.Body className="px-0 pt-0">
                        <div className="d-flex gap-2 align-items-center">
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="text-center"
                            />
                            <span className="text-muted">-</span>
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="text-center"
                            />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2" className="border-bottom">
                    <Accordion.Header>Purity</Accordion.Header>
                    <Accordion.Body className="px-0 pt-0">
                        {['18K', '22K', 'Platinum'].map((p) => (
                            <Form.Check
                                key={p}
                                type="radio"
                                id={`purity-${p}`}
                                label={p}
                                name="purity"
                                checked={purity === p}
                                onChange={() => setPurity(p)}
                                className="mb-2 custom-radio"
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4" className="border-0">
                    <Accordion.Header>Weight Range (g)</Accordion.Header>
                    <Accordion.Body className="px-0 pt-0">
                        <div className="d-flex gap-2 align-items-center">
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Min"
                                value={minWeight}
                                onChange={(e) => setMinWeight(e.target.value)}
                                className="text-center"
                            />
                            <span className="text-muted">-</span>
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Max"
                                value={maxWeight}
                                onChange={(e) => setMaxWeight(e.target.value)}
                                className="text-center"
                            />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <div className="d-grid gap-2">
                <Button
                    variant="primary"
                    onClick={applyFilterHandler}
                    className="w-100 py-2"
                >
                    APPLY FILTERS
                </Button>
            </div>
        </div>
    );
};

export default FilterSidebar;
