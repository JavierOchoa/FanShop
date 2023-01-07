import { ChangeEvent, createRef, FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { DetailedProduct } from "../../interfaces";
import { useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "./../../redux/slices/productSlice";
import useAdmin from "../../utils/hooks/useAdmin";
import { CheckBox } from "@mui/icons-material";
interface Props {
  openStatus: boolean;
  product: DetailedProduct | undefined;
  // product: any;
}

export const EditProductDialog: FC<PropsWithChildren<Props>> = ({ openStatus, product }) => {
  const dispatch = useAppDispatch();
  const productTitle = createRef<HTMLInputElement>();
  const productPrice = createRef<HTMLInputElement>();
  const productDescription = createRef<HTMLInputElement>();
  const productStock = createRef<HTMLInputElement>();
  const [productBody, setProductBody] = useState({
    title: "",
    price: 0,
    description: "",
    stock: 0,
    gender: "unisex",
  });

  const [genderState, setGenderState] = useState("unisex");
  const [sizeState, setSizeState] = useState<{
    XS: boolean;
    S: boolean;
    M: boolean;
    L: boolean;
    XL: boolean;
    XXL: boolean;
  }>({
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
    XXL: false,
  });
  const [tagState, setTagState] = useState({
    shirts: false,
    pants: false,
    hoodies: false,
    jackets: false,
    hats: false,
    sweatshirts: false,
  });

  const [imageState, setImageState] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setProductBody({
        title: product.title,
        price: product.price,
        description: product.description,
        stock: product.stock,
        gender: product.gender,
      });
      setGenderState(product.gender);
      product.images.forEach((image) => {
        setImageState((prevState) => [...prevState, image.url]);
      });
      product.sizes.forEach((size) => {
        setSizeState({
          ...sizeState,
          [size]: true,
        });
      });
      product.tags.forEach((tag) => {
        setTagState({
          ...tagState,
          [tag]: true,
        });
      });
    }
  }, [product]);

  const handleClose = () => {
    setProductBody({
      title: "",
      price: 0,
      description: "",
      stock: 0,
      gender: "unisex",
    });
    setSizeState({
      XS: false,
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
    });
    setTagState({
      shirts: false,
      pants: false,
      hoodies: false,
      jackets: false,
      hats: false,
      sweatshirts: false,
    });
    setImageState([]);
    dispatch(changeOpenEditDialogStatus());
  };
  const handleProductBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductBody({
      ...productBody,
      [event.target.name]:
        event.target.name === "price" || event.target.name === "stock"
          ? Number(event.target.value)
          : event.target.value,
    });
  };
  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSizeState({
      ...sizeState,
      [event.target.name]: event.target.checked,
    });
  };
  const handleTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagState({
      ...tagState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    const sizes = Object.keys(sizeState).filter(
      (checked) => sizeState[checked as keyof typeof sizeState]
    );
    const tags = Object.keys(tagState).filter(
      (checked) => tagState[checked as keyof typeof tagState]
    );
    const finalObj = {
      ...productBody,
      sizes,
      tags,
      images: imageState,
    };
    console.log(finalObj);
  };

  return (
    <Dialog open={openStatus} onClose={handleClose} fullWidth={true} maxWidth={"xl"}>
      <DialogTitle>Edit product information</DialogTitle>
      <DialogContent>
        <Box sx={{ m: 1 }}>
          <FormGroup row sx={{ alignItems: "center", margin: "1rem 0" }}>
            <TextField
              id="outlined-title"
              name={"title"}
              label="Title"
              sx={{ flexGrow: "1" }}
              onChange={handleProductBodyChange}
              value={productBody.title}
            />
            <ImageList sx={{ width: 250, marginLeft: "1rem" }}>
              {imageState.map((item, index) => (
                <ImageListItem key={index}>
                  <img src={item} alt={`${productBody.title} ${index}`} loading="lazy" />
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    <IconButton color="primary" aria-label="view photo" component="label">
                      <Visibility />
                    </IconButton>
                    <IconButton color="primary" aria-label="view photo" component="label">
                      <Delete />
                    </IconButton>
                  </Stack>
                </ImageListItem>
              ))}
            </ImageList>
          </FormGroup>
          <FormGroup>
            <TextField
              id="outlined-description"
              label="Description"
              name={"description"}
              multiline
              onChange={handleProductBodyChange}
              value={productBody.description}
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
              name={"price"}
              label="Price"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              onChange={handleProductBodyChange}
              value={productBody.price}
            />
            <TextField
              id="outlined-stock"
              name={"stock"}
              label="Stock"
              onChange={handleProductBodyChange}
              value={productBody.stock}
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
                name="gender"
                value={productBody.gender}
                onChange={handleProductBodyChange}
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
                    <Checkbox checked={sizeState.L} onChange={handleSizeChange} name={"L"} />
                  }
                  label={"L"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.M} onChange={handleSizeChange} name={"M"} />
                  }
                  label={"M"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.S} onChange={handleSizeChange} name={"S"} />
                  }
                  label={"S"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.XL} onChange={handleSizeChange} name={"XL"} />
                  }
                  label={"XL"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.XS} onChange={handleSizeChange} name={"XS"} />
                  }
                  label={"XS"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.XXL} onChange={handleSizeChange} name={"XXL"} />
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
                    <Checkbox checked={tagState.hats} onChange={handleTagChange} name={"hats"} />
                  }
                  label={"Hats"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tagState.hoodies}
                      onChange={handleTagChange}
                      name={"hoodies"}
                    />
                  }
                  label={"Hoodie"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tagState.jackets}
                      onChange={handleTagChange}
                      name={"jackets"}
                    />
                  }
                  label={"Jacket"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tagState.shirts}
                      onChange={handleTagChange}
                      name={"shirts"}
                    />
                  }
                  label={"Shirt"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tagState.sweatshirts}
                      onChange={handleTagChange}
                      name={"sweatshirts"}
                    />
                  }
                  label={"Sweatshirt"}
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" disableElevation onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
