import { UpdateAccount, UserInfo } from "../../interfaces";
import { useAppSelector } from "../../utils/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useUpdateUserMutation } from "../../redux/services";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";

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
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    setNameField(userInfo?.fullName);
    setEmailField(userInfo?.email);
  }, [userInfo]);

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
      setEditName(!editName);
    }
    if (type === "email") {
      handleClear();
      setEditName(false);
      setEditPassword(false);
      setEditEmail(!editEmail);
    }
    if (type === "password") {
      handleClear();
      setEditName(false);
      setEditEmail(false);
      setEditPassword(!editPassword);
    }
    if (type === "all") {
      handleClear();
      setEditName(false);
      setEditEmail(false);
      setEditPassword(false);
    }
  };

  const handleStartDeactivation = () => {
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
    const data = await updateUser(objToUpdate).unwrap();
    if (!data.successful) {
      setErrorMessage(data.message);
    }
    handleEditFields("all");
    return;
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
          id={"Email"}
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
        <TextField
          id={"newPassword"}
          label={"New Password"}
          value={passwordField}
          size={"small"}
          onChange={handleFieldChange}
          sx={{ display: editPassword ? "block" : "none", mx: 1 }}
        />

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
        <Box my={2}>
          <TextField
            id={"currentPassword"}
            label={"Current Password"}
            value={currentPassword}
            onChange={handleFieldChange}
            size={"small"}
          />
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
            <TextField
              id={"currentPassword"}
              label={"Current Password"}
              value={currentPassword}
              onChange={handleFieldChange}
              size={"small"}
            />
            <Stack spacing={2} direction={"row"} sx={{ my: 3 }}>
              <Button variant={"contained"} onClick={handleStartDeactivation}>
                Cancel
              </Button>
              <Button color={"error"}>Deactivate</Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};
