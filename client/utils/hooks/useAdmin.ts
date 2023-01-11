import { useState, useEffect } from "react";
import { useAppSelector } from ".";
import { DetailedProduct, ProductPost } from "../../interfaces";
import {
  useGetProductsMutation,
  useGetProductDetailsMutation,
  useEditProductMutation,
  useAddProductMutation,
} from "../../redux/services";

export default function useAdmin() {
  const token = useAppSelector((state) => state.auth.token);
  const [getProducts, { data: productList, isLoading: loadingProducts }] = useGetProductsMutation();
  const [getProductInfo, { isLoading: loadingProductDetails }] = useGetProductDetailsMutation();
  const [editProduct, { isLoading: loadingProductEdit }] = useEditProductMutation();
  const [addProduct, { isLoading: loadingProductCreation }] = useAddProductMutation();
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

  const postEditProduct = async (productToEdit: ProductPost) => {
    try {
      const editProductResponse = await editProduct(productToEdit).unwrap();
      return editProductResponse;
    } catch (err) {
      console.log(err);
    }
  };

  const postAddProduct = async (productToAdd: ProductPost) => {
    try {
      const addProductResponse = await addProduct(productToAdd).unwrap();
      return addProductResponse;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    loadingProducts,
    productList,
    getDetailedProduct,
    postEditProduct,
    postAddProduct,
    loadingProductDetails,
  };
}
