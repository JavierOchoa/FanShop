import { Box } from "@mui/material";
import { ChangeEvent, useState } from "react";

interface AddressBody {
  name: string;
  telephone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface AddressBodyValidations {
  name?: string;
  telephone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const AddressForm = () => {
  const [body, setBody] = useState<AddressBody>({
    name: "",
    telephone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [errors, setErrors] = useState<AddressBodyValidations>({});
  const validate = (fieldToValidate: string, value?: string) => {
    let objErr: AddressBodyValidations = {};
    if (
      fieldToValidate === "name" ||
      fieldToValidate === "address" ||
      fieldToValidate === "city" ||
      fieldToValidate === "state" ||
      fieldToValidate === "country" ||
      fieldToValidate === "all"
    ) {
      objErr[fieldToValidate as keyof AddressBodyValidations] = "Please fill this field";
    } else {
      if (value && !/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(value)) {
        objErr[fieldToValidate as keyof AddressBodyValidations] = "Invalid characters";
      }
    }

    if (fieldToValidate === "number" || fieldToValidate === "all") {
      objErr[fieldToValidate as keyof AddressBodyValidations] = "Please fill this field";
    } else {
      if (value && !/^\d+$/g.test(value)) {
        objErr[fieldToValidate as keyof AddressBodyValidations] = "Invalid characters";
      }
    }
    return objErr;
  };

  const handleBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setErrors(validate(id, value));
    setBody({
      ...body,
      [id]: value,
    });
  };

  
  return <Box></Box>;
};
