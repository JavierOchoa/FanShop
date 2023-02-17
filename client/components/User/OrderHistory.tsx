import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetOrderHistoryQuery } from "../../redux/services";
import { OrderCard } from "./OrderCard";

export const OrderHistory = () => {
  const { data: purchases, isLoading: loadingPurchases } = useGetOrderHistoryQuery(undefined, {
    refetchOnFocus: true,
  });

  if (loadingPurchases) return <CircularProgress />;
  if ((purchases && purchases.successful === false) || (purchases && purchases.data.length === 0))
    return <Typography>Seems you have not purchased anything yet</Typography>;

  return (
    <Box display={"flex"} flexWrap={"wrap"} flexDirection={"column"} ml={2}>
      {purchases?.data.map((order) => {
        return <OrderCard key={order.id} order={order} />;
      })}
    </Box>
  );
};
