
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
  Chip,
  Tooltip,
  AppBar,
  Toolbar,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  HomeWork as HomeWorkIcon,
  CalendarMonth as BookingIcon,
  Notifications as NotificationsIcon,
  Favorite as FavoriteIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  ReportProblem as ComplaintIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as CustomerIcon,
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


// =====================================================
// CONSTANTS
// =====================================================

const DRAWER_WIDTH = 270;


// =====================================================
// CUSTOMER LAYOUT
// =====================================================

function CustomerLayout() {

  const navigate = useNavigate();

  const location = useLocation();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );


  // ===================================================
  // USER
  // ===================================================

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


  const customerId =
    user.id ||
    user.userId;


  const firstName =
    user.firstName ||
    user.name ||
    "Customer";


  const lastName =
    user.lastName ||
    "";


  const fullName =
    `${firstName} ${lastName}`.trim();


  // ===================================================
  // STATE
  // ===================================================

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [notificationCount, setNotificationCount] =
    useState(0);


  // ===================================================
  // LOAD NOTIFICATION COUNT
  // ===================================================

  useEffect(() => {

    if (!customerId) {
      return;
    }

    getUnreadNotificationCount(customerId)
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
          "Notification count error:",
          error
        );

      });

  }, []);


  // ===================================================
  // MENU ITEMS
  // ===================================================

  const menuItems = [

    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/customer/dashboard",
    },

    {
      label: "My Profile",
      icon: <PersonIcon />,
      path: "/customer/profile",
    },

    {
      label: "Properties",
      icon: <HomeWorkIcon />,
      path: "/customer/properties",
    },

    {
      label: "My Bookings",
      icon: <BookingIcon />,
      path: "/customer/bookings",
    },

    {
      label: "Notifications",
      icon: <NotificationsIcon />,
      path: "/customer/notifications",
      badge: notificationCount,
    },

    {
      label: "Favourites",
      icon: <FavoriteIcon />,
      path: "/customer/favourites",
    },

    {
      label: "Payments",
      icon: <PaymentIcon />,
      path: "/customer/payments",
    },

    {
      label: "Reviews",
      icon: <StarIcon />,
      path: "/customer/reviews",
    },

    {
      label: "Complaints",
      icon: <ComplaintIcon />,
      path: "/customer/complaints",
    },

  ];


  // ===================================================
  // NAVIGATION
  // ===================================================

  const handleNavigation = (path) => {

    navigate(path);

    setMobileOpen(false);

  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ===================================================
  // USER NAME
  // ===================================================

  const getUserName = () => {

    return (
      fullName ||
      "Customer"
    );

  };


  // ===================================================
  // USER INITIALS
  // ===================================================

  const getUserInitials = () => {

    const first =
      user.firstName?.charAt(0) || "";

    const last =
      user.lastName?.charAt(0) || "";

    const initials =
      `${first}${last}`.toUpperCase();

    return initials || "C";

  };


  // ===================================================
  // PROFILE IMAGE URL
  // ===================================================

  const getProfileImageUrl = () => {

    if (!user?.profileImage) {
      return "";
    }

    const image =
      user.profileImage;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (
      image.startsWith("/uploads/")
    ) {
      return `https://realestate-pro-backend.onrender.com${image}`;
    }

    if (
      image.startsWith("uploads/")
    ) {
      return `https://realestate-pro-backend.onrender.com/${image}`;
    }

    return `https://realestate-pro-backend.onrender.com/uploads/${image}`;

  };


  // ===================================================
  // PROFILE IMAGE
  // ===================================================

  const profileImage =
    getProfileImageUrl();


  // ===================================================
  // SIDEBAR CONTENT
  // ===================================================

  const sidebar = (

    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #071b34 0%, #0b2948 100%)",
        color: "#fff",
      }}
    >

      {/* =================================================
          SIDEBAR HEADER
      ================================================= */}

      <Box
        sx={{
          minHeight: 80,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          {/* LOGO */}

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg,#1976d2,#00bcd4)",
              boxShadow:
                "0 8px 20px rgba(0,0,0,.25)",
            }}
          >

            <HomeWorkIcon />

          </Box>


          {/* TITLE */}

          <Box>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "1.15rem",
                lineHeight: 1.2,
              }}
            >

              RealEstate

              <Box
                component="span"
                sx={{
                  color: "#4dd0e1",
                }}
              >
                Pro
              </Box>

            </Typography>


            <Typography
              sx={{
                color:
                  "rgba(255,255,255,.65)",
                fontSize: ".75rem",
                mt: 0.3,
              }}
            >

              Customer Portal

            </Typography>

          </Box>

        </Box>


        {/* MOBILE CLOSE */}

        {isMobile && (

          <IconButton
            onClick={() =>
              setMobileOpen(false)
            }
            sx={{
              color: "#fff",
            }}
          >

            <CloseIcon />

          </IconButton>

        )}

      </Box>


      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.12)",
        }}
      />


      {/* =================================================
          CUSTOMER PROFILE
      ================================================= */}

      <Box
        sx={{
          px: 2,
          py: 2,
        }}
      >

        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            backgroundColor:
              "rgba(255,255,255,.07)",
            border:
              "1px solid rgba(255,255,255,.08)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            transition:
              "all .2s ease",

            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,.11)",
              transform:
                "translateY(-1px)",
            },
          }}
          onClick={() =>
            navigate("/customer/profile")
          }
        >

          {/* USER AVATAR */}

          <Avatar
            src={
              profileImage ||
              undefined
            }
            alt={getUserName()}
            sx={{
              width: 42,
              height: 42,
              background:
                "linear-gradient(135deg,#1976d2,#00bcd4)",
              fontWeight: 800,
            }}
          >

            {!profileImage &&
              getUserInitials()}

          </Avatar>


          {/* USER DETAILS */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >

            <Typography
              noWrap
              sx={{
                fontWeight: 800,
                fontSize: ".9rem",
              }}
            >

              {getUserName()}

            </Typography>


            <Chip
              icon={
                <CustomerIcon
                  sx={{
                    color:
                      "#4dd0e1 !important",
                    fontSize: 16,
                  }}
                />
              }
              label="CUSTOMER"
              size="small"
              sx={{
                mt: 0.5,
                height: 23,
                color: "#4dd0e1",
                backgroundColor:
                  "rgba(77,208,225,.12)",
                fontWeight: 800,
                fontSize: ".7rem",
              }}
            />

          </Box>

        </Box>

      </Box>


      {/* =================================================
          MENU TITLE
      ================================================= */}

      <Typography
        sx={{
          px: 2.5,
          mb: 1,
          color:
            "rgba(255,255,255,.45)",
          fontSize: ".72rem",
          fontWeight: 800,
          letterSpacing: 1.2,
        }}
      >

        CUSTOMER PORTAL

      </Typography>


      {/* =================================================
          MENU
      ================================================= */}

      <List
        sx={{
          px: 1.5,
          flex: 1,
          overflowY: "auto",
        }}
      >

        {menuItems.map((item) => {

          const active =
            location.pathname === item.path ||
            (
              item.path !==
                "/customer/dashboard" &&
              location.pathname.startsWith(
                item.path
              )
            );


          const isNotificationItem =
            item.path ===
            "/customer/notifications";


          return (

            <ListItemButton
              key={item.label}
              onClick={() =>
                handleNavigation(item.path)
              }
              sx={{
                minHeight: 48,
                mb: 0.6,
                px: 1.5,
                borderRadius: 2.5,

                color: active
                  ? "#fff"
                  : "rgba(255,255,255,.72)",

                backgroundColor:
                  active
                    ? "rgba(25,118,210,.95)"
                    : "transparent",

                boxShadow:
                  active
                    ? "0 8px 20px rgba(0,0,0,.18)"
                    : "none",

                transition:
                  "all .2s ease",

                "&:hover": {

                  backgroundColor:
                    active
                      ? "rgba(25,118,210,1)"
                      : "rgba(255,255,255,.08)",

                  color: "#fff",

                  transform:
                    "translateX(2px)",

                },
              }}
            >

              {/* ICON */}

              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: active
                    ? "#fff"
                    : "rgba(255,255,255,.65)",
                }}
              >

                {isNotificationItem ? (

                  <Badge
                    badgeContent={
                      notificationCount
                    }
                    color="error"
                    max={999}
                    showZero
                    overlap="circular"
                    sx={{
                      "& .MuiBadge-badge":
                        {
                          fontWeight: 900,
                          fontSize: "0.7rem",
                          minWidth: 20,
                          height: 20,
                          borderRadius:
                            "10px",
                          border:
                            "2px solid #071b34",
                        },
                    }}
                  >

                    {item.icon}

                  </Badge>

                ) : (

                  item.icon

                )}

              </ListItemIcon>


              {/* LABEL */}

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: active
                    ? 800
                    : 600,
                  fontSize: ".92rem",
                }}
              />


              {/* SIDEBAR COUNT */}

              {isNotificationItem &&
                notificationCount > 0 && (

                  <Chip
                    label={
                      notificationCount > 999
                        ? "999+"
                        : notificationCount
                    }
                    size="small"
                    sx={{
                      height: 23,
                      minWidth: 27,
                      color: "#fff",
                      backgroundColor:
                        "#d32f2f",
                      fontWeight: 900,
                      fontSize: ".7rem",
                    }}
                  />

                )}

            </ListItemButton>

          );

        })}

      </List>


      {/* =================================================
          SIDEBAR FOOTER
      ================================================= */}

      <Box
        sx={{
          p: 1.5,
        }}
      >

        <Divider
          sx={{
            mb: 1.5,
            borderColor:
              "rgba(255,255,255,.12)",
          }}
        />


        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 48,
            px: 1.5,
            borderRadius: 2.5,
            color:
              "rgba(255,255,255,.72)",

            transition:
              "all .2s ease",

            "&:hover": {
              backgroundColor:
                "rgba(211,47,47,.15)",
              color: "#ff8a80",
            },
          }}
        >

          <ListItemIcon
            sx={{
              minWidth: 42,
              color: "inherit",
            }}
          >

            <LogoutIcon />

          </ListItemIcon>


          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 700,
            }}
          />

        </ListItemButton>

      </Box>

    </Box>
  );


  // ===================================================
  // RETURN
  // ===================================================

  return (

    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Box
        component="nav"
        sx={{
          width: {
            md: DRAWER_WIDTH,
          },
          flexShrink: {
            md: 0,
          },
        }}
      >

        {/* MOBILE DRAWER */}

        {isMobile ? (

          <Box
            sx={{
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                border: "none",
              },
            }}
          >

            {mobileOpen && (

              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: DRAWER_WIDTH,
                  zIndex: 1300,
                  boxShadow:
                    "8px 0 30px rgba(0,0,0,.25)",
                }}
              >

                {sidebar}

              </Box>

            )}

          </Box>

        ) : (

          /* DESKTOP DRAWER */

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              width: DRAWER_WIDTH,
            }}
          >

            <Box
              sx={{
                position: "fixed",
                width: DRAWER_WIDTH,
                height: "100vh",
                top: 0,
                left: 0,
                zIndex: 1200,
                boxShadow:
                  "4px 0 20px rgba(0,0,0,.12)",
              }}
            >

              {sidebar}

            </Box>

          </Box>

        )}

      </Box>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md:
              `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          minWidth: 0,
        }}
      >

        {/* =================================================
            TOP BAR
        ================================================= */}

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#fff",
            color: "#172033",
            borderBottom:
              "1px solid #e7ebf1",
          }}
        >

          <Toolbar
            sx={{
              minHeight: {
                xs: 68,
                md: 72,
              },
              px: {
                xs: 2,
                md: 3,
              },
            }}
          >

            {/* MOBILE MENU */}

            {isMobile && (

              <IconButton
                edge="start"
                onClick={() =>
                  setMobileOpen(true)
                }
                sx={{
                  mr: 1.5,
                  color: "#172033",
                }}
              >

                <MenuIcon />

              </IconButton>

            )}


            {/* PAGE TITLE */}

            <Box
              sx={{
                flexGrow: 1,
              }}
            >

              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: "1.1rem",
                    md: "1.35rem",
                  },
                  color: "#172033",
                }}
              >

                Customer Dashboard

              </Typography>


              <Typography
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  fontSize: ".8rem",
                  color: "#7b8494",
                  mt: 0.2,
                }}
              >

                Explore properties, manage bookings
                and track your real-estate activity

              </Typography>

            </Box>


            {/* =================================================
                TOP BAR NOTIFICATION
            ================================================= */}

            <Tooltip
              title={
                notificationCount > 0
                  ? `${notificationCount} unread notifications`
                  : "No unread notifications"
              }
            >

              <IconButton
                onClick={() =>
                  navigate(
                    "/customer/notifications"
                  )
                }
                sx={{
                  mr: 1,
                  color: "#526071",
                  width: 48,
                  height: 48,
                }}
              >

                <Badge
                  badgeContent={
                    notificationCount
                  }
                  color="error"
                  max={999}
                  showZero
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge":
                      {
                        fontWeight: 900,
                        fontSize: "0.72rem",
                        minWidth: 21,
                        height: 21,
                        borderRadius:
                          "11px",
                        border:
                          "2px solid white",
                      },
                  }}
                >

                  <NotificationsIcon
                    sx={{
                      fontSize: 28,
                    }}
                  />

                </Badge>

              </IconButton>

            </Tooltip>


            {/* =================================================
                USER
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                cursor: "pointer",
                borderRadius: 2.5,
                px: 1,
                py: 0.5,

                "&:hover": {
                  backgroundColor:
                    "#f5f7fb",
                },
              }}
              onClick={() =>
                navigate("/customer/profile")
              }
            >

              <Avatar
                src={
                  profileImage ||
                  undefined
                }
                alt={getUserName()}
                sx={{
                  width: 38,
                  height: 38,
                  background:
                    "linear-gradient(135deg,#1976d2,#00bcd4)",
                  fontWeight: 800,
                  fontSize: ".9rem",
                }}
              >

                {!profileImage &&
                  getUserInitials()}

              </Avatar>


              <Box
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: ".85rem",
                    lineHeight: 1.2,
                  }}
                >

                  {getUserName()}

                </Typography>


                <Typography
                  sx={{
                    fontSize: ".72rem",
                    color: "#7b8494",
                    mt: 0.2,
                  }}
                >

                  Customer

                </Typography>

              </Box>

            </Box>

          </Toolbar>

        </AppBar>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 4,
            },
          }}
        >

          <Outlet />

        </Box>

      </Box>

    </Box>

  );

}


export default CustomerLayout;
