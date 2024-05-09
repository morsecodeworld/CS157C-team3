import React from "react";
import { useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export const MainListItems = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const mainListItemData = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      route: "/dashboard",
    },
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      route: "/profile",
    },
    {
      text: "Categories",
      icon: <CategoryIcon />,
      route: "/categories",
    },
    {
      text: "Inventory",
      icon: <InventoryIcon />,
      route: "/inventory",
    },
    {
      text: "Orders",
      icon: <ShoppingCartIcon />,
      route: "/orders",
    },
  ];

  // Define the active style
  const activeListItemStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    borderRadius: theme.shape.borderRadius,
  };

  // Get the current path
  const currentPath = window.location.pathname;

  return (
    <React.Fragment>
      {mainListItemData.map((item, index) => (
        <ListItemButton
          key={index}
          onClick={() => navigate(item.route)}
          sx={{
            padding: "8px 16px",
            ...(currentPath === item.route ? activeListItemStyle : {}),
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
              marginRight: "16px",
              color:
                currentPath === item.route
                  ? "inherit"
                  : theme.palette.text.secondary,
              "& .MuiSvgIcon-root": {
                fontSize: "1.2rem",
              },
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={t(item.text)}
            primaryTypographyProps={{
              fontSize: "0.950rem",
              fontWeight:
                currentPath === item.route
                  ? "fontWeightMedium"
                  : "fontWeightRegular",
            }}
          />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const secondaryListItemData = [
    {
      text: t("Settings"),
      icon: <SettingsIcon />,
      route: "/settings",
    },
    { text: t("Logout"), icon: <LogoutIcon />, route: "/logout" },
  ];

  const activeListItemStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    borderRadius: theme.shape.borderRadius,
  };

  // Get the current path
  const currentPath = window.location.pathname;

  return (
    <React.Fragment>
      {secondaryListItemData.map((item, index) => (
        <ListItemButton
          key={index}
          onClick={() => navigate(item.route)}
          sx={{
            padding: "8px 16px",
            ...(currentPath === item.route ? activeListItemStyle : {}),
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto", // reduce the width of the icon area
              marginRight: "16px", // add some margin if needed
              color:
                currentPath === item.route
                  ? "inherit"
                  : theme.palette.text.secondary,
              "& .MuiSvgIcon-root": {
                fontSize: "1.2rem",
              },
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={t(item.text)}
            primaryTypographyProps={{
              fontSize: "0.950rem",
              fontWeight:
                currentPath === item.route
                  ? "fontWeightMedium"
                  : "fontWeightRegular",
            }}
          />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};
