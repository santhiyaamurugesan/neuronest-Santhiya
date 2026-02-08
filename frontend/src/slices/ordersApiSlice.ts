import { ORDERS_URL } from '../constants';
import { apiSlice } from './apiSlice';
import type { Order, CreateOrderRequest, RazorpayResponse } from '../types';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<Order, CreateOrderRequest>({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order },
            }),
            invalidatesTags: ['Order'],
        }),
        getOrderDetails: builder.query<Order, string>({
            query: (id: string) => ({
                url: `${ORDERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
            providesTags: (_result, _error, id) => [{ type: 'Order', id }],
        }),
        payOrder: builder.mutation<Order, { orderId: string; details: RazorpayResponse }>({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
            invalidatesTags: (_result, _error, { orderId }) => [{ type: 'Order', id: orderId }, 'Order'],
        }),
        getMyOrders: builder.query<Order[], void>({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Order'],
        }),
        getOrders: builder.query<Order[], void>({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Order'],
        }),
        deliverOrder: builder.mutation<Order, string>({
            query: (orderId: string) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
            invalidatesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }, 'Order'],
        }),
        cancelOrder: builder.mutation<Order, string>({
            query: (orderId: string) => ({
                url: `${ORDERS_URL}/${orderId}/cancel`,
                method: 'PUT',
            }),
            invalidatesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }, 'Order'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    useCancelOrderMutation,
} = ordersApiSlice;
