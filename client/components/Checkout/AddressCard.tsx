import { AddressBody } from "../../interfaces";
import { FC, PropsWithChildren, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import useCheckout from "../../utils/hooks/useCheckout";

interface Props {
  address: AddressBody;
  editFunction: (address: AddressBody) => void;
}

export const AddressCard: FC<PropsWithChildren<Props>> = ({ address, editFunction }) => {
  const { deleteAddress } = useCheckout();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const handleEdit = () => {
    editFunction(address);
  };
  const handleRemove = () => {
    deleteAddress(address.id!).catch((err) => setErrorMessage(err.message));
  };
  return (
    <Card>
      <CardContent sx={{ display: "flex" }}>
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
          <Button onClick={handleRemove}>REMOVE</Button>
        </Box>
      </CardContent>
    </Card>
  );
};
