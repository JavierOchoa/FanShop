import { Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CheckoutStepper, AddressForm } from "../../components";
import { NextPage } from "next";
import { AddressBody, CountryListResponse } from "../../interfaces";
import { CheckoutLayout } from "../../layouts";
import {
  useGetUserAddressesQuery,
  useGetOrderQuery,
  // useGetOrderStatusQuery,
} from "../../redux/services";
import { ArrowBack, Add } from "@mui/icons-material";
import { AddressCard, CompletedOrder, OrderResume } from "../../components/Checkout";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { LoadingButton } from "@mui/lab";
import useCheckout from "../../utils/hooks/useCheckout";

interface Props {
  countryList: CountryListResponse[];
}

const steps = ["Shipping Address", "Confirm Payment"];
const initialPolling = 600000;
const bodyInitialState: AddressBody = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
};
const CheckoutPage: NextPage<Props> = ({ countryList }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { payWithPaypal } = useCheckout();
  const [pollingInterval, setPollingInterval] = useState<number>(initialPolling);
  const { data: orderInformation, isLoading: loadingOrderInformation } = useGetOrderQuery(
    id ?? skipToken,
    { pollingInterval }
  );
  const { data: userAddresses, isLoading: loadingUserAddress } = useGetUserAddressesQuery();
  // const { data: orderStatus } = useGetOrderStatusQuery(id ?? skipToken, { pollingInterval });
  const [activeStep, setActiveStep] = useState<number>(0);
  const [addressToEdit, setAddressToEdit] = useState<AddressBody>(bodyInitialState);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressBody>(bodyInitialState);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleNext = () => setActiveStep((prevActiveSte) => prevActiveSte + 1);
  const handleBack = () => setActiveStep((prevActiveSte) => prevActiveSte - 1);
  const handleFormOpenStatus = () => {
    setOpenForm(!openForm);
  };
  const handleClearBody = () => {
    setAddressToEdit(bodyInitialState);
    setIsEdit(false);
  };

  const handleSelectAddress = (address: AddressBody) => {
    setSelectedAddress(address);
  };

  const handleFinishForm = () => {
    handleFormOpenStatus();
    handleClearBody();
  };

  const handleEditAddress = (address: AddressBody) => {
    setAddressToEdit(address);
    setIsEdit(true);
    handleFormOpenStatus();
  };

  const handlePay = async () => {
    setPollingInterval(5000);
    return await payWithPaypal(
      orderInformation!.data.id,
      orderInformation!.data.total,
      selectedAddress.id!
    );
  };

  useEffect(() => {
    if (userAddresses && userAddresses.data.length === 0) {
      setOpenForm(true);
    }
  }, [userAddresses]);

  if (orderInformation && orderInformation.successful === false) {
    router.push("/").catch((e) => console.log(e));
    return <Box>Redirecting...</Box>;
  }

  if (orderInformation && orderInformation.data.status === "completed") {
    if (pollingInterval !== initialPolling) {
      console.log(pollingInterval !== initialPolling);
      router.reload();
      return <Box>Loading Order Information...</Box>;
    }
  }

  return (
    <CheckoutLayout
      title={"Checkout Page"}
      pageDescription={"Page for reviewing cart, select shipping information and make payment"}
    >
      {orderInformation && orderInformation?.data.status === "completed" && (
        <CompletedOrder order={orderInformation.data} />
      )}
      {orderInformation?.data.status !== "completed" && (
        <Box>
          <CheckoutStepper step={activeStep} stepPages={steps} />
          <Box
            sx={{
              maxWidth: "1440px",
              padding: "0px 30px",
            }}
          >
            <Grid container spacing={2}>
              {activeStep === 0 && (
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
                  {(loadingUserAddress || loadingOrderInformation) && (
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
                            key={`${index}-${address.id}`}
                            address={address}
                            selectedAddress={selectedAddress.id || ""}
                            editFunction={handleEditAddress}
                            selectFunction={handleSelectAddress}
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
                      bodyInitialState={addressToEdit}
                    />
                  )}
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid item xs={12} md={8}>
                  {orderInformation && (
                    <OrderResume
                      orderData={orderInformation.data}
                      selectedAddress={selectedAddress}
                    />
                  )}
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography fontSize={"x-large"}>Pay Your Order</Typography>
                  <Typography fontSize={"large"}>Total: ${orderInformation?.data.total}</Typography>
                  {activeStep === steps.length - 1 && (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                      <LoadingButton
                        loading={
                          orderInformation?.data.status === "incomplete"
                            ? false
                            : pollingInterval !== initialPolling
                        }
                        loadingIndicator="Loading…"
                        sx={{ mt: 4 }}
                        variant={"contained"}
                        onClick={handlePay}
                      >
                        Pay with PAYPAL
                      </LoadingButton>
                      <Typography variant={"overline"}>DEMO ACCOUNT</Typography>
                      <Box>
                        <Typography
                          variant={"body2"}
                          sx={{ color: "#212121", fontSize: "0.8rem", fontWeight: "400" }}
                        >
                          test@fanshop.com - test12345
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                disabled={selectedAddress.id! === undefined || openForm}
                onClick={handleNext}
                sx={{ visibility: activeStep === steps.length - 1 ? "hidden" : "visible" }}
              >
                {activeStep === steps.length - 2 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </CheckoutLayout>
  );
};

CheckoutPage.getInitialProps = async () => {
  const res = await fetch("https://restcountries.com/v2/all?fields=name");
  const data: CountryListResponse[] = await res.json();
  return {
    countryList: data,
  };
};

export default CheckoutPage;
