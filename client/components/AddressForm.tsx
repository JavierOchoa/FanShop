import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, PropsWithChildren, useState } from "react";
import { CountryListResponse, AddressBody, AddressBodyValidations } from "../interfaces";
import useCheckout from "../utils/hooks/useCheckout";

interface Props {
  countryList: CountryListResponse[];
  closeForm: () => void;
  bodyInitialState: AddressBody;
  isEdit: boolean;
}

export const AddressForm: FC<PropsWithChildren<Props>> = ({
  countryList,
  closeForm,
  bodyInitialState,
  isEdit,
}) => {
  const { newAddress, loadingNewAddress, updateAddress, loadingEditAddress } = useCheckout();
  const [disabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
  const [body, setBody] = useState<AddressBody>(bodyInitialState);
  const [errors, setErrors] = useState<AddressBodyValidations>({});
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const validate = (fieldToValidate: string, value?: string) => {
    let objErr: AddressBodyValidations = {};
    if (
      fieldToValidate === "fullName" ||
      fieldToValidate === "address" ||
      fieldToValidate === "city" ||
      fieldToValidate === "state" ||
      fieldToValidate === "all"
    ) {
      if (!value) {
        objErr[fieldToValidate as keyof AddressBodyValidations] = "Please fill this field";
      } else {
        if (!/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(value)) {
          objErr[fieldToValidate as keyof AddressBodyValidations] = "Invalid characters";
        }
      }
    }

    if (fieldToValidate === "phone" || fieldToValidate === "all") {
      if (!value) {
        objErr[fieldToValidate as keyof AddressBodyValidations] = "Please fill this field";
      } else {
        if (value && !/^\d+$/g.test(value)) {
          objErr[fieldToValidate as keyof AddressBodyValidations] = "Invalid characters";
        }
      }
    }
    return objErr;
  };

  const handleBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setDisabledSaveButton(false);
    setErrors(validate(id, value));
    setBody({
      ...body,
      [id]: value,
    });
  };

  const handleCountryChange = (event: SelectChangeEvent) => {
    setBody({
      ...body,
      ["country"]: event.target.value,
    });
  };

  const handleSave = async () => {
    setErrors(validate("all"));
    if (Object.keys(errors).length === 0) {
      if (isEdit) {
        updateAddress(body).then((response) => {
          if (response) {
            if (response.successful) {
              setBody(bodyInitialState);
              setErrorMessage(undefined);
              closeForm();
              return;
            } else {
              setErrorMessage(response.message);
            }
          }
        });
      } else {
        newAddress(body).then((response) => {
          if (response) {
            if (response.successful) {
              setBody(bodyInitialState);
              setErrorMessage(undefined);
              closeForm();
              return;
            } else {
              setErrorMessage(response.message);
            }
          }
        });
      }
    }
  };

  if (loadingNewAddress || loadingEditAddress) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormControl sx={{ width: "100%" }}>
      <TextField
        fullWidth
        required
        id={"fullName"}
        label={errors.fullName ? errors.fullName : "Name"}
        onChange={handleBodyChange}
        error={!!errors.fullName}
        value={body.fullName}
        size={"small"}
        margin={"dense"}
      />
      <TextField
        fullWidth
        required
        id={"address"}
        label={errors.address ? errors.address : "Address"}
        onChange={handleBodyChange}
        error={!!errors.address}
        value={body.address}
        size={"small"}
        margin={"dense"}
      />
      <TextField
        fullWidth
        required
        id={"phone"}
        label={errors.phone ? errors.phone : "Phone"}
        onChange={handleBodyChange}
        error={!!errors.phone}
        value={body.phone}
        size={"small"}
        margin={"dense"}
      />
      <Box display={"flex"} justifyContent={"space-between"}>
        <TextField
          required
          id={"city"}
          label={errors.city ? errors.city : "City"}
          onChange={handleBodyChange}
          error={!!errors.city}
          value={body.city}
          size={"small"}
          margin={"dense"}
          sx={{ width: "49%" }}
        />
        <TextField
          required
          id={"state"}
          label={errors.state ? errors.state : "State"}
          onChange={handleBodyChange}
          error={!!errors.state}
          value={body.state}
          size={"small"}
          margin={"dense"}
          sx={{ width: "49%" }}
        />
      </Box>
      <FormControl fullWidth margin={"dense"}>
        <InputLabel id="countryLabel">Country</InputLabel>
        <Select
          labelId="countryLabel"
          id="countrySelect"
          value={body.country}
          label="Country"
          onChange={handleCountryChange}
        >
          {countryList.map((country, index) => {
            return (
              <MenuItem key={`${index}${country.name}`} value={country.name}>
                {country.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {errorMessage && (
        <Alert variant="filled" severity="error">
          {errorMessage}
        </Alert>
      )}
      {isEdit ? (
        <Button
          disabled={disabledSaveButton || Object.keys(errors).length !== 0}
          sx={{ my: 2 }}
          variant={"contained"}
          onClick={handleSave}
        >
          Update
        </Button>
      ) : (
        <Button
          disabled={disabledSaveButton || Object.keys(errors).length !== 0}
          sx={{ my: 2 }}
          variant={"contained"}
          onClick={handleSave}
        >
          Create
        </Button>
      )}
    </FormControl>
  );
};
