import { UpdateAccount, UserInfo } from "../../interfaces";
import { useAppSelector } from "../../utils/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useUser from "../../utils/hooks/useUser";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type EditType = "fullName" | "email" | "password" | "all";
export const Account = () => {
  const userInfo: UserInfo = useAppSelector((state) => state.auth.user);
  const [nameField, setNameField] = useState<string>(userInfo?.fullName);
  const [editName, setEditName] = useState<boolean>(false);
  const [emailField, setEmailField] = useState<string>(userInfo?.email);
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [passwordField, setPasswordField] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [editPassword, setEditPassword] = useState<boolean>(false);
  const [startDeactivation, setStartDeactivation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { updateUser, deactivateUser } = useUser();

  useEffect(() => {
    setNameField(userInfo?.fullName);
    setEmailField(userInfo?.email);
  }, [userInfo]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleClear = () => {
    setNameField(userInfo?.fullName);
    setEmailField(userInfo?.email);
    setPasswordField("");
    setCurrentPassword("");
    setErrorMessage(undefined);
  };

  const handleEditFields = (type: EditType) => {
    if (type === "fullName") {
      handleClear();
      setEditEmail(false);
      setEditPassword(false);
      setStartDeactivation(false);
      setEditName(!editName);
    }
    if (type === "email") {
      handleClear();
      setEditName(false);
      setEditPassword(false);
      setStartDeactivation(false);
      setEditEmail(!editEmail);
    }
    if (type === "password") {
      handleClear();
      setEditName(false);
      setEditEmail(false);
      setStartDeactivation(false);
      setEditPassword(!editPassword);
    }
    if (type === "all") {
      handleClear();
      setEditName(false);
      setEditEmail(false);
      setEditPassword(false);
      setStartDeactivation(false);
    }
  };

  const handleStartDeactivation = () => {
    setEditName(false);
    setEditEmail(false);
    setEditPassword(false);
    setStartDeactivation(!startDeactivation);
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "fullName") {
      setNameField(value);
    }
    if (id === "email") {
      setEmailField(value);
    }
    if (id === "newPassword") {
      setPasswordField(value);
    }
    if (id === "currentPassword") {
      setCurrentPassword(value);
    }
  };

  const handleUpdate = async () => {
    const objToUpdate: UpdateAccount = { currentPassword: currentPassword };
    if (editName) {
      objToUpdate["fullName"] = nameField;
    }
    if (editEmail) {
      objToUpdate["email"] = emailField;
    }
    if (editPassword) {
      objToUpdate["newPassword"] = passwordField;
    }
    try {
      const data = await updateUser(objToUpdate);
      if (!data.successful) {
        return setErrorMessage(data.message);
      }
      handleEditFields("all");
      return;
    } catch (e) {
      return setErrorMessage((e as Error).message);
    }
  };

  const handleDeactivate = async () => {
    try {
      const data = await deactivateUser(currentPassword);
      if (!data.successful) {
        return setErrorMessage(data.message);
      }
      return;
    } catch (e) {
      return setErrorMessage((e as Error).message);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} alignItems={"center"} mb={4}>
        <Typography fontSize={"large"}>Full Name:</Typography>
        <Typography fontSize={"x-large"} sx={{ display: editName ? "none" : "block", mx: 1 }}>
          {userInfo?.fullName}
        </Typography>
        <TextField
          id={"fullName"}
          label={"Name"}
          value={nameField}
          size={"small"}
          onChange={handleFieldChange}
          sx={{ display: editName ? "block" : "none", mx: 1 }}
        />
        <Button onClick={() => handleEditFields("fullName")}>{editName ? "Cancel" : "Edit"}</Button>
      </Box>
      <Box display={"flex"} alignItems={"center"} mb={4}>
        <Typography fontSize={"large"}>Email:</Typography>
        <Typography fontSize={"x-large"} sx={{ display: editEmail ? "none" : "block", mx: 1 }}>
          {userInfo?.email}
        </Typography>
        <TextField
          id={"email"}
          label={"Email"}
          value={emailField}
          size={"small"}
          onChange={handleFieldChange}
          sx={{ display: editEmail ? "block" : "none", mx: 1 }}
        />

        <Button onClick={() => handleEditFields("email")}>{editEmail ? "Cancel" : "Edit"}</Button>
      </Box>
      <Box display={"flex"} alignItems={"center"} mb={4}>
        <Typography fontSize={"large"}>Password:</Typography>
        <FormControl variant="outlined" sx={{ mx: 2, display: editPassword ? "block" : "none" }}>
          <InputLabel htmlFor={"newPassword"} sx={{ pt: 1 }}>
            New Password
          </InputLabel>
          <OutlinedInput
            id={"newPassword"}
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
            label="New Password"
            value={passwordField}
            onChange={handleFieldChange}
            sx={{ mt: 1 }}
          />
        </FormControl>

        <Button onClick={() => handleEditFields("password")}>
          {editPassword ? "Cancel" : "Edit"}
        </Button>
      </Box>
      <Box
        display={editName || editEmail || editPassword ? "flex" : "none"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box my={2} display={"flex"} alignItems={"center"}>
          <FormControl variant="outlined">
            <InputLabel htmlFor={"currentPassword"} sx={{ pt: 1 }}>
              Current Password
            </InputLabel>
            <OutlinedInput
              id={"currentPassword"}
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
              label="Current Password"
              value={currentPassword}
              onChange={handleFieldChange}
              sx={{ mt: 1 }}
            />
          </FormControl>
          <Button
            variant={"contained"}
            sx={{ mx: 2 }}
            disabled={currentPassword === ""}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
        {errorMessage && (
          <Alert variant="filled" severity="error">
            {errorMessage}
          </Alert>
        )}
      </Box>
      <Box display={"flex"} justifyContent={"center"} my={5}>
        {!startDeactivation && (
          <Button color={"error"} variant={"contained"} onClick={handleStartDeactivation}>
            Deactivate Account
          </Button>
        )}
        {startDeactivation && (
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"} my={2}>
            <Typography variant={"overline"} color={"error"}>
              ARE YOU SURE? THIS IS IRREVERSIBLE
            </Typography>
            <FormControl variant="outlined">
              <InputLabel htmlFor={"currentPassword"} sx={{ pt: 1 }}>
                Current Password
              </InputLabel>
              <OutlinedInput
                id={"currentPassword"}
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
                label="Current Password"
                value={currentPassword}
                onChange={handleFieldChange}
                sx={{ mt: 1 }}
              />
            </FormControl>
            {errorMessage && (
              <Alert variant="filled" severity="error" sx={{ my: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <Stack spacing={2} direction={"row"} sx={{ my: 3 }}>
              <Button variant={"contained"} onClick={handleStartDeactivation}>
                Cancel
              </Button>
              <Button color={"error"} onClick={handleDeactivate}>
                Deactivate
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};
