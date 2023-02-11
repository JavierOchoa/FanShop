import { Box, Button, CircularProgress, Grid } from "@mui/material";
// import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { CheckoutStepper, AddressForm } from "../../components";
import { GetServerSideProps } from "next";
import { AddressBody, CountryListResponse } from "../../interfaces";
import { CheckoutLayout } from "../../layouts";
import { useGetUserAddressesQuery } from "../../redux/services";
import { ArrowBack, Add } from "@mui/icons-material";
import { AddressCard } from "../../components/Checkout";

interface Props {
  countryList: CountryListResponse[];
}

const steps = ["Shipping Address", "Confirm Payment"];
const bodyInitialState: AddressBody = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
};
const CheckoutPage: FC<PropsWithChildren<Props>> = ({ countryList }) => {
  // const router = useRouter();
  // const { id } = router.query;
  const { data: userAddresses, isLoading: loadingUserAddress } = useGetUserAddressesQuery();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [countryToEdit, setCountryToEdit] = useState<AddressBody>(bodyInitialState);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleNext = () => setActiveStep((prevActiveSte) => prevActiveSte + 1);
  const handleBack = () => setActiveStep((prevActiveSte) => prevActiveSte - 1);
  const handleFormOpenStatus = () => {
    setOpenForm(!openForm);
  };
  const handleClearBody = () => {
    setCountryToEdit(bodyInitialState);
    setIsEdit(false);
  };

  const handleFinishForm = () => {
    handleFormOpenStatus();
    handleClearBody();
  };

  const handleEditCountry = (address: AddressBody) => {
    setCountryToEdit(address);
    setIsEdit(true);
    handleFormOpenStatus();
  };
  useEffect(() => {
    if (userAddresses && userAddresses.data.length === 0) {
      setOpenForm(true);
    }
  }, [userAddresses]);

  return (
    <CheckoutLayout
      title={"Checkout Page"}
      pageDescription={"Page for reviewing cart, select shipping information and make payment"}
    >
      <CheckoutStepper step={activeStep} stepPages={steps} />
      <Box
        sx={{
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                startIcon={<ArrowBack />}
                sx={{
                  visibility:
                    openForm && userAddresses && userAddresses.data.length > 0
                      ? "visible"
                      : "hidden",
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
            {loadingUserAddress && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {!openForm && (
              <Box>
                {userAddresses?.data.map((address, index) => {
                  return (
                    <AddressCard
                      key={`${index}-${address.address}`}
                      address={address}
                      editFunction={handleEditCountry}
                    />
                  );
                })}
              </Box>
            )}
            {openForm && (
              <AddressForm
                isEdit={isEdit}
                countryList={countryList}
                closeForm={handleFinishForm}
                bodyInitialState={countryToEdit}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            test
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button disabled onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
    </CheckoutLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://restcountries.com/v2/all?fields=name");
  const data: CountryListResponse[] = await res.json();

  return {
    props: {
      countryList: data,
    },
  };
};

export default CheckoutPage;
