import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SpacedSubTypography } from "../components";
import { LoginDialog } from "../components/auth";
import { PageLayout } from "../layouts";
import { useAppDispatch } from "../utils/hooks";
import useAuth from "../utils/hooks/useAuth";
import useCheckout from "../utils/hooks/useCheckout";
import { removeFromCart } from "../redux/slices";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const { cartItems, createOrder, loadingNewOrder } = useCheckout();
  const [amount, setAmount] = useState<number>(0);

  const handleRemove = (id: string, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  useEffect(() => {
    let newAmount = 0;
    cartItems.forEach((item) => (newAmount = +item.price));
    setAmount(newAmount);
  }, [cartItems]);

  return (
    <PageLayout
      title={"Cart"}
      pageDescription={"Cart page. Review items before proceeding with the purchase"}
    >
      <SpacedSubTypography>cart</SpacedSubTypography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {cartItems.map((item, index) => {
            return (
              <Card key={`${index}-${item.id}`} sx={{ mb: 2 }}>
                <CardContent sx={{ display: "flex" }}>
                  <Image src={item.image} alt={item.title} width={140} height={140} />
                  <Box alignSelf={"center"}>
                    <Box mx={2}>
                      <Typography>{item.title}</Typography>
                      <Typography variant={"body2"}>Size: {item.size}</Typography>
                      <Typography variant={"body2"}>{item.quantity} selected</Typography>
                      <Typography variant={"body2"}>${item.price}</Typography>
                    </Box>
                    <Link href={`products/[id]`} as={`products/${item.id}`}>
                      <Button sx={{ mx: 1 }}>EDIT</Button>
                    </Link>
                    <Button onClick={() => handleRemove(item.id, item.size)} sx={{ mx: 1 }}>
                      REMOVE
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography fontSize={"x-large"}>TOTAL</Typography>
              <Typography fontSize={"large"}>Total Items: {cartItems.length}</Typography>
              <Typography fontSize={"large"}>Total Amount: ${amount}</Typography>
            </Stack>
            <Box display={"flex"} justifyContent={"center"}>
              {!isAuthenticated && (
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} my={4}>
                  <LoginDialog />
                  <Typography variant={"overline"} color={"gray"}>
                    Sign in to checkout
                  </Typography>
                </Box>
              )}
              {isAuthenticated && (
                <LoadingButton
                  onClick={createOrder}
                  type={"submit"}
                  loading={loadingNewOrder}
                  loadingIndicator="Checking out..."
                  variant="contained"
                  sx={{ my: 4 }}
                >
                  Check out
                </LoadingButton>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
