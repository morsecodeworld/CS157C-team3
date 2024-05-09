import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AppBar, Drawer } from "../styled";
import { MainListItems, SecondaryListItems } from "./listItems";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { drawerWidth, drawerWidthClosed } from "../config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";

const Appbar = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const [pageTitle, setPageTitle] = React.useState("");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Update the page title based on the current route
  React.useEffect(() => {
    const getPageTitle = (pathname) => {
      const titles = {
        "/dashboard": t("Dashboard"),
        "/profile": t("Profile"),
        "/categories": t("Categories"),
        "/inventory": t("Inventory"),
        "/orders": t("Orders"),
        "/orders/:orderId": t("Order Details"),
        "/settings": t("Settings"),
      };
      // Check if the pathname is a dynamic route for orders
      const orderMatch = pathname.match(/\/orders\/(.+)/);
      if (orderMatch) {
        return `${t("Order Details")}`;
      }

      return titles[pathname] || t("Dashboard");
    };

    setPageTitle(getPageTitle(location.pathname));
    setOpen(!isMobile);
  }, [location.pathname, isMobile, t]);

  return (
    <>
      <AppBar
        position="absolute"
        open={open}
        elevation={0}
        sx={{
          bgcolor: theme.palette.grey[200],
          color: "black",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color={`${theme.palette.primary.main}`}
            noWrap
            sx={{ flexGrow: 1, textTransform: "uppercase" }}
          >
            {pageTitle}
          </Typography>

          <Box
            component="img"
            src={"icon.png"}
            alt="Ruralnventory_logo"
            sx={{
              width: { xs: "30%", sm: "25%", md: "20%", lg: "15%", xl: "10%" },
              height: "auto",
              borderRadius: 1,
              maxWidth: "200px",
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: theme.palette.grey[100],
            width: open ? drawerWidth : drawerWidthClosed,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems />
          <Divider sx={{ my: 1 }} />
          <SecondaryListItems />
        </List>
      </Drawer>
    </>
  );
};

export default Appbar;
