import { FC, useState, PropsWithChildren } from "react";
import { Delete } from "@mui/icons-material";
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
import { useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "../../redux/slices";

interface Props {
  variant: "tooltip" | "button";
  productsToDelete: string[];
}

export const ConfirmDeleteDialog: FC<PropsWithChildren<Props>> = ({
  variant,
  productsToDelete,
}) => {
  const dispatch = useAppDispatch();
  const { deleteProducts } = useAdmin();
  const [childDialogStatus, setChildDialogStatus] = useState<boolean>(false);
  const handleChildDialogStatus = () => setChildDialogStatus(!childDialogStatus);
  const handleDeleteProducts = () => {
    deleteProducts(productsToDelete);
    handleChildDialogStatus();
    dispatch(changeOpenEditDialogStatus());
  };
  return (
    <Box>
      {variant === "tooltip" ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleChildDialogStatus}>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <Button variant={"contained"} onClick={handleChildDialogStatus} color={"error"}>
          Delete
        </Button>
      )}
      <Dialog open={childDialogStatus} onClose={handleChildDialogStatus}>
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to delete {productsToDelete.length} product
            {productsToDelete.length > 1 && "s"}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ mb: 1, mr: 1 }}>
          <Button onClick={handleDeleteProducts} variant={"outlined"} color={"error"}>
            Delete
          </Button>
          <Button onClick={handleChildDialogStatus} variant={"outlined"} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
