import { useState, useEffect } from "react";
import { useAppSelector } from ".";
import { useGetProductsMutation, useGetProductDetailsMutation } from "../../redux/services";

export default function useAdmin() {
  const token = useAppSelector((state) => state.auth.token);
  const [getProducts, { data: productList, isLoading: loadingProducts }] = useGetProductsMutation();
  const [getProductInfo, { isLoading: loadingProductDetails }] = useGetProductDetailsMutation();

  useEffect(() => {
    if (token !== null) {
      getProducts();
    }
  }, [token]);

  const getDetailedProduct = async (productId: string) => {
    const detailedProduct = await getProductInfo(productId).unwrap();
    return detailedProduct;
  };

  return {
    loadingProducts,
    productList,
    getDetailedProduct,
    loadingProductDetails,
  };
}
