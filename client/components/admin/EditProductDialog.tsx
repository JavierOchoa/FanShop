import { FC, useState, PropsWithChildren, useEffect } from "react";
import { Box, Dialog, DialogContent, DialogTitle, FormGroup, TextField } from "@mui/material";
import { useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "./../../redux/slices/productSlice";

interface Props {
  openStatus: boolean;
}

export const EditProductDialog: FC<PropsWithChildren<Props>> = ({ openStatus }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(changeOpenEditDialogStatus());
  };
  return (
    <Dialog open={openStatus} onClose={handleClose} fullWidth={true} maxWidth={"xl"}>
      <DialogTitle>Edit product information</DialogTitle>
      <DialogContent>
        <Box sx={{ m: 1 }}>
          <FormGroup>
            <TextField
              id="outlined-helperText"
              label="Title"
              helperText="Amet sint ea consectetur in sit."
            />
          </FormGroup>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
