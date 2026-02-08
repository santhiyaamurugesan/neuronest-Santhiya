import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
    const { id: productId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [purity, setPurity] = useState('');
    const [weight, setWeight] = useState(0);
    const [stone, setStone] = useState('');

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId!);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setPrice(product.price || 0);
            setImage(product.image || '');
            setBrand(product.brand || '');
            setCategory(product.category || '');
            setCountInStock(product.countInStock || 0);
            setDescription(product.description || '');
            setPurity(product.purity || '');
            setWeight(product.weight || 0);
            setStone(product.stone || '');
        }
    }, [product]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
                purity,
                weight,
                stone,
            }).unwrap();
            toast.success('Product updated successfully');
            navigate('/admin/productlist');
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Update failed');
        }
    };

    const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await uploadProductImage(formData).unwrap();
            setImage(res.image);
            toast.success('Image uploaded successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Upload failed');
        }
    };

    return (
        <div className="py-3">
            <Link to="/admin/productlist" className="btn btn-light my-3 border">
                Go Back
            </Link>
            <FormContainer>
                <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{(error as any)?.data?.message || 'Error loading product'}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-3'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Group>

                        <Form.Group controlId='price' className='my-3'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Group>

                        <Form.Group controlId='image' className='my-3'>
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                style={{ borderRadius: '4px' }}
                            />
                            <Form.Control
                                type='file'
                                className="mt-2"
                                onChange={uploadFileHandler}
                            />
                            {loadingUpload && <Loader />}
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId='category' className='my-3'>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter category'
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId='brand' className='my-3'>
                                    <Form.Label>Brand / Tag</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter brand'
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group controlId='purity' className='my-3'>
                                    <Form.Label>Purity</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='22K, 18K etc.'
                                        value={purity}
                                        onChange={(e) => setPurity(e.target.value)}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId='weight' className='my-3'>
                                    <Form.Label>Weight (g)</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='Enter weight'
                                        value={weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId='stone' className='my-3'>
                                    <Form.Label>Stone</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Diamond, None etc.'
                                        value={stone}
                                        onChange={(e) => setStone(e.target.value)}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId='countInStock' className='my-3'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter countInStock'
                                value={countInStock}
                                onChange={(e) => setCountInStock(Number(e.target.value))}
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Group>

                        <Form.Group controlId='description' className='my-3'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Group>

                        <Button
                            type='submit'
                            variant='primary'
                            className='my-3 w-100 py-3'
                            style={{ background: 'var(--primary-color)', border: 'none', fontWeight: 'bold' }}
                        >
                            UPDATE PRODUCT
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
};

export default ProductEditScreen;
