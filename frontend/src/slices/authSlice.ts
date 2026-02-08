import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserInfo } from '../types';

const initialState: AuthState = (() => {
    try {
        const saved = localStorage.getItem('userInfo');
        if (saved && saved !== 'undefined') {
            return { userInfo: JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Error parsing userInfo from localStorage', e);
    }
    return { userInfo: null };
})();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
