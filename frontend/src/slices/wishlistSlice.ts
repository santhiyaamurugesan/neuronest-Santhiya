import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, WishlistState } from '../types';

const initialState: WishlistState = (() => {
    try {
        const saved = localStorage.getItem('wishlist');
        if (saved && saved !== 'undefined') {
            const parsed = JSON.parse(saved);
            return parsed.wishlistItems ? parsed : { wishlistItems: [] };
        }
    } catch (e) {
        console.error('Error parsing wishlist from localStorage', e);
    }
    return { wishlistItems: [] };
})();

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            const item = action.payload;
            if (!state.wishlistItems) state.wishlistItems = [];

            const existItem = state.wishlistItems.find((x) => x._id === item._id);

            if (!existItem) {
                state.wishlistItems = [...state.wishlistItems, item];
            }
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            if (!state.wishlistItems) state.wishlistItems = [];
            state.wishlistItems = state.wishlistItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
    },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
