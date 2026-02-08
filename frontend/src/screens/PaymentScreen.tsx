import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../slices/cartSlice';
import type { RootState } from '../types';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state: RootState) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend' className="mb-4">Select Your Preferred Method</Form.Label>
                    <Col>
                        <Form.Check
                            className='my-3 p-3 border rounded'
                            type='radio'
                            label='PayPal or Credit Card'
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        ></Form.Check>
                        <Form.Check
                            className='my-3 p-3 border rounded'
                            type='radio'
                            label='Razorpay (UPI / Cards)'
                            id='Razorpay'
                            name='paymentMethod'
                            value='Razorpay'
                            checked={paymentMethod === 'Razorpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        ></Form.Check>
                    </Col>
                </Form.Group>

                <Button
                    type='submit'
                    variant='primary'
                    className='mt-4 py-2 px-4'
                    style={{ background: 'var(--primary-color)', border: 'none', width: '100%', fontWeight: 'bold' }}
                >
                    CONTINUE TO ORDER SUMMARY
                </Button>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
