import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
    const { id: userId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId!);

    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setIsAdmin(user.isAdmin || false);
        }
    }, [user]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateUser({ userId, name, email, isAdmin }).unwrap();
            toast.success('User updated successfully');
            refetch();
            navigate('/admin/userlist');
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Update failed');
        }
    };

    return (
        <div className="py-3">
            <Link to="/admin/userlist" className="btn btn-light my-3 border">
                Go Back
            </Link>
            <FormContainer>
                <h1 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Edit User</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{(error as any)?.data?.message || 'Error loading user'}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name" className="my-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="my-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderRadius: '4px' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="isAdmin" className="my-3">
                            <Form.Check
                                type="checkbox"
                                label="Grant Administrator Privileges"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="primary"
                            className="my-3 w-100 py-3"
                            style={{ background: 'var(--primary-color)', border: 'none', fontWeight: 'bold' }}
                        >
                            UPDATE USER
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
};

export default UserEditScreen;
