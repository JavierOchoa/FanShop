import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Alert,
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
  ImageList,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DetailedProduct, ModalType, ProductPostResponse } from "../../interfaces";
import { useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "./../../redux/slices/productSlice";
import { NestedImageModal } from "../NestedImageModal";
import sha1 from "sha1";
import useAdmin from "../../utils/hooks/useAdmin";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface Props {
  openStatus: boolean;
  product: DetailedProduct | undefined;
  dialogType: ModalType;
}

interface ProductBody {
  id?: string;
  title: string;
  price: string;
  description: string;
  stock: string;
  gender: string;
}

interface SizeState {
  XS: boolean;
  S: boolean;
  M: boolean;
  L: boolean;
  XL: boolean;
  XXL: boolean;
}

interface TagState {
  shirt: boolean;
  pants: boolean;
  hoodies: boolean;
  jackets: boolean;
  hats: boolean;
  sweatshirts: boolean;
}

interface errorState {
  title: errorStatus;
  price: errorStatus;
  description: errorStatus;
  stock: errorStatus;
  gender: errorStatus;
}

interface errorStatus {
  status: boolean;
  message: string;
}

export const EditProductDialog: FC<PropsWithChildren<Props>> = ({
  openStatus,
  product,
  dialogType,
}) => {
  const dispatch = useAppDispatch();
  const { handleProductSave } = useAdmin();
  const [disabledSaveStatus, setDisabledSaveStatus] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<errorState>({
    title: { status: false, message: "" },
    price: { status: false, message: "" },
    description: { status: false, message: "" },
    stock: { status: false, message: "" },
    gender: { status: false, message: "" },
  });
  const [productBody, setProductBody] = useState<ProductBody>({
    id: undefined,
    title: "",
    price: "0",
    description: "",
    stock: "0",
    gender: "unisex",
  });

  const [sizeState, setSizeState] = useState<SizeState>({
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
    XXL: false,
  });
  const [tagState, setTagState] = useState<TagState>({
    shirt: false,
    pants: false,
    hoodies: false,
    jackets: false,
    hats: false,
    sweatshirts: false,
  });

  const [imageState, setImageState] = useState<{ id: number; url: string }[]>([]);

  useEffect(() => {
    if (product) {
      setErrorMessage(undefined);
      setProductBody({
        id: product.id,
        title: product.title,
        price: String(product.price),
        description: product.description,
        stock: String(product.stock),
        gender: product.gender,
      });
      product.images.forEach((image, index) => {
        setImageState((prevState) => [...prevState, { id: index, url: image.url }]);
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
    setDisabledSaveStatus(true);
  }, [product]);

  const validate = (
    fieldToValidate: "title" | "price" | "description" | "stock" | "gender",
    value: string
  ) => {
    if (fieldToValidate === "title") {
      if (!/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(value) || !/[\S\s]+[\S]*$/g.test(value)) {
        setError({
          ...error,
          [fieldToValidate]: {
            status: true,
            message: "This field is requiered. Can't contain special characters",
          },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
    if (fieldToValidate === "description") {
      if (!/[\S\s]+[\S]*$/g.test(value)) {
        setError({
          ...error,
          [fieldToValidate]: { status: true, message: "This field is requiered." },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
    if (fieldToValidate === "stock" || fieldToValidate === "price") {
      if (!/^[0-9]*$/g.test(value)) {
        setError({
          ...error,
          [fieldToValidate]: { status: true, message: "This field must be a number." },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
    if (fieldToValidate === "gender") {
      if (!["kid", "men", "women", "unisex"].includes(value)) {
        setError({
          ...error,
          [fieldToValidate]: { status: true, message: "Gender must be kid, men, women or unisex" },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
  };
  const handleClose = () => {
    dispatch(changeOpenEditDialogStatus());
    setProductBody({
      title: "",
      price: "0",
      description: "",
      stock: "0",
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
      shirt: false,
      pants: false,
      hoodies: false,
      jackets: false,
      hats: false,
      sweatshirts: false,
    });
    setImageState([]);
    setError({
      title: { status: false, message: "" },
      price: { status: false, message: "" },
      description: { status: false, message: "" },
      stock: { status: false, message: "" },
      gender: { status: false, message: "" },
    });
  };
  const checkValidations = () => {
    return Object.keys(error).filter((err) => error[err as keyof typeof error]).length;
  };
  const handleProductBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    validate(
      event.target.name as "title" | "price" | "description" | "stock" | "gender",
      event.target.value
    );
    setProductBody({
      ...productBody,
      [event.target.name]: event.target.value,
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
    const newImages = imageState.filter((image) => image.url !== toDelete);
    setImageState(newImages);
    setDisabledSaveStatus(false);
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
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const response = await res.json();
      const currentId = imageState.map((image) => image.id);
      setImageState((prevState) => [
        ...prevState,
        { id: currentId[0] === 0 ? 1 : 0, url: response.secure_url },
      ]);
      setDisabledSaveStatus(false);
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleSave = async () => {
    setErrorMessage(undefined);
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
    try {
      const saveResponse: ProductPostResponse | undefined = await handleProductSave(
        finalObj,
        dialogType
      );
      if (saveResponse?.successful === false) {
        setErrorMessage(saveResponse?.message);
        const numberOfErrors = checkValidations();
        if (numberOfErrors > 0) {
          setDisabledSaveStatus(true);
          return;
        }
        return;
      }
      dispatch(changeOpenEditDialogStatus());
      return saveResponse;
    } catch (err) {
      setErrorMessage((err as Error).message);
      return;
    }
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
              error={error.title.status}
              onChange={handleProductBodyChange}
              value={productBody.title}
              helperText={error.title.status ? error.title.message : ""}
            />
            <ImageList sx={{ width: 250, height: 160, marginLeft: "1rem" }}>
              {imageState.map((item, index) => (
                <Box key={index}>
                  <NestedImageModal
                    imageLink={item.url}
                    altText={`${productBody.title} ${index}`}
                  />
                  <Button variant="text" onClick={() => handleDeleteImage(item.url)}>
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
              error={error.description.status}
              onChange={handleProductBodyChange}
              value={productBody.description}
              helperText={error.description.status ? error.description.message : ""}
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
              error={error.price.status}
              onChange={handleProductBodyChange}
              value={productBody.price}
              helperText={error.price.status ? error.price.message : ""}
            />
            <TextField
              id="outlined-stock"
              name={"stock"}
              label="Stock"
              onChange={handleProductBodyChange}
              value={productBody.stock}
              error={error.stock.status}
              helperText={error.stock.status ? error.stock.message : ""}
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
                    <Checkbox checked={tagState.shirt} onChange={handleTagChange} name={"shirt"} />
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
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ m: 2 }}
          >
            {dialogType === "edit" && (
              <ConfirmDeleteDialog variant="button" productsToDelete={[product!.id!]} />
            )}
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              disabled={disabledSaveStatus}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
          {errorMessage && (
            <Alert variant="filled" severity="error">
              {errorMessage}
            </Alert>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
