import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { CheckoutStepper } from "../../components";

const steps = ["Shipping Adress", "Confirm Payment"];

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;
  const [activeStep, setActiveStep] = useState<number>(0);
  const handleNext = () => setActiveStep((prevActiveSte) => prevActiveSte + 1);
  const handleBack = () => setActiveStep((prevActiveSte) => prevActiveSte - 1);

  return (
    <Box
      sx={{
        margin: "40px auto",
        maxWidth: "1440px",
        padding: "0px 30px",
      }}
    >
      <CheckoutStepper step={activeStep} stepPages={steps} />
      <Box
        sx={{
          margin: "40px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        <Typography>{id}</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
