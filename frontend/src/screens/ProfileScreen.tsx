import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { FaTimes } from 'react-icons/fa';
import type { RootState } from '../types';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = useSelector((state: RootState) => state.auth);
    const userInfo = auth?.userInfo;

    const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
            setPhoneNumber(userInfo.phoneNumber || '');
        }
    }, [userInfo]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo?._id || '',
                    name,
                    email,
                    phoneNumber,
                    password,
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch (err: any) {
                toast.error(err?.data?.message || err.error || 'Update failed');
            }
        }
    };

    return (
        <Row className="gy-5">
            <Col xs={12} md={3}>
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-3' controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ borderRadius: '4px' }}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-3' controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ borderRadius: '4px' }}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-3' controlId='phoneNumber'>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type='tel'
                            placeholder='Enter phone number'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{ borderRadius: '4px' }}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-3' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ borderRadius: '4px' }}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-3' controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ borderRadius: '4px' }}
                        ></Form.Control>
                    </Form.Group>

                    <Button
                        type='submit'
                        variant='primary'
                        className='my-3 w-100 py-2'
                        style={{ background: 'var(--primary-color)', border: 'none', fontWeight: 'bold' }}
                    >
                        UPDATE PROFILE
                    </Button>
                    {loadingUpdateProfile && <Loader />}
                </Form>
            </Col>
            <Col xs={12} md={9}>
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant='danger'>
                        {(errorOrders as any)?.data?.message || (errorOrders as any).error || 'Error loading orders'}
                    </Message>
                ) : (
                    <Table striped hover responsive className='table-sm custom-table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((order: any) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span className="text-success">{order.paidAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            <span className="text-success">{order.deliveredAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm' variant='light'>
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};

export default ProfileScreen;
