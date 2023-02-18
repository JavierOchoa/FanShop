import { Box, Button, Dialog, DialogContent, ImageListItem } from "@mui/material";
import { FC, PropsWithChildren, useState } from "react";
import Image from "next/image";

interface Props {
  imageLink: string;
  altText: string;
}

export const NestedImageModal: FC<PropsWithChildren<Props>> = ({ imageLink, altText }) => {
  const [childModalStatus, setChildModalStatus] = useState(false);

  const handleChildModal = () => {
    setChildModalStatus(!childModalStatus);
  };
  return (
    <Box>
      <ImageListItem onClick={handleChildModal} sx={{ width: 100 }}>
        <Image src={imageLink} alt={altText} loading={"lazy"} width={100} height={100} />
      </ImageListItem>
      <Dialog open={childModalStatus} onClose={handleChildModal} maxWidth={"sm"}>
        <DialogContent>
          <Image src={imageLink} alt={altText} loading={"lazy"} width={500} height={500} />
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
