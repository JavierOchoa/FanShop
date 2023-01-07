import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
// import { Product } from "./../../interfaces";

interface ProductState {
  openEditDialog: boolean;
}

const initialState: ProductState = {
  openEditDialog: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    changeOpenEditDialogStatus: (state) => {
      state.openEditDialog = !state.openEditDialog;
    },
  },
});

export const { changeOpenEditDialogStatus } = productSlice.actions;

export default productSlice.reducer;
