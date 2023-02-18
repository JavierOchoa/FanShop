import { ModalType, ProductPost, APIResponse, UserPost } from "../../interfaces";
import {
  useGetProductDetailsMutation,
  useEditProductMutation,
  useAddProductMutation,
  useRemoveProductMutation,
  useRemoveUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useEditUserMutation,
  useAddUserMutation,
} from "../../redux/services";

export default function useAdmin() {
  const [getProductInfo, { isLoading: loadingProductDetails }] = useGetProductDetailsMutation();
  const [editProduct] = useEditProductMutation();
  const [addProduct] = useAddProductMutation();
  const [removeProduct] = useRemoveProductMutation();
  const [editUserMutation] = useEditUserMutation();
  const [addUserMutation] = useAddUserMutation();
  const [activateUserMutation] = useActivateUserMutation();
  const [deactivateUserMutation] = useDeactivateUserMutation();
  const [removeUser] = useRemoveUserMutation();

  const getDetailedProduct = async (productId: string) => {
    try {
      const detailedProduct = await getProductInfo(productId).unwrap();
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
    let response: APIResponse | undefined;
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

  const postAddUser = async (userToAdd: UserPost) => {
    try {
      const addUserResponse = await addUserMutation(userToAdd).unwrap();
      return addUserResponse;
    } catch (err) {
      console.log(err);
    }
  };

  const postEditUser = async (userToEdit: UserPost) => {
    try {
      const editUserResponse = await editUserMutation(userToEdit).unwrap();
      return editUserResponse;
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserSave = async (user: UserPost, typeEdit: ModalType) => {
    let response: APIResponse | undefined;
    try {
      typeEdit === "edit"
        ? (response = await postEditUser(user))
        : (response = await postAddUser(user));
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUsers = async (usersToDelete: string[]) => {
    try {
      const toResolve = usersToDelete.map((user) => removeUser(user).unwrap());
      await Promise.all(toResolve);
    } catch (err) {
      console.log(err);
    }
  };

  const activateUsers = async (usersToActivate: string[]) => {
    try {
      const toResolve = usersToActivate.map((user) => activateUserMutation(user).unwrap());
      await Promise.all(toResolve);
    } catch (err) {
      console.log(err);
    }
  };

  const deactivateUsers = async (usersToDeactivate: string[]) => {
    try {
      const toResolve = usersToDeactivate.map((user) => deactivateUserMutation(user).unwrap());
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
    postAddUser,
    postEditUser,
    activateUsers,
    deactivateUsers,
    deleteUsers,
    handleUserSave,
  };
}
