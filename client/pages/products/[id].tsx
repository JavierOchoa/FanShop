import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { Carousel } from "react-responsive-carousel";
import { ProductImageCarousel } from "../../components/ProductImageCarousel";
import { PageLayout } from "../../layouts";
import { useGetProductInformationQuery } from "../../redux/services";

export default function ProductPage() {
  const router = useRouter();
  const productId = router.query.id as string;

  const { data: productInformation } = useGetProductInformationQuery(productId);
  return (
    <PageLayout title={"Product Page"} pageDescription={"Detailed product page"}>
      {!productInformation && <Box>Loading</Box>}
      {productInformation?.successful === false && <Box>Error</Box>}
      {productInformation?.successful === true && (
        // <ProductImageCarousel images={productInformation.data.images} />
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <ProductImageCarousel images={productInformation.data.images} />
          </Grid>
          <Grid item xs={4}>
            <Box>444</Box>
          </Grid>
        </Grid>
      )}
    </PageLayout>
  );
}
