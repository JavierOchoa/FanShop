import { AddressBody } from "../../interfaces";
import { FC, PropsWithChildren, useState } from "react";
import { Box, Button, Card, CardContent, Radio, Typography } from "@mui/material";
import useCheckout from "../../utils/hooks/useCheckout";

interface Props {
  address: AddressBody;
  editFunction: (address: AddressBody) => void;
  selectFunction?: (address: AddressBody) => void;
  selectedAddress?: string;
}

export const AddressCard: FC<PropsWithChildren<Props>> = ({
  address,
  editFunction,
  selectFunction,
  selectedAddress,
}) => {
  const { deleteAddress } = useCheckout();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const handleEdit = () => {
    editFunction(address);
  };
  const handleRemove = () => {
    deleteAddress(address.id!).catch((err) => setErrorMessage(err.message));
  };

  const handleChange = () => {
    if (selectFunction) {
      selectFunction(address);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: "flex" }}>
        {selectFunction && (
          <Radio
            disableRipple
            checked={selectedAddress === address.id}
            onChange={handleChange}
            value="a"
            name="radio-buttons"
            inputProps={{ "aria-label": "A" }}
          />
        )}
        <Box alignSelf={"center"}>
          <Box mx={2}>
            <Typography>{address.fullName}</Typography>
            {errorMessage && <Typography>{errorMessage}</Typography>}
            <Typography variant={"body2"}>{address.address}</Typography>
            <Typography variant={"body2"}>{address.phone}</Typography>
            <Typography variant={"body2"}>
              {address.city} - {address.state}
            </Typography>
            <Typography variant={"body2"}>{address.country}</Typography>
          </Box>
          <Button sx={{ mx: 1 }} onClick={handleEdit}>
            EDIT
          </Button>
          {selectFunction && <Button onClick={handleRemove}>REMOVE</Button>}
        </Box>
      </CardContent>
    </Card>
  );
};
