import { FC, PropsWithChildren } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { DetailedProduct } from "../../interfaces";
import { useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "./../../redux/slices/productSlice";
import useAdmin from "../../utils/hooks/useAdmin";
interface Props {
  openStatus: boolean;
  product: DetailedProduct | undefined;
}

export const EditProductDialog: FC<PropsWithChildren<Props>> = ({ openStatus, product }) => {
  const dispatch = useAppDispatch();
  // const { getDetailedProduct, detailedProduct, loadingProductDetails } = useAdmin();
  const handleClose = () => {
    dispatch(changeOpenEditDialogStatus());
  };
  return (
    <Dialog open={openStatus} onClose={handleClose} fullWidth={true} maxWidth={"xl"}>
      <DialogTitle>Edit product information</DialogTitle>
      <DialogContent>
        <Box sx={{ m: 1 }}>
          <FormGroup row sx={{ alignItems: "center", margin: "1rem 0" }}>
            <TextField
              id="outlined-title"
              label="Title"
              sx={{ flexGrow: "1" }}
              helperText={product ? product.title : "Product Title"}
            />
            <ImageList sx={{ width: 250, marginLeft: "1rem" }}>
              {product ? (
                product.images.map((item, index) => (
                  <ImageListItem key={index}>
                    <img src={item.url} alt={`${product.title} ${index}`} loading="lazy" />
                  </ImageListItem>
                ))
              ) : (
                <></>
              )}
            </ImageList>
          </FormGroup>
          <FormGroup>
            <TextField
              id="outlined-description"
              label="Description"
              helperText={product ? product.description : "Product Description"}
            />
          </FormGroup>
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              margin: "1rem 0",
            }}
          >
            <TextField
              id="outlined-price"
              label="Price"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText={product ? `Current price: $${product.price}` : "Product Price"}
            />
            <TextField
              id="outlined-stock"
              label="Stock"
              helperText={product ? `Current stock: ${product.stock}` : "Product Stock"}
            />
            {product && (
              <Typography variant="overline" display="block" gutterBottom>
                Created by: {product.user?.fullName}
              </Typography>
            )}
          </FormGroup>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
