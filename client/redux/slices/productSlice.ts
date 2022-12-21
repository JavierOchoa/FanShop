import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Product } from "./../../interfaces";

interface ProductState {
  products: Product[];
  openEditDialog: boolean;
}

const initialState: ProductState = {
  products: [],
  openEditDialog: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProducts: (state) => {
      state;
    },
    changeOpenEditDialogStatus: (state) => {
      state.openEditDialog = !state.openEditDialog;
    },
  },
});

export const { changeOpenEditDialogStatus } = productSlice.actions;

export default productSlice.reducer;
