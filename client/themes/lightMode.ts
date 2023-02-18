import { createTheme } from "@mui/material";

export const ligthTheme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "white",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#00796b",
      light: "#26a69a",
      dark: "#00695c",
    },
  },
});
