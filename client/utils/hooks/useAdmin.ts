import { useState, useEffect } from "react";
import { useAppSelector } from ".";
import { useGetProductsMutation } from "../../redux/services";

export default function useAdmin() {
  const token = useAppSelector((state) => state.auth.token);
  const [attemptAccess, { data: productList, isLoading: loadingProducts }] =
    useGetProductsMutation();

  useEffect(() => {
    if (token !== null) {
      attemptAccess();
    }
  }, [token]);

  return { loadingProducts, productList };
}
