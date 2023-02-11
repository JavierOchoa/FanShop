import { useAppSelector } from ".";
import { AddressBody, CartItem } from "../../interfaces";
import {
  useCreateAddressMutation,
  useCreateOrderMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "../../redux/services";

export default function useCheckout() {
  const cartItems = useAppSelector((state) => state.user.cart) as CartItem[];
  const [newOrder, { isLoading: loadingNewOrder }] = useCreateOrderMutation();
  const [createAddress, { isLoading: loadingNewAddress }] = useCreateAddressMutation();
  const [removeAddress, { isLoading: loadingRemoveAddress }] = useDeleteAddressMutation();
  const [editAddress, { isLoading: loadingEditAddress }] = useUpdateAddressMutation();

  const createOrder = async () => {
    try {
      return await newOrder().unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const newAddress = async (body: AddressBody) => {
    try {
      return await createAddress(body).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      return await removeAddress(id).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  const updateAddress = async (body: AddressBody) => {
    try {
      return await editAddress(body).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    cartItems,
    createOrder,
    loadingNewOrder,
    newAddress,
    loadingNewAddress,
    deleteAddress,
    loadingRemoveAddress,
    updateAddress,
    loadingEditAddress,
  };
}
