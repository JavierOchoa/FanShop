import { FC, PropsWithChildren, useEffect, useState, ChangeEvent } from "react";
import { changeDialogType, changeOpenEditDialogStatus } from "../../../../redux/slices";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useGetUserQuery } from "../../../../redux/services";
import { useAppDispatch } from "../../../../utils/hooks";
import { APIResponse, ErrorUserState, ModalType, UserPost } from "../../../../interfaces";
import { ConfirmDeleteDialog } from "../../ConfirmDeleteDialog";
import useAdmin from "../../../../utils/hooks/useAdmin";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  userId: string | undefined;
  openStatus: boolean;
  dialogType: ModalType;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const rolesOptions = ["admin", "user"];
const emptyUser = {
  fullName: "",
  email: "",
  isActive: true,
  password: "",
  roles: ["user"],
};
const defaultError = {
  fullName: { status: false, message: "" },
  email: { status: false, message: "" },
  password: { status: false, message: "" },
};

export const UserDialog: FC<PropsWithChildren<Props>> = ({ userId, openStatus, dialogType }) => {
  const dispatch = useAppDispatch();
  const { deactivateUsers, activateUsers, handleUserSave } = useAdmin();
  const { data: userData } = useGetUserQuery(userId ?? skipToken);
  const [user, setUser] = useState<UserPost>(emptyUser);
  const [disabledSaveStatus, setDisabledSaveStatus] = useState<boolean>(true);
  const [error, setError] = useState<ErrorUserState>(defaultError);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userData?.id) {
      setUser(userData);
    }
  }, [userData]);
  useEffect(() => {
    if (dialogType === "edit" && userData?.id) setUser(userData);
    if (dialogType === "new") setUser(emptyUser);
  }, [dialogType]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validate = (fieldToValidate: "fullName" | "email" | "password", value: string) => {
    if (fieldToValidate === "fullName") {
      if (!/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(value) || !/[\S\s]+[\S]*$/g.test(value)) {
        setError({
          ...error,
          [fieldToValidate]: {
            status: true,
            message: "This field is requiered. Can't contain special characters",
          },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
    if (fieldToValidate === "email") {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) {
        setError({
          ...error,
          [fieldToValidate]: {
            status: true,
            message: "This field is requiered. Can't contain special characters",
          },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
    if (fieldToValidate === "password") {
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(value)) {
        setError({
          ...error,
          [fieldToValidate]: {
            status: true,
            message: "This field is requiered. At least one Uppercase, Number and Symbol",
          },
        });
        setDisabledSaveStatus(true);
      } else {
        setError({
          ...error,
          [fieldToValidate]: {
            status: false,
            message: "",
          },
        });
        setDisabledSaveStatus(false);
      }
    }
  };
  const handleStatus = async () => {
    user.isActive ? deactivateUsers([user.id!]) : activateUsers([user.id!]);
  };
  const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setUser({
      ...user,
      roles: typeof value === "string" ? value.split(",") : value,
    });
  };
  const handleClose = () => {
    setError(defaultError);
    setUser(emptyUser);
    setDisabledSaveStatus(true);
    dispatch(changeDialogType(undefined));
    dispatch(changeOpenEditDialogStatus());
  };
  const handleBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    validate(event.target.name as "fullName" | "email", event.target.value);
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };
  const checkValidations = () => {
    return Object.keys(error).filter((err) => error[err as keyof typeof error]).length;
  };
  const handleSave = async () => {
    setErrorMessage(undefined);
    try {
      const saveResponse: APIResponse | undefined = await handleUserSave(user, dialogType);
      if (saveResponse?.successful === false) {
        setErrorMessage(saveResponse?.message);
        const numberOfErrors = checkValidations();
        if (numberOfErrors > 0) {
          setDisabledSaveStatus(true);
          return;
        }
        return;
      }
      handleClose();
      return saveResponse;
    } catch (err) {
      setErrorMessage((err as Error).message);
      return;
    }
  };
  return (
    <Dialog open={openStatus} onClose={handleClose} fullWidth={true} maxWidth={"xs"}>
      <DialogTitle>User Information</DialogTitle>
      <DialogContent>
        <Box sx={{ m: 1 }}>
          <FormGroup
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              margin: "1rem 0",
            }}
          >
            <TextField
              sx={{ mb: 1 }}
              id={"outlined-fullName"}
              label={"Name"}
              name={"fullName"}
              onChange={handleBodyChange}
              value={user?.fullName}
              error={error.fullName.status}
              helperText={error.fullName.status ? error.fullName.message : ""}
            ></TextField>
            <TextField
              sx={{ mb: 1 }}
              id={"outlined-email"}
              label={"Email"}
              name={"email"}
              onChange={handleBodyChange}
              value={user?.email}
              error={error.email.status}
              helperText={error.email.status ? error.email.message : ""}
            ></TextField>
            {dialogType === "new" && (
              // <TextField
              //   sx={{ mb: 1 }}
              //   id={"outlined-password"}
              //   label={"Password"}
              //   name={"password"}
              //   onChange={handleBodyChange}
              //   value={user?.password}
              //   error={error.password?.status}
              //   helperText={error.password?.status ? error.password?.message : ""}
              // ></TextField>
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
                  onChange={handleBodyChange}
                  label={"Password"}
                  name={"password"}
                  value={user?.password}
                  error={error.password?.status ? true : false}
                  // helpertext={error.password?.status ? error.password?.message : ""}
                  sx={{ mt: 1 }}
                />
                {error.password?.status && (
                  <FormHelperText error id="password-error-text">
                    {error.password?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </FormGroup>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "1rem 0",
            }}
          >
            <FormControl sx={{ mb: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
              <Select
                labelId="multiple-chip-label"
                id="multiple-chip"
                multiple
                value={user.roles}
                onChange={handleRoleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {rolesOptions.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {dialogType === "edit" && (
              <Button onClick={handleStatus}>{user.isActive ? "Deactivate" : "Activate"}</Button>
            )}
          </Box>
          {errorMessage && (
            <Alert variant="filled" severity="error">
              {errorMessage}
            </Alert>
          )}
        </Box>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ m: 2 }}
        >
          {dialogType === "edit" && (
            <ConfirmDeleteDialog variant="button" elements={[user.id!]} elementType={"user"} />
          )}
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={disabledSaveStatus}
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
