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
import { NestedImageModal } from "../NestedImageModal";
import sha1 from "sha1";
interface Props {
  openStatus: boolean;
  product: DetailedProduct | undefined;
}

export const EditProductDialog: FC<PropsWithChildren<Props>> = ({ openStatus, product }) => {
  const dispatch = useAppDispatch();
  const [productBody, setProductBody] = useState({
    title: "",
    price: 0,
    description: "",
    stock: 0,
    gender: "unisex",
  });

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

  const handleDeleteImage = (toDelete: string) => {
    const newImages = imageState.filter((image) => image !== toDelete);
    setImageState(newImages);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length > 1) return;
    const file = event.target.files[0];
    const timestamp = Date.now();
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_APISECRET || "default";
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_APIKEY || "default";
    const toSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = sha1(toSign);
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", apiKey);
    data.append("timestamp", `${timestamp}`);
    data.append("signature", signature);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const response = await res.json();
    setImageState((prevState) => [...prevState, response.secure_url]);
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
            <ImageList sx={{ width: 250, height: 160, marginLeft: "1rem" }}>
              {imageState.map((item, index) => (
                <Box key={index}>
                  <NestedImageModal imageLink={item} altText={`${productBody.title} ${index}`} />
                  <Button variant="text" onClick={() => handleDeleteImage(item)}>
                    Delete
                  </Button>
                </Box>
              ))}
              {imageState.length < 2 && (
                <Button variant="contained" component="label">
                  Upload
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                </Button>
              )}
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
