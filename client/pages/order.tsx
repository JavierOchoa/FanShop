import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

export default function Order() {
  useEffect(() => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  }, []);
  return <CircularProgress />;
}
