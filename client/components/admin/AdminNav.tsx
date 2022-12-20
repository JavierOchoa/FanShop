import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { FC } from "react";

export const AdminNav: FC = () => {
  return (
    <Box>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Typography variant="h6" sx={{ marginRight: "2rem" }}>
            Logged in as `ADMINUSER`
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
