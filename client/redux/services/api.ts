import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthResponse, LoginRequest, UserInfo } from "../../interfaces";
import type {
  ProductAdminReponse,
  DetailedProduct,
  ProductPost,
  ProductPostResponse,
} from "../../interfaces/admin";
import { RootState } from "../store";

export const api = createApi({
  reducerPath: "api",
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
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    //Auth Endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserInfo: builder.mutation<UserInfo, void>({
      query: () => "/user/info",
    }),
    //Admin Enpoints
    getProducts: builder.query<ProductAdminReponse[], void>({
      query: () => `/admin/products`,
      providesTags: ["Products"],
    }),
    getProductDetails: builder.mutation<DetailedProduct, string>({
      query: (productId) => `/admin/products/` + productId,
    }),
    editProduct: builder.mutation<ProductPostResponse, ProductPost>({
      query: (productToEdit) => ({
        url: "/admin/products/edit",
        method: "POST",
        body: productToEdit,
      }),
      invalidatesTags: ["Products"],
    }),
    addProduct: builder.mutation<ProductPostResponse, ProductPost>({
      query: (productToAdd) => ({
        url: "/admin/products/add",
        method: "POST",
        body: productToAdd,
      }),
      invalidatesTags: ["Products"],
    }),
    removeProduct: builder.mutation<ProductPostResponse, string>({
      query: (productToDelete) => ({
        url: `/admin/products/delete/${productToDelete}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserInfoMutation,
  useGetProductsQuery,
  useGetProductDetailsMutation,
  useEditProductMutation,
  useAddProductMutation,
  useRemoveProductMutation,
} = api;
