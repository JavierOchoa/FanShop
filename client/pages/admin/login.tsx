import { Box, Paper, Typography } from "@mui/material";
import { LoginForm } from "../../components";

export default function AdminLogin() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 10 }}>
        <LoginForm admin={true} />
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} mt={2}>
          <Typography variant={"overline"}>DEMO ACCOUNT</Typography>
          <Typography
            variant={"body2"}
            sx={{ color: "#212121", fontSize: "0.8rem", fontWeight: "400" }}
          >
            {process.env.NEXT_PUBLIC_ADMIN_DEMO_EMAIL} - {process.env.NEXT_PUBLIC_ADMIN_DEMO_PASS}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
