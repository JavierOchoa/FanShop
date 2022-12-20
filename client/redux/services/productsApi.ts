import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductAdminReponse } from "../../interfaces/admin";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductAdminReponse[], void>({
      query: () => `/admin/products`,
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;