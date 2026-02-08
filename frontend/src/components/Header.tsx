import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import type { RootState } from '../types';

const Header = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const cartItems = cart?.cartItems || [];

    const wishlist = useSelector((state: RootState) => state.wishlist);
    const wishlistItems = wishlist?.wishlistItems || [];

    const auth = useSelector((state: RootState) => state.auth);
    const userInfo = auth?.userInfo;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall({}).unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <header>
            <Navbar
                bg='white'
                expand='xl'
                collapseOnSelect
                className="sticky-top border-bottom"
                style={{ minHeight: '80px', padding: '0.5rem 0' }}
            >
                <Container>
                    <div className="d-flex align-items-center justify-content-between w-100">
                        {/* Mobile Toggle (Left) */}
                        <Navbar.Toggle aria-controls='basic-navbar-nav' className="border-0 p-0 me-2" />

                        {/* Logo (Center/Left) */}
                        <LinkContainer to='/'>
                            <Navbar.Brand className="m-0" style={{
                                color: 'var(--primary-color)',
                                fontWeight: '700',
                                fontSize: 'clamp(0.9rem, 4vw, 2.2rem)', // Adjusted for very small screens
                                fontFamily: 'var(--font-serif)',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap'
                            }}>
                                GOLDENGRACE
                            </Navbar.Brand>
                        </LinkContainer>

                        {/* Mobile Icons (Right) - Visible Only on < XL */}
                        <div className="d-flex align-items-center gap-2 d-xl-none">
                            <LinkContainer to='/search' className="d-none d-sm-block">
                                <Nav.Link className="p-0">
                                    <HiOutlineMagnifyingGlass size={22} color="var(--secondary-color)" />
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/wishlist' className="d-none d-sm-block">
                                <Nav.Link className="position-relative p-0">
                                    <HiOutlineHeart size={24} color="var(--secondary-color)" />
                                    {wishlistItems.length > 0 && (
                                        <Badge pill bg='primary' style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-8px',
                                            fontSize: '0.6rem',
                                            background: 'var(--primary-color)'
                                        }}>
                                            {wishlistItems.length}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/cart'>
                                <Nav.Link className="position-relative p-0">
                                    <HiOutlineShoppingBag size={24} color="var(--secondary-color)" />
                                    {cartItems.length > 0 && (
                                        <Badge pill bg='primary' style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-8px',
                                            fontSize: '0.6rem',
                                            background: 'var(--primary-color)'
                                        }}>
                                            {cartItems.reduce((a, c) => a + (c.qty || 0), 0)}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>
                        </div>
                    </div>

                    {/* Collapsible Menu (Links + Desktop Icons) */}
                    <div className="w-100">
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Nav className='mx-auto align-items-center py-3 py-xl-0'>
                                {/* Search Box (Mobile Menu Only - Backup) */}
                                <div className="d-xl-none mb-3 w-100 d-flex justify-content-center">
                                    <SearchBox />
                                </div>

                                <LinkContainer to='/category/Diamonds'>
                                    <Nav.Link className="px-3 py-2">DIAMONDS</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/category/Gold'>
                                    <Nav.Link className="px-3 py-2">GOLD</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/category/Pearls'>
                                    <Nav.Link className="px-3 py-2">PEARLS</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/category/Collections'>
                                    <Nav.Link className="px-3 py-2">COLLECTIONS</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/category/Bridal'>
                                    <Nav.Link className="px-3 py-2">BRIDAL</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/wishlist' className="d-sm-none">
                                    <Nav.Link className="px-3 py-2">WISHLIST</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/contact'>
                                    <Nav.Link className="px-3 py-2">CONTACT</Nav.Link>
                                </LinkContainer>

                                {/* User Menu (Mobile Only) */}
                                <div className="d-xl-none mt-3 w-100 border-top pt-3 text-center">
                                    {userInfo ? (
                                        <>
                                            <div className="fw-bold mb-2">Hello, {userInfo.name}</div>
                                            <LinkContainer to='/profile'>
                                                <Nav.Link>My Profile</Nav.Link>
                                            </LinkContainer>
                                            <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
                                        </>
                                    ) : (
                                        <LinkContainer to='/login'>
                                            <Nav.Link>Login / Register</Nav.Link>
                                        </LinkContainer>
                                    )}
                                </div>

                                {userInfo && userInfo.isAdmin && (
                                    <NavDropdown title='Admin Dashboard' id='adminmenu' className="d-xl-none mt-2 text-center">
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item>Products</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item>Users</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item>Orders</NavDropdown.Item>
                                        </LinkContainer>
                                    </NavDropdown>
                                )}
                            </Nav>

                            {/* Desktop Icons (XL+ Only) - Right Aligned */}
                            <Nav className="d-none d-xl-flex align-items-center gap-3">
                                <LinkContainer to='/search'>
                                    <Nav.Link className="p-0">
                                        <HiOutlineMagnifyingGlass size={22} color="var(--secondary-color)" />
                                    </Nav.Link>
                                </LinkContainer>

                                <LinkContainer to='/wishlist'>
                                    <Nav.Link className="position-relative p-0">
                                        <HiOutlineHeart size={24} color="var(--secondary-color)" />
                                        {wishlistItems.length > 0 && (
                                            <Badge pill bg='primary' style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-8px',
                                                fontSize: '0.6rem',
                                                background: 'var(--primary-color)'
                                            }}>
                                                {wishlistItems.length}
                                            </Badge>
                                        )}
                                    </Nav.Link>
                                </LinkContainer>

                                <LinkContainer to='/cart'>
                                    <Nav.Link className="position-relative p-0">
                                        <HiOutlineShoppingBag size={24} color="var(--secondary-color)" />
                                        {cartItems.length > 0 && (
                                            <Badge pill bg='primary' style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-8px',
                                                fontSize: '0.6rem',
                                                background: 'var(--primary-color)'
                                            }}>
                                                {cartItems.reduce((a, c) => a + (c.qty || 0), 0)}
                                            </Badge>
                                        )}
                                    </Nav.Link>
                                </LinkContainer>

                                {userInfo ? (
                                    <NavDropdown title={<HiOutlineUser size={24} color="var(--secondary-color)" />} id='username-desktop' align="end">
                                        <div className="px-3 py-2 text-muted" style={{ fontSize: '0.8rem' }}>Hello, {userInfo.name}</div>
                                        <NavDropdown.Divider />
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>My Profile</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <LinkContainer to='/login'>
                                        <Nav.Link className="p-0">
                                            <HiOutlineUser size={24} color="var(--secondary-color)" />
                                        </Nav.Link>
                                    </LinkContainer>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
