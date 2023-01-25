import React, { useState, createRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import useAuth from "../../utils/hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InfoToValidate {
  email?: string | undefined;
  password?: string | undefined;
  message?: string;
}

export default function AdminLogin() {
  const inputEmail = createRef<HTMLInputElement>();
  const inputPassword = createRef<HTMLInputElement>();
  const { userLogin, loginRequestLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<InfoToValidate>({});
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validate = (toValidate: InfoToValidate) => {
    let objErr: InfoToValidate = {};

    if (!toValidate.email) {
      objErr["email"] = "No email";
    } else {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(toValidate.email)) {
        objErr["email"] = "Invalid email";
      }
    }

    if (!toValidate.password) {
      objErr["password"] = "No password";
    } else {
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(toValidate.password)) {
        objErr["password"] = "Invalid password";
      }
    }

    return objErr;
  };

  const handleClick = async () => {
    const email = inputEmail.current?.value;
    const password = inputPassword.current?.value;
    setError(validate({ email, password }));
    if (!error.email && !error.password) {
      const credentials = {
        email: inputEmail.current!.value,
        password: inputPassword.current!.value,
      };
      const data = await userLogin(credentials);
      if (!data.successful) {
        setError({
          ...error,
          message: data.message,
        });
      } else {
        const { p } = router.query;
        if (p) {
          router.push(`${p}`);
        } else {
          router.push("/");
        }
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 10 }}>
        <FormControl>
          <FormLabel sx={{ m: 2, alignSelf: "center" }}>Login</FormLabel>
          <TextField
            fullWidth
            id="email"
            label="Email"
            inputRef={inputEmail}
            error={error.email ? true : false}
            sx={{ mt: 1 }}
          />
          {/* <TextField
            fullWidth
            id="password"
            label="Password"
            inputRef={inputPassword}
            error={error.password ? true : false}
            sx={{ mt: 1 }}
          /> */}
          <FormControl variant="outlined">
            <InputLabel htmlFor="password" sx={{ pt: 1 }}>
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              inputRef={inputPassword}
              error={error.password ? true : false}
              sx={{ mt: 1 }}
            />
          </FormControl>
          <LoadingButton
            onClick={handleClick}
            type={"submit"}
            loading={loginRequestLoading}
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
