import { useState } from 'react';
import type { FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../constants';

const ContactScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/contact`, { name, email, message });
            toast.success('Message sent successfully!');
            setName('');
            setEmail('');
            setMessage('');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Contact Us</h1>
            <p className="text-muted mb-4">Have questions about our designs? Send us a message and our experts will get back to you.</p>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-3' controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-3' controlId='message'>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={5}
                        placeholder='How can we help you?'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ borderRadius: '4px' }}
                    ></Form.Control>
                </Form.Group>

                <Button
                    disabled={loading}
                    type='submit'
                    variant='primary'
                    className="mt-3 w-100 py-3"
                    style={{ background: 'var(--primary-color)', border: 'none', fontWeight: 'bold' }}
                >
                    {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ContactScreen;
