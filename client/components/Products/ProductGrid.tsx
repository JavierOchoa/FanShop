import { Grid } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { ListedProduct } from "../../interfaces";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ListedProduct[];
}

export const ProductList: FC<PropsWithChildren<Props>> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};
