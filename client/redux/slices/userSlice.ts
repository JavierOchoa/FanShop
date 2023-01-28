import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../interfaces";

interface userState {
  cart: CartItem[];
}

const initialState: userState = {
  cart: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addToCart: (state, { payload }: PayloadAction<CartItem>) => {
      state.cart = [...state.cart, payload];
    },
  },
});

export const { addToCart } = userSlice.actions;

export default userSlice.reducer;
