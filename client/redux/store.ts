import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { rememberEnhancer, rememberReducer } from "redux-remember";
import secureLocalStorage from "react-secure-storage";
import { api } from "./services";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

const remeberedKey = ["user"];

const reducers = {
  auth: authReducer,
  admin: adminReducer,
  user: userReducer,
  [api.reducerPath]: api.reducer,
};

export const store = configureStore({
  reducer: rememberReducer(reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  enhancers: [rememberEnhancer(secureLocalStorage, remeberedKey)],
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
