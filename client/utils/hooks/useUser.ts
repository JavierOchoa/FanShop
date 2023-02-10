import { useAppSelector } from ".";
import { CartItem } from "../../interfaces";
import { useCreateOrderMutation } from "../../redux/services";

export default function useUser() {
  const cartItems = useAppSelector((state) => state.user.cart) as CartItem[];
  const [newOrder, { isLoading: loadingNewOrder }] = useCreateOrderMutation();

  const createOrder = async () => {
    try {
      const response = await newOrder().unwrap();
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    cartItems,
    createOrder,
    loadingNewOrder,
  };
}
