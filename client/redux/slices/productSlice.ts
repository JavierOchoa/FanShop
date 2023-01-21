import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "../../interfaces";

interface ProductState {
  openEditDialog: boolean;
  dialogType: ModalType;
}

const initialState: ProductState = {
  openEditDialog: false,
  dialogType: "new",
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    changeOpenEditDialogStatus: (state) => {
      state.openEditDialog = !state.openEditDialog;
    },
    changeDialogType: (state, action: PayloadAction<ModalType>) => {
      state.dialogType = action.payload;
    },
  },
});

export const { changeOpenEditDialogStatus, changeDialogType } = productSlice.actions;

export default productSlice.reducer;
