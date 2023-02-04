import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartItemToRemove } from "../../interfaces";

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
      const checker = { id: payload.id, size: payload.size };

      const cartCheck = state.cart.filter((item) => {
        for (let key in checker) {
          if (
            item[key as keyof CartItem] === undefined ||
            item[key as keyof CartItem] !== payload[key as keyof CartItemToRemove]
          ) {
            return false;
          }
        }
        return true;
      });

      if (cartCheck.length < 1) {
        state.cart = [...state.cart, payload];
      } else {
        if (cartCheck[0].quantity !== payload.quantity) {
          state.cart.map((item) => {
            if (item.id === payload.id && item.size === payload.size) {
              item.quantity = payload.quantity;
            }
          });
        }
      }
    },
    removeFromCart: (state, { payload }: PayloadAction<CartItemToRemove>) => {
      const newCart = state.cart.filter((item) => {
        for (let key in payload) {
          if (
            item[key as keyof CartItem] === undefined ||
            item[key as keyof CartItem] !== payload[key as keyof CartItemToRemove]
          ) {
            return true;
          }
        }
        return false;
      });
      state.cart = newCart;
    },
  },
});

export const { addToCart, removeFromCart } = userSlice.actions;

export default userSlice.reducer;
