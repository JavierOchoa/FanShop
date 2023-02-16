import { Login } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { LoginForm } from "./";

export const LoginDialog = () => {
  const [openStatus, setOpenStatus] = useState<boolean>(false);
  const [formType] = useState<"login" | "signup">("login");
  const handleOpen = () => {
    setOpenStatus(true);
  };
  const handleClose = () => {
    setOpenStatus(false);
  };
  return (
    <Box>
      <Button variant={"contained"} endIcon={<Login />} onClick={handleOpen}>
        Login
      </Button>
      <Dialog open={openStatus} onClose={handleClose}>
        <DialogContent>
          <LoginForm formType={formType} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
