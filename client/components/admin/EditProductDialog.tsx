import { FC, PropsWithChildren } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { DetailedProduct, Size, Tag } from "../../interfaces";
import { useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "./../../redux/slices/productSlice";
import useAdmin from "../../utils/hooks/useAdmin";
import { CheckBox } from "@mui/icons-material";
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
  const handleGenderChange = () => {};
  const handleSizeChange = () => {};
  const handleTagChange = () => {};

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
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                      <IconButton color="primary" aria-label="view photo" component="label">
                        <Visibility />
                      </IconButton>
                      <IconButton color="primary" aria-label="view photo" component="label">
                        <Delete />
                      </IconButton>
                    </Stack>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              margin: "1rem 0",
            }}
          >
            <FormControl>
              <FormLabel id={"genders"}>Gender</FormLabel>
              <RadioGroup
                row
                name="genders-group"
                defaultValue={product ? product.gender : "unisex"}
                onChange={handleGenderChange}
              >
                <FormControlLabel value={"kid"} control={<Radio />} label={"Kid"} />
                <FormControlLabel value={"men"} control={<Radio />} label={"Men"} />
                <FormControlLabel value={"unisex"} control={<Radio />} label={"Unisex"} />
                <FormControlLabel value={"women"} control={<Radio />} label={"Women"} />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id={"sizes"}>Sizes</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.sizes.includes(Size.L) : false}
                      onChange={handleSizeChange}
                      name={"L"}
                    />
                  }
                  label={"L"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.sizes.includes(Size.M) : false}
                      onChange={handleSizeChange}
                      name={"M"}
                    />
                  }
                  label={"M"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.sizes.includes(Size.S) : false}
                      onChange={handleSizeChange}
                      name={"S"}
                    />
                  }
                  label={"S"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.sizes.includes(Size.Xl) : false}
                      onChange={handleSizeChange}
                      name={"XL"}
                    />
                  }
                  label={"XL"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.sizes.includes(Size.Xs) : false}
                      onChange={handleSizeChange}
                      name={"XS"}
                    />
                  }
                  label={"XS"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.sizes.includes(Size.Xxl) : false}
                      onChange={handleSizeChange}
                      name={"XXL"}
                    />
                  }
                  label={"XXL"}
                />
              </FormGroup>
            </FormControl>
            <FormControl>
              <FormLabel id={"tags"}>Tags</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.tags.includes(Tag.Hats) : false}
                      onChange={handleTagChange}
                      name={"Hats"}
                    />
                  }
                  label={"Hats"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.tags.includes(Tag.Hoodie) : false}
                      onChange={handleTagChange}
                      name={"Hoodie"}
                    />
                  }
                  label={"Hoodie"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.tags.includes(Tag.Jacket) : false}
                      onChange={handleTagChange}
                      name={"Jacket"}
                    />
                  }
                  label={"Jacket"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.tags.includes(Tag.Shirt) : false}
                      onChange={handleTagChange}
                      name={"Shirt"}
                    />
                  }
                  label={"Shirt"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product ? product.tags.includes(Tag.Sweatshirt) : false}
                      onChange={handleTagChange}
                      name={"Sweatshirt"}
                    />
                  }
                  label={"Sweatshirt"}
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained" disableElevation>
              Save
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
