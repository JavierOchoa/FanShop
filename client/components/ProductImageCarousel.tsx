import { FC, PropsWithChildren } from "react";
import { ImageInProduct } from "../interfaces";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box } from "@mui/material";
import Image from "next/image";

interface Props {
  images: ImageInProduct[];
}

export const ProductImageCarousel: FC<PropsWithChildren<Props>> = ({ images }) => {
  return (
    <Carousel
      showStatus={false}
      showThumbs={false}
      infiniteLoop={true}
      autoPlay={true}
      swipeable={true}
      emulateTouch={true}
      interval={5000}
      transitionTime={1000}
      width={400}
    >
      {images.map((image, i) => {
        return (
          <Box key={i}>
            <Image src={image.url} alt={image.id} width={400} height={400} />
          </Box>
        );
      })}
    </Carousel>
  );
};
