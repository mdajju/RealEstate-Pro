import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  HomeWork as HomeWorkIcon,
  EventNote as BookingIcon,
  Payments as PaymentsIcon,
  ReportProblem as ComplaintIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";

import { getUnreadNotificationCount } from "../api";

// =====================================================
// CONSTANTS
// =====================================================

const DRAWER_WIDTH = 270;

// =====================================================
// ADMIN LAYOUT
// =====================================================

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  // ===================================================
  // STATE
  // ===================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [unreadCount, setUnreadCount] =
    useState(0);

  // ===================================================
  // GET LOGGED-IN USER
  // ===================================================

  const getStoredUser = () => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Error reading logged-in user:",
        error
      );

      return null;
    }
  };

  const user = getStoredUser();

  // ===================================================
  // USER NAME
  // ===================================================

  const getUserName = () => {
    if (!user) {
      return "Administrator";
    }

    const fullName =
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim();

    return (
      fullName ||
      user.name ||
      user.username ||
      "Administrator"
    );
  };

  // ===================================================
  // USER ROLE
  // ===================================================

  const getUserRole = () => {
    if (!user) {
      return "ADMIN";
    }

    if (typeof user.role === "string") {
      return user.role;
    }

    if (user.role?.name) {
      return user.role.name;
    }

    if (user.roleName) {
      return user.roleName;
    }

    return "ADMIN";
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ===================================================
  // LOAD UNREAD NOTIFICATIONS
  // ===================================================

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // ===================================================
  // FETCH UNREAD COUNT
  // ===================================================

  const fetchUnreadCount = async () => {
    try {
      if (!user) {
        return;
      }

      const userId =
        user.userId ||
        user.id ||
        user._id;

      if (!userId) {
        console.error(
          "Admin user ID not found."
        );

        return;
      }

      const response =
        await getUnreadNotificationCount(
          userId
        );

      console.log(
        "Admin unread notification response:",
        response
      );

      // Backend:
      // {
      //   success: true,
      //   message: "...",
      //   data: 5
      // }

      const count =
        response?.data ??
        response?.data?.data ??
        0;

      setUnreadCount(
        Number(count) || 0
      );
    } catch (error) {
      console.error(
        "Admin notification count error:",
        error
      );

      setUnreadCount(0);
    }
  };

  // ===================================================
  // ADMIN MENU
  // ===================================================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },

    {
      label: "Users",
      path: "/admin/users",
      icon: <PeopleIcon />,
    },

    {
      label: "Properties",
      path: "/admin/properties",
      icon: <HomeWorkIcon />,
    },

    {
      label: "Bookings",
      path: "/admin/bookings",
      icon: <BookingIcon />,
    },

    {
      label: "Payments",
      path: "/admin/payments",
      icon: <PaymentsIcon />,
    },

    {
      label: "Complaints",
      path: "/admin/complaints",
      icon: <ComplaintIcon />,
    },

    {
      label: "Locations",
      path: "/admin/locations",
      icon: <LocationIcon />,
    },

    {
      label: "Notifications",
      path: "/admin/notifications",
      icon: <NotificationsIcon />,
    },
  ];

  // ===================================================
  // DRAWER CONTENT
  // ===================================================

  const drawerContent = (
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
              Administration
            </Typography>

          </Box>

        </Box>

        {/* MOBILE CLOSE */}

        {isMobile && (
          <IconButton
            onClick={() =>
              setSidebarOpen(false)
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
          ADMIN USER
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
          }}
        >

          <Avatar
            sx={{
              width: 42,
              height: 42,
              background:
                "linear-gradient(135deg,#1976d2,#00bcd4)",
              fontWeight: 800,
            }}
          >
            {getUserName()
              .charAt(0)
              .toUpperCase()}
          </Avatar>

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
                <AdminIcon
                  sx={{
                    color:
                      "#4dd0e1 !important",
                    fontSize: 16,
                  }}
                />
              }
              label={getUserRole()}
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
        ADMINISTRATION
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

          const isActive =
            location.pathname ===
              item.path ||
            location.pathname.startsWith(
              `${item.path}/`
            );

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={() => {
                if (isMobile) {
                  setSidebarOpen(false);
                }
              }}
              sx={{
                minHeight: 48,
                mb: 0.6,
                px: 1.5,
                borderRadius: 2.5,
                color: isActive
                  ? "#fff"
                  : "rgba(255,255,255,.72)",

                backgroundColor:
                  isActive
                    ? "rgba(25,118,210,.95)"
                    : "transparent",

                boxShadow:
                  isActive
                    ? "0 8px 20px rgba(0,0,0,.18)"
                    : "none",

                "&:hover": {
                  backgroundColor:
                    isActive
                      ? "rgba(25,118,210,1)"
                      : "rgba(255,255,255,.08)",
                  color: "#fff",
                },
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: isActive
                    ? "#fff"
                    : "rgba(255,255,255,.65)",
                }}
              >

                {item.path ===
                "/admin/notifications" ? (
                  <Badge
                    badgeContent={
                      unreadCount > 0
                        ? unreadCount
                        : 0
                    }
                    color="error"
                    max={99}
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
                  fontWeight: isActive
                    ? 800
                    : 600,
                  fontSize: ".92rem",
                }}
              />

              {item.path ===
                "/admin/notifications" &&
                unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    sx={{
                      height: 23,
                      minWidth: 23,
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
  // MAIN UI
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
          <Drawer
            variant="temporary"
            open={sidebarOpen}
            onClose={() =>
              setSidebarOpen(false)
            }
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                border: "none",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (

          /* DESKTOP DRAWER */

          <Drawer
            variant="permanent"
            open
            sx={{
              display: {
                xs: "none",
                md: "block",
              },

              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                border: "none",
                position: "fixed",
                height: "100vh",
              },
            }}
          >
            {drawerContent}
          </Drawer>
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
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
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
                  setSidebarOpen(true)
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
                Admin Dashboard
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
                Manage your RealEstate-Pro
                platform
              </Typography>

            </Box>

            {/* NOTIFICATION */}

            <Tooltip title="Notifications">

              <IconButton
                onClick={() =>
                  navigate(
                    "/admin/notifications"
                  )
                }
                sx={{
                  mr: 1,
                  color: "#526071",
                }}
              >

                <Badge
                  badgeContent={
                    unreadCount > 0
                      ? unreadCount
                      : 0
                  }
                  color="error"
                  max={99}
                >
                  <NotificationsIcon />
                </Badge>

              </IconButton>

            </Tooltip>

            {/* USER */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >

              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background:
                    "linear-gradient(135deg,#1976d2,#00bcd4)",
                  fontWeight: 800,
                  fontSize: ".9rem",
                }}
              >
                {getUserName()
                  .charAt(0)
                  .toUpperCase()}
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
                  {getUserRole()}
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

export default AdminLayout;