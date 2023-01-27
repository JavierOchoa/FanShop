import { Box, Card, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import { ListedProduct } from "../../interfaces";

interface Props {
  product: ListedProduct;
}

export const ProductCard: FC<PropsWithChildren<Props>> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? `${product.images[0].url}` : `${product.images[1].url}`;
  }, [isHovered, product.images]);
  return (
    <Grid
      item
      xs={6}
      sm={4}
      // sx={{ maxWidth: 400 }}
      // sx={{ maxWidth: 400, mx: 2, my: 1 }}
      key={product.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={"product/slug"} passHref prefetch={false}>
        <Card>
          <CardActionArea>
            <CardMedia component="img" image={productImage} />
          </CardActionArea>
        </Card>
      </Link>
      <Box sx={{ mt: 1 }} className="fadeIn">
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  );
};
