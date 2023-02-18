import { Box, Paper } from "@mui/material";
import { LoginForm } from "../../components";

export default function AdminLogin() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 10 }}>
        <LoginForm />
      </Paper>
    </Box>
  );
}
