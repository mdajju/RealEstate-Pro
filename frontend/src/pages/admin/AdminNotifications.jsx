import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  Avatar,
  Tooltip,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";

import {
  NotificationsActive,
  NotificationsOutlined,
  MarkEmailRead,
  Delete,
  Refresh,
  Search,
  Campaign,
  CheckCircle,
  Schedule,
  InboxOutlined,
  Close,
  CalendarMonth,
  WarningAmber,
  InfoOutlined,
  Error,
} from "@mui/icons-material";

import {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api";

function AdminNotifications() {
  // =====================================================
  // STATE VARIABLES
  // =====================================================

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Delete Dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteNotificationId, setDeleteNotificationId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
  try {
    setLoading(true);

    const res = await getAllNotifications();

    console.log("Notification Response:", res.data);

    // Handle either a direct array or an API response object
    const responseData = res.data;

    if (Array.isArray(responseData)) {
      setNotifications(responseData);
    } else if (Array.isArray(responseData?.data)) {
      setNotifications(responseData.data);
    } else {
      console.error("Unexpected notifications response:", responseData);
      setNotifications([]);
    }
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // MARK AS READ
  // =====================================================

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      alert("Unable to mark notification as read.");
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeleteClick = (id) => {
    setDeleteNotificationId(id);
    setOpenDelete(true);
  };

  const handleDeleteNotification = async () => {
    try {
      await deleteNotification(deleteNotificationId);

      setOpenDelete(false);
      setDeleteNotificationId(null);

      await fetchNotifications();
    } catch (error) {
      console.error(error);
      alert("Unable to delete notification.");
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications = notifications.filter((notification) => {
    const keyword = search.toLowerCase();

    return (
      notification.title?.toLowerCase().includes(keyword) ||
      notification.message?.toLowerCase().includes(keyword) ||
      notification.type?.toLowerCase().includes(keyword)
    );
  });

  // =====================================================
  // UI HELPERS
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.read
  ).length;

  const getTypeColor = (type) => {
    const normalizedType = (type || "").toUpperCase();

    if (
      normalizedType.includes("ERROR") ||
      normalizedType.includes("FAILED")
    ) {
      return "error";
    }

    if (
      normalizedType.includes("WARNING") ||
      normalizedType.includes("ALERT")
    ) {
      return "warning";
    }

    if (
      normalizedType.includes("SUCCESS") ||
      normalizedType.includes("BOOKING")
    ) {
      return "success";
    }

    return "primary";
  };

  const getTypeIcon = (type) => {
    const normalizedType = (type || "").toUpperCase();

    if (
      normalizedType.includes("ERROR") ||
      normalizedType.includes("FAILED")
    ) {
      return <Error fontSize="small" />;
    }

    if (
      normalizedType.includes("WARNING") ||
      normalizedType.includes("ALERT")
    ) {
      return <WarningAmber fontSize="small" />;
    }

    if (
      normalizedType.includes("SUCCESS") ||
      normalizedType.includes("BOOKING")
    ) {
      return <CheckCircle fontSize="small" />;
    }

    return <InfoOutlined fontSize="small" />;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // SUMMARY CARD
  // =====================================================

  const SummaryCard = ({
    title,
    value,
    subtitle,
    icon,
    gradient,
    iconBg,
  }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: gradient,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ letterSpacing: "-1px" }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: 3,
              bgcolor: iconBg,
              color: "#fff",
              boxShadow: `0 7px 18px ${iconBg}55`,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  // =====================================================
  // JSX
  // =====================================================

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5, md: 3 },
        minHeight: "100%",
        bgcolor: "#f7f9fc",
      }}
    >
      {/* PAGE HEADER */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          borderRadius: 4,
          color: "#fff",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(120deg, #101d45 0%, #284b9b 55%, #4776d0 100%)",
          boxShadow: "0 12px 30px rgba(40, 75, 155, 0.18)",
          "&::after": {
            content: '""',
            position: "absolute",
            width: 230,
            height: 230,
            borderRadius: "50%",
            border: "35px solid rgba(255,255,255,0.07)",
            right: -65,
            top: -105,
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 54,
                  height: 54,
                  bgcolor: "rgba(255,255,255,0.17)",
                  borderRadius: 3,
                  color: "#fff",
                }}
              >
                <NotificationsActive sx={{ fontSize: 30 }} />
              </Avatar>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: "1.55rem", sm: "2rem" },
                    letterSpacing: "-0.7px",
                  }}
                >
                  Notification Center
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}
                >
                  Monitor and manage your system notifications
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 2.5 }}
            >
              <Chip
                icon={<Campaign />}
                label={`${notifications.length} Total Notifications`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  "& .MuiChip-icon": { color: "#fff" },
                  fontWeight: 600,
                }}
              />

              <Chip
                icon={<NotificationsOutlined />}
                label={`${unreadCount} Unread`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  "& .MuiChip-icon": { color: "#fff" },
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <Refresh />
              )
            }
            onClick={fetchNotifications}
            disabled={loading}
            sx={{
              flexShrink: 0,
              bgcolor: "#fff",
              color: "#24458d",
              fontWeight: 700,
              borderRadius: 2.5,
              px: 2.5,
              py: 1.2,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#eaf0ff",
                boxShadow: "none",
              },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Paper>

      {/* SUMMARY CARDS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        <SummaryCard
          title="All Notifications"
          value={notifications.length}
          subtitle="Notifications in the system"
          icon={<Campaign sx={{ fontSize: 29 }} />}
          gradient="linear-gradient(90deg, #3563d9, #6b8df2)"
          iconBg="#3563d9"
        />

        <SummaryCard
          title="Unread Notifications"
          value={unreadCount}
          subtitle="Notifications awaiting attention"
          icon={<NotificationsActive sx={{ fontSize: 29 }} />}
          gradient="linear-gradient(90deg, #ed8b18, #ffbd54)"
          iconBg="#ed8b18"
        />

        <SummaryCard
          title="Read Notifications"
          value={readCount}
          subtitle="Notifications already reviewed"
          icon={<MarkEmailRead sx={{ fontSize: 29 }} />}
          gradient="linear-gradient(90deg, #15966b, #48c79b)"
          iconBg="#15966b"
        />
      </Box>

      {/* NOTIFICATION MANAGEMENT */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "#e7ebf2",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#e9efff",
                  color: "#3158b8",
                  borderRadius: 2.5,
                }}
              >
                <InboxOutlined />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={800}>
                  All Notifications
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Search, review, and manage system alerts
                </Typography>
              </Box>
            </Stack>
          </Box>

          <TextField
            placeholder="Search title, message, or type..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 330, md: 370 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "#f8faff",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>

        <Divider />

        {/* LOADING */}

        {loading ? (
          <Box
            sx={{
              py: 9,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={42} thickness={4} />

            <Typography color="text.secondary" fontWeight={500}>
              Loading notifications...
            </Typography>
          </Box>
        ) : filteredNotifications.length === 0 ? (
          /* EMPTY STATE */

          <Box
            sx={{
              py: 9,
              px: 2,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 76,
                height: 76,
                mx: "auto",
                mb: 2,
                bgcolor: "#edf1fa",
                color: "#8291b3",
              }}
            >
              <NotificationsOutlined sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h6" fontWeight={800} gutterBottom>
              {search ? "No matching notifications" : "No notifications yet"}
            </Typography>

            <Typography color="text.secondary" variant="body2">
              {search
                ? "Try another search term to find a notification."
                : "System notifications will appear here when available."}
            </Typography>

            {search && (
              <Button
                onClick={() => setSearch("")}
                sx={{ mt: 2, fontWeight: 700 }}
              >
                Clear Search
              </Button>
            )}
          </Box>
        ) : (
          /* NOTIFICATION TABLE */

          <TableContainer>
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f6f8fc",
                    "& .MuiTableCell-head": {
                      color: "#65718a",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      py: 2,
                      borderBottom: "1px solid #e8edf5",
                    },
                  }}
                >
                  <TableCell>Notification</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredNotifications.map((notification) => {
                  const typeColor = getTypeColor(notification.type);

                  return (
                    <TableRow
                      key={notification.id}
                      hover
                      sx={{
                        transition: "background-color 0.2s ease",
                        bgcolor: notification.read
                          ? "transparent"
                          : alpha("#3563d9", 0.025),
                        "&:hover": {
                          bgcolor: alpha("#3563d9", 0.055),
                        },
                        "& .MuiTableCell-root": {
                          py: 2,
                          borderBottom: "1px solid #edf0f6",
                        },
                      }}
                    >
                      {/* TITLE */}

                      <TableCell sx={{ minWidth: 180, maxWidth: 240 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2.5,
                              bgcolor: notification.read
                                ? "#edf1f7"
                                : "#e5edff",
                              color: notification.read ? "#7b879b" : "#3158b8",
                            }}
                          >
                            {notification.read ? (
                              <MarkEmailRead fontSize="small" />
                            ) : (
                              <NotificationsActive fontSize="small" />
                            )}
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              fontWeight={notification.read ? 600 : 800}
                              variant="body2"
                              sx={{
                                overflowWrap: "anywhere",
                                color: "#26344d",
                              }}
                            >
                              {notification.title || "Untitled Notification"}
                            </Typography>

                            {!notification.read && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#3158b8",
                                  fontWeight: 700,
                                  mt: 0.4,
                                  display: "block",
                                }}
                              >
                                NEW
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* MESSAGE */}

                      <TableCell sx={{ minWidth: 220, maxWidth: 340 }}>
                        <Tooltip
                          title={notification.message || ""}
                          placement="top"
                          arrow
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              overflowWrap: "anywhere",
                              lineHeight: 1.6,
                            }}
                          >
                            {notification.message || "No message provided"}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* TYPE */}

                      <TableCell>
                        <Chip
                          icon={getTypeIcon(notification.type)}
                          label={notification.type || "GENERAL"}
                          color={typeColor}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 2,
                            maxWidth: 160,
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      </TableCell>

                      {/* STATUS */}

                      <TableCell>
                        <Chip
                          icon={
                            notification.read ? (
                              <CheckCircle />
                            ) : (
                              <Schedule />
                            )
                          }
                          label={notification.read ? "Read" : "Unread"}
                          color={notification.read ? "success" : "warning"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>

                      {/* CREATED */}

                      <TableCell sx={{ minWidth: 130 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarMonth
                            sx={{ fontSize: 17, color: "#8995aa" }}
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            {formatDate(notification.createdAt)}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* ACTIONS */}

                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                          alignItems="center"
                        >
                          {!notification.read && (
                            <Tooltip title="Mark as read">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                sx={{
                                  color: "#15966b",
                                  bgcolor: "#e8f8f1",
                                  borderRadius: 2,
                                  "&:hover": { bgcolor: "#d1f2e4" },
                                }}
                                aria-label="Mark notification as read"
                              >
                                <MarkEmailRead fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Delete notification">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteClick(notification.id)
                              }
                              sx={{
                                color: "#d32f2f",
                                bgcolor: "#fff0f0",
                                borderRadius: 2,
                                "&:hover": { bgcolor: "#ffe0e0" },
                              }}
                              aria-label="Delete notification"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* FOOTER */}

        {!loading && filteredNotifications.length > 0 && (
          <>
            <Divider />

            <Box
              sx={{
                px: 2.5,
                py: 1.8,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 1,
                bgcolor: "#fbfcfe",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Showing{" "}
                <Box
                  component="span"
                  sx={{ color: "text.primary", fontWeight: 800 }}
                >
                  {filteredNotifications.length}
                </Box>{" "}
                of{" "}
                <Box
                  component="span"
                  sx={{ color: "text.primary", fontWeight: 800 }}
                >
                  {notifications.length}
                </Box>{" "}
                notifications
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label={`${unreadCount} Unread`}
                  color="warning"
                  variant="outlined"
                />

                <Chip
                  size="small"
                  label={`${readCount} Read`}
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </>
        )}
      </Paper>

      {/* DELETE CONFIRMATION DIALOG */}

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#fff0f0",
              color: "#d32f2f",
              borderRadius: 3,
            }}
          >
            <Delete sx={{ fontSize: 28 }} />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <DialogTitle sx={{ p: 0, fontWeight: 800, fontSize: "1.2rem" }}>
              Delete Notification?
            </DialogTitle>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ px: 3, pt: 0 }}>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            Are you sure you want to permanently delete this notification from
            the system?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenDelete(false);
              setDeleteNotificationId(null);
            }}
            sx={{
              borderRadius: 2.5,
              px: 2.5,
              fontWeight: 700,
              color: "text.secondary",
              borderColor: "#dce2eb",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteNotification}
            sx={{
              borderRadius: 2.5,
              px: 2.5,
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminNotifications;