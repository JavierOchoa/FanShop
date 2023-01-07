import { useState, useEffect } from "react";
import { useAppSelector } from ".";
import { DetailedProduct } from "../../interfaces";
import { useGetProductsMutation, useGetProductDetailsMutation } from "../../redux/services";

export default function useAdmin() {
  const token = useAppSelector((state) => state.auth.token);
  const [getProducts, { data: productList, isLoading: loadingProducts }] = useGetProductsMutation();
  const [getProductInfo, { isLoading: loadingProductDetails }] = useGetProductDetailsMutation();
  const [finalProduct, setFinalProduct] = useState<DetailedProduct | undefined>(undefined);

  useEffect(() => {
    if (token !== null) {
      getProducts();
    }
  }, [token]);

  const getDetailedProduct = async (productId: string) => {
    try {
      const detailedProduct = await getProductInfo(productId).unwrap();
      setFinalProduct(detailedProduct);
      return detailedProduct;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    loadingProducts,
    productList,
    getDetailedProduct,
    loadingProductDetails,
  };
}
