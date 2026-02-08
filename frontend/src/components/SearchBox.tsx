import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <Form onSubmit={submitHandler} className="d-flex align-items-center">
            <InputGroup style={{ maxWidth: '220px' }}>
                <Form.Control
                    type="text"
                    name="q"
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    placeholder="Search designs..."
                    style={{
                        borderRadius: '20px 0 0 20px',
                        border: '1px solid rgba(184, 144, 77, 0.2)',
                        borderRight: 'none',
                        fontSize: '0.8rem',
                        padding: '0.4rem 1rem',
                        background: '#fdfbf4'
                    }}
                />
                <InputGroup.Text
                    onClick={(e: any) => submitHandler(e)}
                    style={{
                        borderRadius: '0 20px 20px 0',
                        background: '#fdfbf4',
                        border: '1px solid rgba(184, 144, 77, 0.2)',
                        borderLeft: 'none',
                        cursor: 'pointer',
                        padding: '0 12px'
                    }}
                >
                    <HiOutlineMagnifyingGlass size={16} color="var(--primary-color)" />
                </InputGroup.Text>
            </InputGroup>
        </Form>
    );
};

export default SearchBox;
