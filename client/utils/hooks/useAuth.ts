import { useEffect, useState } from "react";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { useAppSelector, useAppDispatch } from "./../hooks";
import { setToken, setUser } from "./../../redux/slices";
import { useGetUserInfoMutation, useLoginMutation } from "../../redux/services";
import { LoginRequest } from "./../../interfaces";
import { useRouter } from "next/router";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [getUserInfo, { data: userInfo }] = useGetUserInfoMutation();
  const [login, { isLoading: loginRequestLoading }] = useLoginMutation();
  const router = useRouter();
  useEffect(() => {
    const storedCookie = getCookie("fsToken");
    if (storedCookie && user === null) {
      dispatch(setToken(storedCookie));
      getUserInfo();
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
    const data = await login(credentials).unwrap();
    if (data.token) {
      setCookie("fsToken", data.token, { expires: 8 });
      dispatch(setToken(data.token));
    }
    return data;
  };

  const userLogout = () => {
    removeCookie("fsToken");
    router.reload();
  };
  return { isAuthenticated, isLoading, user, loginRequestLoading, userLogin, userLogout };
}
