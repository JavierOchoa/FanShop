import { Add, Remove } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import { SpacedSubTypography } from "../../components";
import { ProductImageCarousel } from "../../components/ProductImageCarousel";
import { CartItem } from "../../interfaces";
import { PageLayout } from "../../layouts";
import { useGetProductInformationQuery } from "../../redux/services";
import useCheckout from "../../utils/hooks/useCheckout";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductPage() {
  const router = useRouter();
  const productId = router.query.id as string;
  const { data: productInformation } = useGetProductInformationQuery(productId);
  const { dispatchAddToCart } = useCheckout();
  const [buttonStatus, setButtonStatus] = useState<boolean>(true);
  const [body, setBody] = useState<CartItem>({
    id: "",
    title: "",
    image: "",
    quantity: 1,
    price: 0,
    size: "",
  });
  const handleBodyChange = (event: MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.id;
    if (id === "increase") {
      setBody({
        ...body,
        quantity: body.quantity + 1,
      });
    }
    if (id === "decrease") {
      setBody({
        ...body,
        quantity: Math.max(body.quantity - 1, 1),
      });
    }
    if (sizes.includes(id)) {
      setButtonStatus(false);
      setBody({
        ...body,
        id: productId,
        title: productInformation!.data.title,
        image: productInformation!.data.images[0].url,
        price: productInformation!.data.price,
        size: id,
      });
    }
  };

  const handleAddToCart = () => {
    dispatchAddToCart(body);
  };

  return (
    <PageLayout title={"Product Page"} pageDescription={"Detailed product page"}>
      {!productInformation && <Box>Loading</Box>}
      {productInformation?.successful === false && <Box>Error</Box>}
      {productInformation?.successful === true && (
        <Grid container spacing={2}>
          <Grid item xs={6} display={"flex"} justifyContent={"center"}>
            <ProductImageCarousel images={productInformation.data.images} />
          </Grid>
          <Grid item xs={6}>
            <SpacedSubTypography>{productInformation.data.title}</SpacedSubTypography>
            <Typography variant="body1" fontWeight={"bold"} fontSize={"large"}>
              ${productInformation.data.price}
            </Typography>
            <Box my={3}>
              <Typography variant={"body1"} fontWeight={"bold"}>
                Quantity:
              </Typography>
              <ButtonGroup size={"small"}>
                <Button
                  aria-label={"decrease"}
                  id={"decrease"}
                  disabled={body.quantity <= 1}
                  onClick={handleBodyChange}
                >
                  <Remove fontSize="small" />
                </Button>
                <Button disableElevation disableRipple>
                  {body.quantity}
                </Button>
                <Button aria-label={"increase"} id={"increase"} onClick={handleBodyChange}>
                  <Add fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>
            <Box my={3}>
              <Typography variant={"body1"} fontWeight={"bold"}>
                Sizes:
              </Typography>
              <ButtonGroup>
                {sizes.map((size, i) => {
                  return (
                    <Button
                      key={i}
                      id={`${size}`}
                      variant={size === body.size ? "contained" : "outlined"}
                      disabled={!productInformation.data.sizes.includes(size)}
                      onClick={handleBodyChange}
                    >
                      {size}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Box>
            <Button
              disabled={buttonStatus || productInformation.data.stock === 0}
              onClick={handleAddToCart}
              variant={"contained"}
              sx={{ mb: 3 }}
            >
              {productInformation.data.stock === 0 ? "Out of Stock" : "Add to cart"}
            </Button>
            <Box>
              <Typography variant={"body1"} fontWeight={"bold"}>
                Description:
              </Typography>
              <Typography variant={"body1"}>{productInformation.data.description}</Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </PageLayout>
  );
}
