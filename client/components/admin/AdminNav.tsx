import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { FC } from "react";
import { useAppSelector } from "../../utils/hooks";
import useAuth from "../../utils/hooks/useAuth";

export const AdminNav: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { userLogout } = useAuth();
  return (
    <Box>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Typography variant="h6" sx={{ marginRight: "2rem" }}>
            Logged in as {user?.fullName}
          </Typography>
          <Button color="inherit" onClick={userLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
