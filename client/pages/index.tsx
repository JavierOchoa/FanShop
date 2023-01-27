import { Box } from "@mui/material";
import { SpacedSubTypography } from "../components";
import { ProductList } from "../components/Products/ProductGrid";
import { PageLayout } from "../layouts/PageLayout";
import { useGetProductsListQuery } from "../redux/services";

export default function Home() {
  const { data: products } = useGetProductsListQuery("all");
  return (
    <PageLayout title="Home" pageDescription="FanShop homepage">
      <SpacedSubTypography>all products</SpacedSubTypography>
      {!products && <Box>No Products</Box>}
      {products?.successful === false && <Box>Error</Box>}
      {products && <ProductList products={products.data} />}
    </PageLayout>
  );
}
