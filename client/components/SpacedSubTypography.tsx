import { FC, PropsWithChildren } from "react";
import { Typography } from "@mui/material";

export const SpacedSubTypography: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      sx={{
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".3rem",
        color: "primary.main",
      }}
    >
      {children}
    </Typography>
  );
};
