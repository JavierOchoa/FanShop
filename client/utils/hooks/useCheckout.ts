import { useAppDispatch, useAppSelector } from ".";
import { AddressBody, CartItem } from "../../interfaces";
import {
  useCreateAddressMutation,
  useCreateOrderMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
  usePayWithPaypalMutation,
} from "../../redux/services";
import { useRouter } from "next/router";
import { useState } from "react";
import { addToCart, removeFromCart, cleanCart } from "../../redux/slices";

export default function useCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.user.cart) as CartItem[];
  const [newOrder, { isLoading: loadingNewOrder }] = useCreateOrderMutation();
  const [createAddress, { isLoading: loadingNewAddress }] = useCreateAddressMutation();
  const [removeAddress, { isLoading: loadingRemoveAddress }] = useDeleteAddressMutation();
  const [editAddress, { isLoading: loadingEditAddress }] = useUpdateAddressMutation();
  const [newPaypalOrder, { isLoading: loadingNewPaypalOrder }] = usePayWithPaypalMutation();
  const [checkoutError, setCheckoutError] = useState<string | undefined>(undefined);

  const dispatchAddToCart = (body: CartItem) => {
    dispatch(addToCart(body));
  };

  const dispatchRemoveFromCart = (id: string, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  const handleCleanCart = () => {
    dispatch(cleanCart());
  };

  const createOrder = async () => {
    setCheckoutError(undefined);
    try {
      const { successful, message, data } = await newOrder(cartItems).unwrap();
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

  const payWithPaypal = async (orderId: string, total: number, addressId: string) => {
    try {
      const response = await newPaypalOrder({ orderId, total, addressId }).unwrap();
      if (response.id) {
        const payer_action_link = response.links[1].href;
        window.open(
          payer_action_link,
          "targetWindow",
          `toolbar=no,
          location=no,
          status=no,
          menubar=no,
          scrollbars=yes,
          resizable=yes,
          width=485,
          height=780`
        );
      }
    } catch (err) {
      setCheckoutError((err as Error).message);
    }
  };

  return {
    cartItems,
    dispatchAddToCart,
    dispatchRemoveFromCart,
    handleCleanCart,
    createOrder,
    loadingNewOrder,
    newAddress,
    loadingNewAddress,
    deleteAddress,
    loadingRemoveAddress,
    updateAddress,
    loadingEditAddress,
    checkoutError,
    payWithPaypal,
    loadingNewPaypalOrder,
  };
}
