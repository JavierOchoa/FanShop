import { useAppSelector } from ".";
import { AddressBody, CartItem } from "../../interfaces";
import {
  useCreateAddressMutation,
  useCreateOrderMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "../../redux/services";
import { useRouter } from "next/router";
import { useState } from "react";

export default function useCheckout() {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.user.cart) as CartItem[];
  const [newOrder, { isLoading: loadingNewOrder }] = useCreateOrderMutation();
  const [createAddress, { isLoading: loadingNewAddress }] = useCreateAddressMutation();
  const [removeAddress, { isLoading: loadingRemoveAddress }] = useDeleteAddressMutation();
  const [editAddress, { isLoading: loadingEditAddress }] = useUpdateAddressMutation();
  const [checkoutError, setCheckoutError] = useState<string | undefined>(undefined);

  const createOrder = async () => {
    setCheckoutError(undefined);
    try {
      const { successful, message, data } = await newOrder(cartItems).unwrap();
      console.log(data);
      if (successful) {
        await router.push(`/checkout/${data}`);
      } else {
        setCheckoutError(message);
      }
    } catch (err) {
      setCheckoutError((err as Error).message);
    }
  };

  const newAddress = async (body: AddressBody) => {
    setCheckoutError(undefined);
    try {
      return await createAddress(body).unwrap();
    } catch (err) {
      setCheckoutError((err as Error).message);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      return await removeAddress(id).unwrap();
    } catch (err) {
      setCheckoutError((err as Error).message);
    }
  };

  const updateAddress = async (body: AddressBody) => {
    try {
      return await editAddress(body).unwrap();
    } catch (err) {
      setCheckoutError((err as Error).message);
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
    checkoutError,
  };
}
