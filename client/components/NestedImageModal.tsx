import { Delete, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  ImageListItem,
  Modal,
  Stack,
} from "@mui/material";
import { FC, PropsWithChildren, useState } from "react";

interface Props {
  imageLink: string;
  altText: string;
}

export const NestedImageModal: FC<PropsWithChildren<Props>> = ({ imageLink, altText }) => {
  const [childModalStatus, setchildModalStatus] = useState(false);

  const handleChildModal = () => {
    setchildModalStatus(!childModalStatus);
  };
  return (
    <Box>
      <ImageListItem onClick={handleChildModal}>
        <img src={imageLink} alt={altText} loading="lazy" />
      </ImageListItem>
      <Dialog open={childModalStatus} onClose={handleChildModal} maxWidth={"sm"}>
        <DialogContent>
          <img src={imageLink} alt={altText} loading="lazy" width={"500px"} />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Button variant="text" onClick={handleChildModal}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
