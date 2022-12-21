import React, { InputHTMLAttributes, FormEvent, useState, createRef } from "react";
import { Box, FormControl, FormLabel, Paper, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputEmail = createRef<HTMLInputElement>();
  const inputPassword = createRef<HTMLInputElement>();

  const handleClick = () => {
    console.log(inputEmail.current?.value);
    setLoading(!loading);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 10 }}>
        <FormControl>
          <FormLabel sx={{ m: 2, alignSelf: "center" }}>Login</FormLabel>
          <TextField fullWidth id="email" label="Email" inputRef={inputEmail} sx={{ mt: 1 }} />
          <TextField
            fullWidth
            id="password"
            label="Password"
            inputRef={inputPassword}
            sx={{ mt: 1 }}
          />
          <LoadingButton
            onClick={handleClick}
            type={"submit"}
            loading={loading}
            loadingIndicator="Loading..."
            variant="contained"
            sx={{ mt: 5 }}
          >
            Login
          </LoadingButton>
        </FormControl>
      </Paper>
    </Box>
  );
}
