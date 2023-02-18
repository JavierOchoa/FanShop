import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { createRef, FC, FormEvent, PropsWithChildren, useEffect, useState } from "react";
import useAuth from "../../utils/hooks/useAuth";

interface InfoToValidate {
  email?: string | undefined;
  name?: string | undefined;
  password?: string | undefined;
  message?: string;
}

interface Props {
  formType?: authForm;
  admin?: true;
}

type authForm = "login" | "signup";

export const LoginForm: FC<PropsWithChildren<Props>> = ({ formType = "login", admin = false }) => {
  const inputName = createRef<HTMLInputElement>();
  const inputEmail = createRef<HTMLInputElement>();
  const inputPassword = createRef<HTMLInputElement>();
  const inputConfirmPassword = createRef<HTMLInputElement>();

  const {
    userLogin,
    loginRequestLoading,
    userSignUp,
    signUpRequestLoading,
    loginResponse,
    signupResponse,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState<authForm>(formType);
  const [error, setError] = useState<InfoToValidate>({});
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loginResponse && loginResponse.successful === false) setErrorMessage(loginResponse.message);
    if (signupResponse && signupResponse.successful === false)
      setErrorMessage(signupResponse.message);
  }, [loginResponse, signupResponse]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleType = () => (type === "login" ? setType("signup") : setType("login"));

  const validate = (toValidate: InfoToValidate) => {
    let objErr: InfoToValidate = {};

    if (!toValidate.email) {
      objErr["email"] = "No email";
    } else {
      if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g.test(toValidate.email)) {
        objErr["email"] = "Invalid email";
      }
    }

    if (!toValidate.name) {
      objErr["name"] = "No name";
    } else {
      if (!/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(toValidate.name)) {
        objErr["name"] = "Invalid characters";
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

  const handleClick = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const name = inputName.current?.value;
    const email = inputEmail.current?.value;
    const password = inputPassword.current?.value;
    const confirmPassword = inputConfirmPassword.current?.value;
    if (type === "signup" && confirmPassword !== password)
      return setErrorMessage("Passwords are different");
    setError(validate({ name, email, password }));
    if (!error.email && !error.password && !error.name) {
      if (type === "login") {
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
            await router.push(`${p}`);
          } else {
            router.reload();
          }
        }
      }

      if (type === "signup") {
        const credentials = {
          fullName: inputName.current!.value,
          email: inputEmail.current!.value,
          password: inputPassword.current!.value,
        };
        const data = await userSignUp(credentials);
        if (!data.successful) {
          setError({
            ...error,
            message: data.message,
          });
        } else {
          const { p } = router.query;
          if (p) {
            await router.push(`${p}`);
          } else {
            router.reload();
          }
        }
      }
    }
  };
  return (
    <form onSubmit={handleClick}>
      <FormControl>
        <FormLabel sx={{ m: 2, alignSelf: "center" }}>
          {type === "login" ? "Login" : "Sign Up"}
        </FormLabel>
        {type === "signup" && (
          <TextField
            fullWidth
            id="name"
            label="Name"
            inputRef={inputName}
            error={!!error.name}
            sx={{ my: 1 }}
          />
        )}
        <TextField
          fullWidth
          id="email"
          label="Email"
          inputRef={inputEmail}
          error={!!error.email}
          sx={{ my: 1 }}
        />
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
            error={!!error.password}
            sx={{ mt: 1 }}
          />
        </FormControl>
        {type === "signup" && (
          <FormControl variant="outlined">
            <InputLabel htmlFor="confirm-password" sx={{ pt: 1 }}>
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              inputRef={inputConfirmPassword}
              sx={{ mt: 1 }}
            />
          </FormControl>
        )}
        {!admin && (
          <Button sx={{ my: 2 }} onClick={handleType}>
            {type === "login" ? "Create account" : "Already have an account?"}
          </Button>
        )}
        <LoadingButton
          type={"submit"}
          loading={loginRequestLoading || signUpRequestLoading}
          loadingIndicator="Loading..."
          variant="contained"
          sx={{ mt: 2 }}
        >
          {type === "login" ? "Login" : "Sign up"}
        </LoadingButton>
        {errorMessage && (
          <Alert severity={"error"} variant={"filled"} sx={{ my: 1 }}>
            {errorMessage}
          </Alert>
        )}
      </FormControl>
    </form>
  );
};
