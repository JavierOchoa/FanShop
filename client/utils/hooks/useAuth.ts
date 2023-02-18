import { useEffect, useState } from "react";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { useAppSelector, useAppDispatch } from "./index";
import { setToken, setUser } from "../../redux/slices";
import { useGetUserInfoMutation, useLoginMutation, useSignUpMutation } from "../../redux/services";
import { LoginRequest, SignUpRequest } from "../../interfaces";
import { useRouter } from "next/router";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [getUserInfo, { data: userInfo }] = useGetUserInfoMutation();
  const [login, { data: loginResponse, isLoading: loginRequestLoading }] = useLoginMutation();
  const [signup, { data: signupResponse, isLoading: signUpRequestLoading }] = useSignUpMutation();
  const router = useRouter();
  useEffect(() => {
    const storedCookie = getCookie("fsToken");
    if (storedCookie && user === null) {
      dispatch(setToken(storedCookie));
      getUserInfo();
    } else if (storedCookie && user !== null) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userInfo !== undefined) {
      dispatch(setUser(userInfo));
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [userInfo]);

  const userLogin = async (credentials: LoginRequest) => {
    const { successful, message, data } = await login(credentials).unwrap();
    if (successful) {
      setCookie("fsToken", data, { expires: 8 });
      dispatch(setToken(data!));
    }
    return { successful, message, data };
  };

  const userSignUp = async (credentials: SignUpRequest) => {
    const { successful, message, data } = await signup(credentials).unwrap();
    if (successful) {
      setCookie("fsToken", data, { expires: 8 });
      dispatch(setToken(data!));
    }
    return { successful, message, data };
  };

  const userLogout = (isAdmin?: boolean) => {
    removeCookie("fsToken", { path: isAdmin ? "/admin" : "/" });
    router.reload();
  };
  return {
    isAuthenticated,
    isLoading,
    user,
    loginRequestLoading,
    userLogin,
    userLogout,
    userSignUp,
    signUpRequestLoading,
    loginResponse,
    signupResponse,
  };
}
