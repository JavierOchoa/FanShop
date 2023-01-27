import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { SpacedSubTypography } from "../../../components";
import { ProductList } from "../../../components/Products/ProductGrid";
import { PageLayout } from "../../../layouts/PageLayout";
import { useGetProductsListQuery } from "../../../redux/services";

export default function CategoryProducts() {
  const router = useRouter();
  const category = router.query.category as string;
  const { data: products } = useGetProductsListQuery(category || "all");

  return (
    <PageLayout
      title={category ? `${category?.toUpperCase()}` : "Getting products..."}
      pageDescription={`FanShop ${category?.toUpperCase()} Products`}
    >
      <SpacedSubTypography>{`${category} products`}</SpacedSubTypography>
      {!products && <Box>No Products</Box>}
      {products?.successful === false && <Box>Error</Box>}
      {products && <ProductList products={products.data} />}
    </PageLayout>
  );
}
