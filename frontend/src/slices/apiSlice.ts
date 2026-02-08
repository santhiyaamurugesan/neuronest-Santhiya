import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const userInfoRaw = localStorage.getItem('userInfo');
        if (userInfoRaw) {
            const userInfo = JSON.parse(userInfoRaw);
            const token = userInfo.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
        }
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (_builder) => ({}),
});
