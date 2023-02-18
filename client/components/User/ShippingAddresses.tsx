import { useGetUserAddressesQuery } from "../../redux/services";
import { Box, Button, CircularProgress } from "@mui/material";
import { AddressCard } from "../Checkout";
import { AddressBody, CountryListResponse } from "../../interfaces";
import { useEffect, useState } from "react";
import { AddressForm } from "../AddressForm";
import { Add, ArrowBack } from "@mui/icons-material";

const bodyInitialState: AddressBody = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
};
export const ShippingAddresses = () => {
  const { data: addresses, isLoading: loadingAddresses } = useGetUserAddressesQuery();
  const [addressToEdit, setAddressToEdit] = useState<AddressBody>(bodyInitialState);
  const [countryList, setCountryList] = useState<CountryListResponse[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://restcountries.com/v2/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        setCountryList(data);
        setIsLoading(false);
      });
  }, []);

  const handleFormOpenStatus = () => {
    setOpenForm(!openForm);
  };

  const handleEditAddress = (address: AddressBody) => {
    setAddressToEdit(address);
    setIsEdit(true);
    handleFormOpenStatus();
  };

  const handleClearBody = () => {
    setAddressToEdit(bodyInitialState);
    setIsEdit(false);
  };

  const handleFinishForm = () => {
    handleFormOpenStatus();
    handleClearBody();
  };

  if (loadingAddresses || isLoading) return <CircularProgress />;
  if (!addresses) return <></>;
  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Button
          startIcon={<ArrowBack />}
          sx={{
            visibility: openForm && addresses && addresses.data.length > 0 ? "visible" : "hidden",
          }}
          onClick={handleFinishForm}
        >
          Back
        </Button>
        <Button
          endIcon={<Add />}
          sx={{ visibility: openForm ? "hidden" : "visible" }}
          onClick={handleFormOpenStatus}
        >
          New Address
        </Button>
      </Box>
      {!openForm && (
        <Box>
          {addresses.data.map((address) => {
            return (
              <AddressCard key={address.id} address={address} editFunction={handleEditAddress} />
            );
          })}
        </Box>
      )}
      {openForm && (
        <AddressForm
          countryList={countryList}
          closeForm={handleFinishForm}
          bodyInitialState={addressToEdit}
          isEdit={isEdit}
        />
      )}
    </Box>
  );
};
