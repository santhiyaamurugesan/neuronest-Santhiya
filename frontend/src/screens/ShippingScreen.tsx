import { useState } from 'react';
import type { FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';
import type { RootState } from '../types';

const ShippingScreen = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <FormContainer>
            <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Shipping Details</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className='my-3'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter address'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='city' className='my-3'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode' className='my-3'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='country' className='my-3'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Button
                    type='submit'
                    variant='primary'
                    className='my-3 py-2 px-4'
                    style={{ background: 'var(--primary-color)', border: 'none', width: '100%', fontWeight: 'bold' }}
                >
                    CONTINUE TO PAYMENT
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
