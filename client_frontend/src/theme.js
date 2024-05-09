// ./theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // your theme options
  palette: {
    mode: "light",
    primary: {
      main: "#19747E",
    },
    secondary: {
      main: "#A9D6E5",
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

export default theme;
