import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
    const { pageNumber } = useParams<{ pageNumber?: string }>();

    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber: pageNumber || '1',
    });

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted');
                refetch();
            } catch (err: any) {
                toast.error(err?.data?.message || err.error || 'Delete failed');
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Create a new product?')) {
            try {
                await createProduct().unwrap();
                toast.success('Product created');
                refetch();
            } catch (err: any) {
                toast.error(err?.data?.message || err.error || 'Creation failed');
            }
        }
    };

    const products = (data as any)?.products || [];

    return (
        <div className="py-3">
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1 style={{ fontFamily: 'var(--font-serif)' }}>Products Management</h1>
                </Col>
                <Col className='text-end'>
                    <Button
                        className='my-3'
                        onClick={createProductHandler}
                        style={{ background: 'var(--primary-color)', border: 'none', fontWeight: 'bold' }}
                    >
                        <FaPlus /> CREATE PRODUCT
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {loadingCreate && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {(error as any)?.data?.message || (error as any).error || 'Error loading products'}
                </Message>
            ) : (
                <>
                    <Table striped bordered hover responsive className='table-sm custom-table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>AVAILABILITY</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price.toLocaleString('en-IN')}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm mx-2'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <FaTrash style={{ color: 'white' }} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default ProductListScreen;
