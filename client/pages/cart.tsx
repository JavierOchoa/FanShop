import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SpacedSubTypography } from "../components";
import { LoginDialog } from "../components/auth";
import { CartItem } from "../interfaces";
import { PageLayout } from "../layouts";
import { useAppSelector } from "../utils/hooks";
import useAuth from "../utils/hooks/useAuth";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const cartItems = useAppSelector((state) => state.user.cart) as CartItem[];
  const [amount, setAmount] = useState<number>(0);

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
          {cartItems.map((item) => {
            console.log(item.image);
            return (
              <Card key={item.id}>
                <CardContent sx={{ display: "flex" }}>
                  <Image src={item.image} alt={item.title} width={140} height={140} />
                  <Box alignSelf={"center"}>
                    <Box mx={2}>
                      <Link href={`products/${item.id}`}>
                        <Typography>{item.title}</Typography>
                      </Link>
                      <Typography variant={"body2"}>Size: {item.size}</Typography>
                      <Typography variant={"body2"}>{item.quantity} selected</Typography>
                      <Typography variant={"body2"}>${item.price}</Typography>
                    </Box>
                    <Button sx={{ mx: 1 }}>REMOVE</Button>
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
                  // onClick={handleClick}
                  type={"submit"}
                  // loading={loginRequestLoading}
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
