
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Dashboard,
  HomeWork,
  CalendarMonth,
  Notifications,
  Payment,
  Star,
  ReportProblem,
  Person,
  Logout,
  Menu,
  QuestionAnswer,
} from "@mui/icons-material";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  getUnreadNotificationCount,
} from "../api";


function OwnerLayout() {

  const navigate = useNavigate();

  const location = useLocation();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );


  // =====================================================
  // USER
  // =====================================================

  const savedUser =
    localStorage.getItem("user");

  let user = {};

  try {

    user = savedUser
      ? JSON.parse(savedUser)
      : {};

  } catch (error) {

    console.error(
      "Unable to read user:",
      error
    );

  }


  const ownerId =
    user.id ||
    user.userId;


  const firstName =
    user.firstName ||
    user.name ||
    "Owner";


  const lastName =
    user.lastName ||
    "";


  const fullName =
    `${firstName} ${lastName}`.trim();


  // =====================================================
  // STATE
  // =====================================================

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [notificationCount, setNotificationCount] =
    useState(0);


  // =====================================================
  // LOAD NOTIFICATION COUNT
  // =====================================================

  useEffect(() => {

    if (!ownerId) {
      return;
    }

    getUnreadNotificationCount(ownerId)
      .then((response) => {

        const count =
          response?.data?.data ??
          response?.data ??
          0;

        setNotificationCount(
          Number(count) || 0
        );

      })
      .catch((error) => {

        console.error(
          "Owner notification count error:",
          error
        );

      });

  }, [ownerId]);


  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [

    {
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/owner/dashboard",
    },

    {
      label: "My Profile",
      icon: <Person />,
      path: "/owner/profile",
    },

    {
      label: "My Properties",
      icon: <HomeWork />,
      path: "/owner/properties",
    },

    {
      label: "Bookings",
      icon: <CalendarMonth />,
      path: "/owner/bookings",
    },

    {
      label: "Inquiries",
      icon: <QuestionAnswer />,
      path: "/owner/inquiries",
    },

    {
      label: "Notifications",
      icon: <Notifications />,
      path: "/owner/notifications",
      badge: notificationCount,
    },

    {
      label: "Payments",
      icon: <Payment />,
      path: "/owner/payments",
    },

    {
      label: "Reviews",
      icon: <Star />,
      path: "/owner/reviews",
    },

    {
      label: "Complaints",
      icon: <ReportProblem />,
      path: "/owner/complaints",
    },

  ];


  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (path) => {

    navigate(path);

    setMobileOpen(false);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  // =====================================================
  // SIDEBAR
  // =====================================================

  const sidebar = (

    <Box
      sx={{
        width: 260,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background:
          "linear-gradient(180deg, #14213d 0%, #1d3557 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
        boxShadow:
          "4px 0 20px rgba(0,0,0,0.12)",
      }}
    >

      {/* =================================================
          LOGO
      ================================================= */}

      <Box
        sx={{
          height: 80,
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >

        <HomeWork
          sx={{
            fontSize: 34,
            mr: 1.5,
          }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            letterSpacing: 0.5,
          }}
        >
          RealEstate Pro
        </Typography>

      </Box>


      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.12)",
        }}
      />


      {/* =================================================
          MENU
      ================================================= */}

      <List
        sx={{
          px: 1.5,
          py: 2,
          flex: 1,
          overflowY: "auto",
        }}
      >

        {menuItems.map((item) => {

          const active =
            location.pathname === item.path ||
            (
              item.path !== "/owner/dashboard" &&
              location.pathname.startsWith(
                item.path
              )
            );

          return (

            <ListItemButton
              key={item.label}
              onClick={() =>
                handleNavigation(item.path)
              }
              sx={{
                mb: 0.8,
                borderRadius: 2,
                minHeight: 48,

                backgroundColor:
                  active
                    ? "#3769e8"
                    : "transparent",

                "&:hover": {
                  backgroundColor:
                    active
                      ? "#3769e8"
                      : "rgba(255,255,255,0.08)",
                },
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: "white",
                }}
              >

                {item.badge > 0 ? (

                  <Badge
                    badgeContent={
                      item.badge
                    }
                    color="error"
                  >
                    {item.icon}
                  </Badge>

                ) : (

                  item.icon

                )}

              </ListItemIcon>


              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight:
                    active
                      ? 600
                      : 400,
                }}
              />

            </ListItemButton>

          );

        })}

      </List>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <Box
        sx={{
          p: 1.5,
        }}
      >

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,

            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,0.08)",
            },
          }}
        >

          <ListItemIcon
            sx={{
              minWidth: 42,
              color: "white",
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
          />

        </ListItemButton>

      </Box>

    </Box>
  );


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      {!isMobile && sidebar}


      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      {isMobile && (

        <Box
          sx={{
            height: 64,
            backgroundColor: "#14213d",
            color: "white",
            display: "flex",
            alignItems: "center",
            px: 2,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
          }}
        >

          <IconButton
            color="inherit"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            <Menu />
          </IconButton>


          <Typography
            fontWeight="bold"
            ml={1}
          >
            RealEstate Pro
          </Typography>

        </Box>

      )}


      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      {isMobile && mobileOpen && (

        <Box
          sx={{
            position: "fixed",
            top: 64,
            left: 0,
            bottom: 0,
            zIndex: 1199,
          }}
        >

          {sidebar}

        </Box>

      )}


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <Box
        sx={{
          ml: {
            xs: 0,
            md: "260px",
          },

          pt: {
            xs: "64px",
            md: 0,
          },

          minHeight: "100vh",
        }}
      >

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <Box
          sx={{
            height: 72,
            backgroundColor: "white",
            borderBottom:
              "1px solid #e5e7eb",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "flex-end",

            px: {
              xs: 2,
              md: 4,
            },

            gap: 2,
          }}
        >

          <IconButton
            onClick={() =>
              navigate(
                "/owner/notifications"
              )
            }
          >

            <Badge
              badgeContent={
                notificationCount
              }
              color="error"
            >

              <Notifications />

            </Badge>

          </IconButton>


          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "#3769e8",
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </Avatar>


          <Box>

            <Typography
              fontWeight="bold"
              fontSize={14}
            >
              {fullName}
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={12}
            >
              Owner
            </Typography>

          </Box>

        </Box>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >

          <Outlet />

        </Box>

      </Box>

    </Box>

  );

}


export default OwnerLayout;
