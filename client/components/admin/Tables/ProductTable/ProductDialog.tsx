import {
  Alert,
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
  ImageList,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from "react";
import sha1 from "sha1";
import {
  APIResponse,
  DetailedProduct,
  ModalType,
  ProductBody,
  ProductErrorState,
  SizeState,
  TagState,
} from "../../../../interfaces";
import { useGetProductQuery } from "../../../../redux/services";
import { changeDialogType, changeOpenEditDialogStatus } from "../../../../redux/slices";
import { useAppDispatch } from "../../../../utils/hooks";
import useAdmin from "../../../../utils/hooks/useAdmin";
import { NestedImageModal } from "../NestedImageModal";
import { ConfirmDeleteDialog } from "../../ConfirmDeleteDialog";

interface Props {
  openStatus: boolean;
  productId: string | undefined;
  dialogType: ModalType;
}

interface ImageState {
  id: number;
  url: string;
}

const emptyProductBody = {
  id: undefined,
  title: "",
  price: "0",
  description: "",
  stock: "0",
  gender: "unisex",
};

const emptySizeState = {
  XS: false,
  S: false,
  M: false,
  L: false,
  XL: false,
  XXL: false,
};

const emptyTagState = {
  shirt: false,
  pant: false,
  hoodie: false,
  jacket: false,
  hat: false,
  sweatshirt: false,
};

const emptyError = {
  title: { status: false, message: "" },
  price: { status: false, message: "" },
  description: { status: false, message: "" },
  stock: { status: false, message: "" },
  gender: { status: false, message: "" },
};

export const ProductDialog: FC<PropsWithChildren<Props>> = ({
  openStatus,
  productId,
  dialogType,
}) => {
  const dispatch = useAppDispatch();
  const { data: productData, isLoading } = useGetProductQuery(productId ?? skipToken);
  const { handleProductSave } = useAdmin();
  const [productBody, setProductBody] = useState<ProductBody>(emptyProductBody);
  const [sizeState, setSizeState] = useState<SizeState>(emptySizeState);
  const [tagState, setTagState] = useState<TagState>(emptyTagState);
  const [imageState, setImageState] = useState<ImageState[]>([]);
  const [disabledSaveStatus, setDisabledSaveStatus] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<ProductErrorState>(emptyError);

  useEffect(() => {
    if (productData?.id) {
      setErrorMessage(undefined);
      fillData(productData);
    }
    setDisabledSaveStatus(true);
  }, [productData]);

  useEffect(() => {
    if (dialogType === "edit" && productData?.id) {
      fillData(productData);
    }
    if (dialogType === "new") {
      emptyData();
    }
  }, [dialogType, productData]);

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
            message: "This field is required. Can't contain special characters",
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
  const fillData = (productData: DetailedProduct) => {
    setProductBody({
      id: productData.id,
      title: productData.title,
      price: String(productData.price),
      description: productData.description,
      stock: String(productData.stock),
      gender: productData.gender,
    });
    setImageState([]);
    productData.images.forEach((image, index) => {
      setImageState((prevState) => [...prevState, { id: index, url: image.url }]);
    });

    setSizeState({
      XS: productData.sizes.includes("XS"),
      S: productData.sizes.includes("S"),
      M: productData.sizes.includes("M"),
      L: productData.sizes.includes("L"),
      XL: productData.sizes.includes("XL"),
      XXL: productData.sizes.includes("XXL"),
    });
    setTagState({
      shirt: productData.tags.includes("shirt"),
      pant: productData.tags.includes("pant"),
      hoodie: productData.tags.includes("hoodie"),
      jacket: productData.tags.includes("jacket"),
      hat: productData.tags.includes("hat"),
      sweatshirt: productData.tags.includes("sweatshirt"),
    });
  };
  const emptyData = () => {
    setProductBody(emptyProductBody);
    setImageState([]);
    setTagState(emptyTagState);
    setSizeState(emptySizeState);
  };
  const handleClose = () => {
    emptyData();
    dispatch(changeDialogType(undefined));
    dispatch(changeOpenEditDialogStatus());
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
      // setImageState((prevState) => [
      //   ...prevState,
      //   { id: currentId[0] === 0 ? 1 : 0, url: response.secure_url },
      // ]);
      const productBodyCopy = productBody;
      const imageStateCopy = imageState;
      setProductBody(emptyProductBody);
      setImageState([]);
      setProductBody(productBodyCopy);
      setImageState(() => [
        ...imageStateCopy,
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
    console.log(finalObj);
    try {
      const saveResponse: APIResponse | undefined = await handleProductSave(finalObj, dialogType);
      if (saveResponse?.successful === false) {
        setErrorMessage(saveResponse?.message);
        const numberOfErrors = checkValidations();
        if (numberOfErrors > 0) {
          setDisabledSaveStatus(true);
          return;
        }
        return;
      }
      handleClose();
      return saveResponse;
    } catch (err) {
      setErrorMessage((err as Error).message);
      return;
    }
  };
  return (
    <Dialog open={openStatus} onClose={handleClose} fullWidth={true} maxWidth={"xl"}>
      <DialogTitle>Product Information</DialogTitle>
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
              {isLoading ? (
                <CircularProgress />
              ) : (
                imageState.map((item, index) => (
                  <Box key={index + Math.random()}>
                    <NestedImageModal
                      imageLink={item.url}
                      altText={`${productBody.title} - ${item.id}`}
                    />
                    <Button variant="text" onClick={() => handleDeleteImage(item.url)}>
                      Delete
                    </Button>
                  </Box>
                ))
              )}

              {imageState.length < 2 && (
                <Button variant="contained" component="label">
                  Upload
                  <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
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
            {productData?.id && (
              <Typography variant="overline" display="block" gutterBottom>
                Created by: {productData?.user?.fullName}
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
                    <Checkbox checked={sizeState.XS} onChange={handleSizeChange} name={"XS"} />
                  }
                  label={"XS"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.S} onChange={handleSizeChange} name={"S"} />
                  }
                  label={"S"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.M} onChange={handleSizeChange} name={"M"} />
                  }
                  label={"M"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.L} onChange={handleSizeChange} name={"L"} />
                  }
                  label={"L"}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={sizeState.XL} onChange={handleSizeChange} name={"XL"} />
                  }
                  label={"XL"}
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
                    <Checkbox checked={tagState.hat} onChange={handleTagChange} name={"hat"} />
                  }
                  label={"Hats"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tagState.hoodie}
                      onChange={handleTagChange}
                      name={"hoodie"}
                    />
                  }
                  label={"Hoodie"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tagState.jacket}
                      onChange={handleTagChange}
                      name={"jacket"}
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
                      checked={tagState.sweatshirt}
                      onChange={handleTagChange}
                      name={"sweatshirt"}
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
              <ConfirmDeleteDialog
                variant="button"
                elements={[productData?.id!]}
                elementType={"product"}
              />
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
