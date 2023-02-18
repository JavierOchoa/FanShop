import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "../../interfaces";

type AuthState = {
  user: UserInfo | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: UserInfo; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    setUser: (state, { payload }: PayloadAction<UserInfo>) => {
      state.user = payload;
    },
    updateEmail: (state, { payload }: PayloadAction<string>) => {
      state.user = {
        fullName: state.user?.fullName || "",
        email: payload,
        isActive: state.user?.isActive || true,
        roles: state.user?.roles || [],
      };
    },
    updateName: (state, { payload }: PayloadAction<string>) => {
      state.user = {
        fullName: payload,
        email: state.user?.email || "",
        isActive: state.user?.isActive || true,
        roles: state.user?.roles || [],
      };
    },
  },
});

export const { setToken, setUser, updateEmail, updateName } = authSlice.actions;

export default authSlice.reducer;
