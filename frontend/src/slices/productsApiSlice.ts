import { PRODUCTS_URL, UPLOADS_URL } from '../constants';
import { apiSlice } from './apiSlice';
import type { Product } from '../types';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<{ products: Product[]; page: number; pages: number }, any>({
            query: ({ keyword, pageNumber, category, purity, stone, sort, minPrice, maxPrice, minWeight, maxWeight }) => ({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                    category,
                    purity,
                    stone,
                    sort,
                    minPrice,
                    maxPrice,
                    minWeight,
                    maxWeight,
                },
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query<Product, string>({
            query: (productId: string) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation<Product, void>({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<Product, any>({
            query: (data: any) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        uploadProductImage: builder.mutation<{ image: string; message: string }, FormData>({
            query: (data: FormData) => ({
                url: `${UPLOADS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation<{ message: string }, string>({
            query: (productId: string) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
        createReview: builder.mutation<any, any>({
            query: (data: any) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        getTopProducts: builder.query<Product[], void>({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
} = productsApiSlice;
