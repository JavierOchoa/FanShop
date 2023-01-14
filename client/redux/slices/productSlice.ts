import { createSlice } from "@reduxjs/toolkit";

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
