import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse,
  ListedProducts,
  LoginRequest,
  NewOrder,
  SignUpRequest,
  User,
  UserInfo,
} from "../../interfaces";
import {
  DetailedProduct,
  ProductPost,
  UserPost,
  StatsResponse,
  APIProductResponse,
} from "../../interfaces";
import { APIProductInformation } from "../../interfaces/products/ProductInformation";
import { APIResponse } from "../../interfaces";
import { RootState } from "../store";
import { UpdateAccount } from "../../interfaces/user";

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
  tagTypes: ["Products", "Users", "UserInfo", "Product", "Stats"],
  endpoints: (builder) => ({
    //Auth Endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserInfo: builder.mutation<UserInfo, void>({
      query: () => "/user/info",
    }),
    //Admin Enpoints
    //Admin//Stats
    getStats: builder.query<StatsResponse, void>({
      query: () => "/admin/stats",
      providesTags: ["Stats"],
    }),
    //Admin//Products
    getProducts: builder.query<APIProductResponse, void>({
      query: () => `/admin/products`,
      providesTags: ["Products"],
    }),
    getProduct: builder.query<DetailedProduct, string>({
      query: (productId) => `/admin/products/` + productId,
      providesTags: ["Product"],
    }),
    getProductDetails: builder.mutation<DetailedProduct, string>({
      query: (productId) => `/admin/products/` + productId,
    }),
    editProduct: builder.mutation<APIResponse, ProductPost>({
      query: (productToEdit) => ({
        url: "/admin/products/edit",
        method: "POST",
        body: productToEdit,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    addProduct: builder.mutation<APIResponse, ProductPost>({
      query: (productToAdd) => ({
        url: "/admin/products/add",
        method: "POST",
        body: productToAdd,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    removeProduct: builder.mutation<APIResponse, string>({
      query: (productToDelete) => ({
        url: `/admin/products/delete/${productToDelete}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    //Admin//Users
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (userId) => "/admin/users/" + userId,
      providesTags: ["UserInfo"],
    }),
    addUser: builder.mutation<APIResponse, UserPost>({
      query: (userToAdd) => ({
        url: "/admin/users/add",
        method: "POST",
        body: userToAdd,
      }),
      invalidatesTags: ["Users", "UserInfo"],
    }),
    editUser: builder.mutation<APIResponse, UserPost>({
      query: (userToEdit) => ({
        url: "/admin/users/edit",
        method: "POST",
        body: userToEdit,
      }),
      invalidatesTags: ["Users", "UserInfo"],
    }),
    activateUser: builder.mutation<UserPost, string>({
      query: (userToActivate) => ({
        url: `/admin/users/activate/${userToActivate}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users", "UserInfo"],
    }),
    deactivateUser: builder.mutation<UserPost, string>({
      query: (userToDeactivate) => ({
        url: `/admin/users/deactivate/${userToDeactivate}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users", "UserInfo"],
    }),
    removeUser: builder.mutation<UserPost, string>({
      query: (userToDelete) => ({
        url: `/admin/users/delete/${userToDelete}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    //Products
    getProductsList: builder.query<ListedProducts, string>({
      query: (category?) => `/products/category/${category}`,
    }),
    getProductInformation: builder.query<APIProductInformation, string>({
      query: (productId?) => `/products/${productId}`,
    }),
    //User
    updateUser: builder.mutation<APIResponse, UpdateAccount>({
      query: (informationToUpdate) => ({
        url: `/user/account/update`,
        method: "POST",
        body: informationToUpdate,
      }),
    }),
    //Orders
    createOrder: builder.mutation<NewOrder, void>({
      query: () => "/order/create",
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useGetUserInfoMutation,
  useGetStatsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductDetailsMutation,
  useEditProductMutation,
  useAddProductMutation,
  useRemoveProductMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useEditUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useRemoveUserMutation,
  useGetProductsListQuery,
  useGetProductInformationQuery,
  useUpdateUserMutation,
  useCreateOrderMutation,
} = api;
