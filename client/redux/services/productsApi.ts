import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductAdminReponse, DetailedProduct } from "../../interfaces/admin";
import { RootState } from "../store";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.mutation<ProductAdminReponse[], void>({
      query: () => `/admin/products`,
    }),
    getProductDetails: builder.mutation<DetailedProduct, string>({
      query: (productId) => `/admin/products/` + productId,
    }),
  }),
});

export const { useGetProductsMutation, useGetProductDetailsMutation } = adminApi;
