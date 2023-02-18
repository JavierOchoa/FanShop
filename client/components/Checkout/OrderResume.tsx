import { FC, PropsWithChildren } from "react";
import { AddressBody, OrderInformation } from "../../interfaces";
import { Box, Paper, Typography } from "@mui/material";

interface Props {
  orderData: OrderInformation;
  selectedAddress: AddressBody;
}

export const OrderResume: FC<PropsWithChildren<Props>> = ({ orderData, selectedAddress }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant={"h3"} sx={{ mb: 2 }}>
        Order Resume
      </Typography>
      {orderData.products.map((product) => (
        <Box key={product.id} display={"flex"} alignItems={"center"}>
          <Typography id={`${product.id}-quantity`} variant={"body2"}>
            x{product.quantity}
          </Typography>
          <Typography
            id={`${product.id}-title`}
            variant={"body2"}
            fontWeight={"bold"}
            sx={{ mx: 1 }}
          >
            {product.product.title}
          </Typography>
          <Typography id={`${product.id}-size`} variant={"body2"}>
            Size: {product.size}
          </Typography>
        </Box>
      ))}
      <Typography variant={"h5"} sx={{ mt: 2 }}>
        Ships to:
      </Typography>
      <Typography variant={"body2"}>{selectedAddress.fullName}</Typography>
      <Typography variant={"body2"}>{selectedAddress.phone}</Typography>
      <Typography variant={"body2"}>{selectedAddress.address}</Typography>
      <Typography variant={"body2"}>
        {selectedAddress.city}, {selectedAddress.state}
      </Typography>
      <Typography variant={"body2"}>{selectedAddress.country}</Typography>
    </Paper>
  );
};
