import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "../../interfaces";

interface AdminState {
  openEditDialog: boolean;
  dialogType: ModalType;
}

const initialState: AdminState = {
  openEditDialog: false,
  dialogType: "new",
};

export const adminSlice = createSlice({
  name: "admin",
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

export const { changeOpenEditDialogStatus, changeDialogType } = adminSlice.actions;

export default adminSlice.reducer;
