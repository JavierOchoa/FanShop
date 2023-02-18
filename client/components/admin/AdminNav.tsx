import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { FC } from "react";
import { useAppSelector } from "../../utils/hooks";
import useAuth from "../../utils/hooks/useAuth";

export const AdminNav: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { userLogout } = useAuth();
  const handleLogout = () => {
    userLogout(true);
  };
  return (
    <Box>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }} color={"primary"}>
            Admin Panel
          </Typography>
          <Typography variant="h6" sx={{ marginRight: "2rem" }} color={"primary"}>
            Logged in as {user?.fullName}
          </Typography>
          <Button onClick={handleLogout} variant={"contained"}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
