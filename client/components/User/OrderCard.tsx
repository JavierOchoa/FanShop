import { OrderResume } from "../../interfaces";
import { Box, Button, Card, Typography } from "@mui/material";
import { FC, useState } from "react";

interface Props {
  order: OrderResume;
}

export const OrderCard: FC<Props> = ({ order }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };
  return (
    <Box key={order.id} mb={3}>
      <Card sx={{ p: 2 }}>
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant={"body2"}>Order ID: {order.id}</Typography>
          <Button onClick={handleShowInfo} sx={{ ml: "auto" }}>
            {showInfo ? "Hide" : "Show"}
          </Button>
        </Box>
      </Card>
      <Box display={showInfo ? "flex" : "none"} py={3}>
        <Box>
          <Typography fontWeight={"bold"} sx={{ mb: 2 }}>
            {order.status.toUpperCase()}
          </Typography>
          <Box my={2}>
            {order.products.map((product) => {
              return (
                <Box key={product.id} display={"flex"} alignItems={"center"}>
                  <Typography variant={"body2"}>x{product.quantity}</Typography>
                  <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                    {product.product.title}
                  </Typography>
                  <Typography variant={"body2"}>Size: {product.size}</Typography>
                </Box>
              );
            })}
          </Box>
          <Typography variant={"overline"}>Ships to:</Typography>
          <Typography variant={"body2"}>{order.address.fullName}</Typography>
          <Typography variant={"body2"}>{order.address.phone}</Typography>
          <Typography variant={"body2"}>{order.address.address}</Typography>
          <Typography variant={"body2"}>
            {order.address.city} - {order.address.state}
          </Typography>
          <Typography>{order.address.country}</Typography>
        </Box>
        <Box ml={"auto"}>
          <Typography fontWeight={"bold"} align={"right"} sx={{ mb: 2 }}>
            TOTAL
          </Typography>
          <Typography variant={"body2"} align={"right"}>
            Items: {order.products.length}
          </Typography>
          <Typography variant={"body2"} align={"right"}>
            You paid: ${order.total}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
