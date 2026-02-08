import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState, ShippingAddress } from '../types';

const initialState: CartState = (() => {
    const defaultState: CartState = {
        cartItems: [],
        shippingAddress: { address: '', city: '', postalCode: '', country: '' },
        paymentMethod: 'PayPal',
        itemsPrice: '0.00',
        shippingPrice: '0.00',
        taxPrice: '0.00',
        totalPrice: '0.00'
    };
    try {
        const saved = localStorage.getItem('cart');
        if (saved && saved !== 'undefined') {
            const parsed = JSON.parse(saved);
            return {
                ...defaultState,
                ...parsed,
                cartItems: parsed.cartItems || [],
                shippingAddress: parsed.shippingAddress || defaultState.shippingAddress
            };
        }
    } catch (e) {
        console.error('Error parsing cart from localStorage', e);
    }
    return defaultState;
})();

const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            if (!state.cartItems) state.cartItems = [];

            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            const itemsPriceNum = state.cartItems.reduce((acc, item) => acc + item.price * (item.qty || 0), 0);
            state.itemsPrice = addDecimals(itemsPriceNum);

            const shippingPriceNum = itemsPriceNum > 1000 ? 0 : 50;
            state.shippingPrice = addDecimals(shippingPriceNum);

            const taxPriceNum = 0.03 * itemsPriceNum; 
            state.taxPrice = addDecimals(taxPriceNum);

            state.totalPrice = addDecimals(itemsPriceNum + shippingPriceNum + taxPriceNum);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            if (!state.cartItems) state.cartItems = [];
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            const itemsPriceNum = state.cartItems.reduce((acc, item) => acc + item.price * (item.qty || 0), 0);
            state.itemsPrice = addDecimals(itemsPriceNum);
            state.shippingPrice = addDecimals(itemsPriceNum > 1000 ? 0 : 50);
            state.taxPrice = addDecimals(0.03 * itemsPriceNum);
            state.totalPrice = addDecimals(itemsPriceNum + Number(state.shippingPrice) + Number(state.taxPrice));

            localStorage.setItem('cart', JSON.stringify(state));
        },
        saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        savePaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCartItems: (state) => {
            state.cartItems = [];
            state.itemsPrice = '0.00';
            state.shippingPrice = '0.00';
            state.taxPrice = '0.00';
            state.totalPrice = '0.00';
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
