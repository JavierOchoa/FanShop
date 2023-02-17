import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { FC } from "react";

interface Props {
  step: number;
  stepPages: string[];
}

export const CheckoutStepper: FC<Props> = ({ step, stepPages }) => {
  return (
    <Box padding={3} sx={{ width: "100%" }}>
      <Stepper activeStep={step}>
        {stepPages.map((label, index) => {
          return (
            <Step key={`${index}-${label}`}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
