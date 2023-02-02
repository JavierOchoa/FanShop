import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { SpacedSubTypography } from "../components";
import { CartItem } from "../interfaces";
import { PageLayout } from "../layouts";
import { useAppSelector } from "../utils/hooks";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.user.cart) as CartItem[];
  console.log(cartItems);
  return (
    <PageLayout
      title={"Cart"}
      pageDescription={"Cart page. User can review items before proceeding with the purchase"}
    >
      <SpacedSubTypography>cart</SpacedSubTypography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
      </Grid>
    </PageLayout>
  );
}
