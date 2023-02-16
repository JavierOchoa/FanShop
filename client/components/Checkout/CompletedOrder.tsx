import { Box, Button, Paper, Typography } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { OrderInformation } from "../../interfaces";
import { CheckCircleTwoTone } from "@mui/icons-material";
import Link from "next/link";
import useCheckout from "../../utils/hooks/useCheckout";

interface Props {
  order: OrderInformation;
}

export const CompletedOrder: FC<PropsWithChildren<Props>> = ({ order }) => {
  const { handleCleanCart } = useCheckout();
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Paper sx={{ p: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CheckCircleTwoTone color={"primary"} sx={{ width: 80, height: 80 }} />
        <Typography variant={"h3"} sx={{ my: 3 }}>
          {order.status.toUpperCase()}
        </Typography>
        <Box>
          <Typography variant={"body2"} fontSize={"medium"}>
            Order: {order.id}
          </Typography>
          <Typography variant={"body2"} fontSize={"medium"}>
            Total: ${order.total}
          </Typography>
          <Box>
            <Typography variant={"overline"} fontSize={"medium"}>
              Ships to:
            </Typography>
            <Typography variant={"body2"}>{order.address.fullName}</Typography>
            <Typography variant={"body2"}>{order.address.phone}</Typography>
            <Typography variant={"body2"}>{order.address.address}</Typography>
            <Typography variant={"body2"}>
              {order.address.city} - {order.address.state}
            </Typography>
            <Typography variant={"body2"}>{order.address.country}</Typography>
          </Box>
        </Box>
        <Link href={"/"}>
          <Button variant={"contained"} onClick={handleCleanCart}>
            OK
          </Button>
        </Link>
      </Paper>
    </Box>
  );
};
