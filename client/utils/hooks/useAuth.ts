import { useEffect, useState } from "react";
import { getCookie, setCookie } from "typescript-cookie";
import { useAppSelector, useAppDispatch } from "./../hooks";
import { setToken, setUser } from "./../../redux/slices";
import { useGetUserInfoMutation } from "../../redux/services";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [getUserInfo, { data: userInfo, isLoading: gettingUserInfo }] = useGetUserInfoMutation();
  useEffect(() => {
    const storedCookie = getCookie("fsToken");
    if (storedCookie && user === null) {
      dispatch(setToken(storedCookie));
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    if (userInfo !== undefined) {
      dispatch(setUser(userInfo));
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [userInfo]);
  return { isAuthenticated, isLoading };
}
