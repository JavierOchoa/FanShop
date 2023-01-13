import { useState, useEffect } from "react";
import { useAppSelector } from ".";
import { DetailedProduct, ModalType, ProductPost, ProductPostResponse } from "../../interfaces";
import {
  useGetProductDetailsMutation,
  useEditProductMutation,
  useAddProductMutation,
  useRemoveProductMutation,
} from "../../redux/services";

export default function useAdmin() {
  const token = useAppSelector((state) => state.auth.token);
  // const [getProducts, { data: productList, isLoading: loadingProducts }] = useGetProductsMutation();
  const [getProductInfo, { isLoading: loadingProductDetails }] = useGetProductDetailsMutation();
  const [editProduct, { isLoading: loadingProductEdit }] = useEditProductMutation();
  const [addProduct, { isLoading: loadingProductCreation }] = useAddProductMutation();
  const [removeProduct, { isLoading: loadingProductRemoval }] = useRemoveProductMutation();
  // const { data, isLoading: loLo } = useTestEndpointQuery();
  const [finalProduct, setFinalProduct] = useState<DetailedProduct | undefined>(undefined);

  // useEffect(() => {
  //   if (token !== null) {
  //     getProducts();
  //   }
  // }, [token]);

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

  const handleProductSave = async (product: ProductPost, typeEdit: ModalType) => {
    let response: ProductPostResponse | undefined;
    try {
      typeEdit === "edit"
        ? (response = await postEditProduct(product))
        : (response = await postAddProduct(product));
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await removeProduct(productId).unwrap();
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProducts = async (productsToDelete: string[]) => {
    try {
      const toResolve = productsToDelete.map((product) => removeProduct(product).unwrap());
      await Promise.all(toResolve);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    getDetailedProduct,
    postEditProduct,
    postAddProduct,
    handleProductSave,
    deleteProduct,
    loadingProductDetails,
    deleteProducts,
  };
}
