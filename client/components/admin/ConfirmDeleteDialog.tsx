import { FC, useState, PropsWithChildren } from "react";
import { Block, Delete, Done } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import useAdmin from "../../utils/hooks/useAdmin";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "../../redux/slices";

interface Props {
  variant: "tooltip" | "button";
  elementType: "user" | "product";
  elements: string[];
  action?: "delete" | "deactivate" | "activate";
}

export const ConfirmDeleteDialog: FC<PropsWithChildren<Props>> = ({
  variant,
  elementType,
  elements,
  action = "delete",
}) => {
  const dispatch = useAppDispatch();
  const openEditDialog = useAppSelector((state) => state.admin.openEditDialog);
  const { deleteProducts, deleteUsers, deactivateUsers, activateUsers } = useAdmin();
  const [childDialogStatus, setChildDialogStatus] = useState<boolean>(false);
  const handleChildDialogStatus = () => setChildDialogStatus(!childDialogStatus);
  const handleActivate = () => {
    activateUsers(elements);
    handleChildDialogStatus();
    openEditDialog ? dispatch(changeOpenEditDialogStatus()) : null;
  };
  const handleDeactivate = () => {
    deactivateUsers(elements);
    handleChildDialogStatus();
    openEditDialog ? dispatch(changeOpenEditDialogStatus()) : null;
  };
  const handleDelete = () => {
    if (elementType === "product") deleteProducts(elements);
    if (elementType === "user") deleteUsers(elements);
    handleChildDialogStatus();
    openEditDialog ? dispatch(changeOpenEditDialogStatus()) : null;
  };
  return (
    <Box>
      {variant === "tooltip" ? (
        <Box>
          {action === "delete" && (
            <Tooltip title="Delete">
              <IconButton onClick={handleChildDialogStatus}>
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          {action === "deactivate" && (
            <Tooltip title="Deactivate">
              <IconButton onClick={handleChildDialogStatus}>
                <Block />
              </IconButton>
            </Tooltip>
          )}
          {action === "activate" && (
            <Tooltip title="Activate">
              <IconButton onClick={handleChildDialogStatus}>
                <Done />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ) : (
        <Button variant={"contained"} onClick={handleChildDialogStatus} color={"error"}>
          Delete
        </Button>
      )}
      <Dialog open={childDialogStatus} onClose={handleChildDialogStatus}>
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to {action} {elements.length} {elementType}
            {elements.length > 1 && "s"}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ mb: 1, mr: 1 }}>
          {action === "delete" && (
            <Button onClick={handleDelete} variant={"outlined"} color={"error"}>
              Delete
            </Button>
          )}
          {action === "activate" && (
            <Button onClick={handleActivate} variant={"contained"} color={"error"}>
              Activate
            </Button>
          )}
          {action === "deactivate" && (
            <Button onClick={handleDeactivate} variant={"contained"} color={"error"}>
              Deactivate
            </Button>
          )}
          <Button onClick={handleChildDialogStatus} variant={"outlined"} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
