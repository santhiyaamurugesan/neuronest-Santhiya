import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';

const AdminRoute = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    return userInfo && userInfo.isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to='/login' replace />
    );
};

export default AdminRoute;
