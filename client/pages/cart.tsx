import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SpacedSubTypography } from "../components";
import { LoginDialog } from "../components/auth";
import { PageLayout } from "../layouts";
import useAuth from "../utils/hooks/useAuth";
import useCheckout from "../utils/hooks/useCheckout";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cartItems, createOrder, loadingNewOrder, checkoutError, dispatchRemoveFromCart } =
    useCheckout();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    let newAmount = cartItems.reduce((acc, value) => acc + value.price * value.quantity, 0);

    setAmount(newAmount);
  }, [cartItems]);

  return (
    <PageLayout title={"Cart"} pageDescription={"Review items before proceeding with the purchase"}>
      <SpacedSubTypography>{cartItems.length > 0 ? "cart" : "empty cart"}</SpacedSubTypography>
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
                    <Button
                      onClick={() => dispatchRemoveFromCart(item.id, item.size)}
                      sx={{ mx: 1 }}
                    >
                      REMOVE
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
        <Grid item xs={4}>
          {cartItems.length > 0 && (
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
                    loadingIndicator="Processing..."
                    variant="contained"
                    sx={{ my: 4 }}
                  >
                    Check out
                  </LoadingButton>
                )}
              </Box>
              {checkoutError && (
                <Alert variant="filled" severity="error">
                  {checkoutError}
                </Alert>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </PageLayout>
  );
}
