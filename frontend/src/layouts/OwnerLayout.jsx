
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
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
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
  Close,
  AdminPanelSettings,
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
  // USER INITIALS
  // =====================================================

  const getUserInitials = () => {

    const first =
      user.firstName?.charAt(0) || "";

    const last =
      user.lastName?.charAt(0) || "";

    const initials =
      `${first}${last}`.toUpperCase();

    return initials || "O";
  };


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

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


  const profileImage =
    getProfileImageUrl();


  // =====================================================
  // SIDEBAR
  // =====================================================

  const sidebar = (

    <Box
      sx={{
        width: 270,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,

        background:
          "linear-gradient(180deg, #071b34 0%, #0b2948 100%)",

        color: "#fff",

        display: "flex",
        flexDirection: "column",

        zIndex: 1200,

        boxShadow:
          "6px 0 24px rgba(0,0,0,0.18)",

        overflow: "hidden",
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
                "0 8px 20px rgba(0,0,0,.28)",

              flexShrink: 0,
            }}
          >

            <HomeWork
              sx={{
                fontSize: 25,
              }}
            />

          </Box>


          {/* BRAND */}

          <Box>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "1.15rem",
                lineHeight: 1.2,
                letterSpacing: 0.2,
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
                  "rgba(255,255,255,.62)",
                fontSize: ".75rem",
                mt: 0.3,
              }}
            >
              Owner Portal
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

            <Close />

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
          OWNER PROFILE
      ================================================= */}

      <Box
        sx={{
          px: 2,
          py: 2,
        }}
      >

        <Box
          onClick={() =>
            handleNavigation(
              "/owner/profile"
            )
          }
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
              "all .25s ease",

            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,.12)",

              transform:
                "translateY(-1px)",
            },
          }}
        >

          {/* AVATAR */}

          <Avatar
            src={
              profileImage ||
              undefined
            }
            alt={fullName}
            sx={{
              width: 44,
              height: 44,

              background:
                "linear-gradient(135deg,#1976d2,#00bcd4)",

              fontWeight: 900,

              boxShadow:
                "0 5px 15px rgba(0,0,0,.25)",
            }}
          >

            {!profileImage &&
              getUserInitials()}

          </Avatar>


          {/* USER INFORMATION */}

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <Typography
              noWrap
              sx={{
                fontWeight: 800,
                fontSize: ".9rem",
                color: "#fff",
              }}
            >

              {fullName}

            </Typography>


            <Chip
              icon={
                <AdminPanelSettings
                  sx={{
                    color:
                      "#4dd0e1 !important",
                    fontSize: 16,
                  }}
                />
              }
              label="OWNER"
              size="small"
              sx={{
                mt: 0.5,

                height: 23,

                color: "#4dd0e1",

                backgroundColor:
                  "rgba(77,208,225,.12)",

                border:
                  "1px solid rgba(77,208,225,.18)",

                fontWeight: 800,

                fontSize: ".68rem",

                "& .MuiChip-label": {
                  px: 1,
                },
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

        OWNER MANAGEMENT

      </Typography>


      {/* =================================================
          MENU
      ================================================= */}

      <List
        sx={{
          px: 1.5,
          py: 0,

          flex: 1,

          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            background:
              "rgba(255,255,255,.18)",
            borderRadius: 10,
          },
        }}
      >

        {menuItems.map((item) => {

          const active =
            location.pathname === item.path ||
            (
              item.path !==
                "/owner/dashboard" &&
              location.pathname.startsWith(
                `${item.path}/`
              )
            );


          const isNotification =
            item.path ===
            "/owner/notifications";


          return (

            <ListItemButton
              key={item.label}
              onClick={() =>
                handleNavigation(
                  item.path
                )
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

                  transition:
                    "all .2s ease",
                }}
              >

                {isNotification ? (

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
                          fontSize: ".68rem",
                          minWidth: 20,
                          height: 20,
                          borderRadius: "10px",

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
                  fontSize: ".92rem",

                  fontWeight:
                    active
                      ? 800
                      : 600,
                }}
              />


              {/* NOTIFICATION COUNT */}

              {isNotification &&
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

                      fontSize: ".68rem",

                      "& .MuiChip-label": {
                        px: 0.8,
                      },

                      boxShadow:
                        "0 3px 8px rgba(211,47,47,.35)",
                    }}
                  />

                )}

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

              transform:
                "translateX(2px)",
            },
          }}
        >

          <ListItemIcon
            sx={{
              minWidth: 42,
              color: "inherit",
            }}
          >

            <Logout />

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


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <Box
      sx={{
        display: "flex",

        minHeight: "100vh",

        backgroundColor: "#f5f7fb",
      }}
    >

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      {!isMobile && (

        <Box
          component="nav"
          sx={{
            width: 270,
            flexShrink: 0,
          }}
        >

          {sidebar}

        </Box>

      )}


      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      {isMobile && (

        <Box
          sx={{
            position: "fixed",

            top: 0,
            left: 0,
            right: 0,

            height: 68,

            backgroundColor: "#fff",

            color: "#172033",

            display: "flex",

            alignItems: "center",

            px: 2,

            zIndex: 1200,

            borderBottom:
              "1px solid #e7ebf1",

            boxShadow:
              "0 2px 12px rgba(0,0,0,.05)",
          }}
        >

          <IconButton
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
            sx={{
              mr: 1,

              color: "#172033",
            }}
          >

            <Menu />

          </IconButton>


          {/* MOBILE LOGO */}

          <Box
            sx={{
              width: 38,
              height: 38,

              borderRadius: 2,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "linear-gradient(135deg,#1976d2,#00bcd4)",

              color: "#fff",

              mr: 1.2,
            }}
          >

            <HomeWork
              sx={{
                fontSize: 22,
              }}
            />

          </Box>


          <Box>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "1rem",
                lineHeight: 1.1,
              }}
            >

              RealEstate

              <Box
                component="span"
                sx={{
                  color: "#1976d2",
                }}
              >
                Pro
              </Box>

            </Typography>


            <Typography
              sx={{
                color: "#7b8494",
                fontSize: ".68rem",
              }}
            >

              Owner Portal

            </Typography>

          </Box>

        </Box>

      )}


      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      {isMobile && mobileOpen && (

        <Box
          sx={{
            position: "fixed",

            top: 0,
            left: 0,

            bottom: 0,

            zIndex: 1199,

            width: 270,
          }}
        >

          {sidebar}

        </Box>

      )}


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            xs: "100%",
            md: "calc(100% - 270px)",
          },

          minWidth: 0,
        }}
      >

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <Box
          sx={{
            height: 72,

            backgroundColor: "#fff",

            borderBottom:
              "1px solid #e7ebf1",

            display: "flex",

            alignItems: "center",

            px: {
              xs: 2,
              md: 3,
            },

            gap: 1.5,

            position: "sticky",

            top: 0,

            zIndex: 1100,
          }}
        >

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
                  md: "1.3rem",
                },

                color: "#172033",
              }}
            >

              Owner Dashboard

            </Typography>


            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },

                fontSize: ".78rem",

                color: "#7b8494",

                mt: 0.2,
              }}
            >

              Manage your properties,
              bookings and customer activity

            </Typography>

          </Box>


          {/* =================================================
              NOTIFICATIONS
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
                  "/owner/notifications"
                )
              }
              sx={{
                width: 46,
                height: 46,

                color: "#526071",

                borderRadius: 2.5,

                "&:hover": {
                  backgroundColor:
                    "#f1f5f9",
                },
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

                      fontSize: ".68rem",

                      minWidth: 20,

                      height: 20,

                      borderRadius: "10px",

                      border:
                        "2px solid white",
                    },
                }}
              >

                <Notifications
                  sx={{
                    fontSize: 27,
                  }}
                />

              </Badge>

            </IconButton>

          </Tooltip>


          {/* =================================================
              USER PROFILE
          ================================================= */}

          <Box
            onClick={() =>
              navigate(
                "/owner/profile"
              )
            }
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1.2,

              cursor: "pointer",

              px: 1,

              py: 0.6,

              borderRadius: 2.5,

              transition:
                "all .2s ease",

              "&:hover": {
                backgroundColor:
                  "#f5f7fb",
              },
            }}
          >

            <Avatar
              src={
                profileImage ||
                undefined
              }
              alt={fullName}
              sx={{
                width: 40,
                height: 40,

                background:
                  "linear-gradient(135deg,#1976d2,#00bcd4)",

                fontWeight: 900,

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

                  fontSize: ".84rem",

                  lineHeight: 1.2,

                  color: "#172033",
                }}
              >

                {fullName}

              </Typography>


              <Typography
                sx={{
                  fontSize: ".72rem",

                  color: "#7b8494",

                  mt: 0.2,
                }}
              >

                Owner

              </Typography>

            </Box>

          </Box>

        </Box>


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

            minHeight:
              "calc(100vh - 72px)",
          }}
        >

          <Outlet />

        </Box>

      </Box>

    </Box>

  );

}


export default OwnerLayout;
