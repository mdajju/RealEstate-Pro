import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Badge,
} from "@mui/material";

import {
  Notifications,
  NotificationsNone,
  Done,
  DoneAll,
  Delete,
  Refresh,
  Search,
  EventAvailable,
  Payment,
  HomeWork,
  Message,
  ReportProblem,
  Star,
  Info,
  CheckCircle,
  Cancel,
  Close,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api";


// =====================================================
// OWNER NOTIFICATIONS
// =====================================================

function OwnerNotifications() {

  const navigate = useNavigate();


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
      "Unable to read user from localStorage:",
      error
    );

  }


  const ownerId =
    user.id ||
    user.userId;


  // =====================================================
  // STATE
  // =====================================================

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [processingId, setProcessingId] =
    useState(null);


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {

    if (!ownerId) {

      setError(
        "Owner information not found. Please login again."
      );

      setLoading(false);

      return;
    }


    try {

      setLoading(true);

      setError("");


      const response =
        await getUserNotifications(ownerId);


      console.log(
        "OWNER NOTIFICATIONS RESPONSE:",
        response
      );


      const data =
        response?.data?.data ??
        response?.data ??
        [];


      setNotifications(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err) {

      console.error(
        "OWNER NOTIFICATIONS ERROR:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to load notifications."
      );


      setNotifications([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadNotifications();

  }, [ownerId]);


  // =====================================================
  // COUNTS
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.read === false
    ).length;


  const readCount =
    notifications.filter(
      (notification) =>
        notification.read === true
    ).length;


  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredNotifications =
    useMemo(() => {

      return notifications.filter(
        (notification) => {

          const matchesFilter =
            filter === "ALL" ||
            (
              filter === "UNREAD" &&
              notification.read === false
            ) ||
            (
              filter === "READ" &&
              notification.read === true
            );


          const search =
            searchText
              .trim()
              .toLowerCase();


          const matchesSearch =
            !search ||
            notification.title
              ?.toLowerCase()
              .includes(search) ||
            notification.message
              ?.toLowerCase()
              .includes(search) ||
            notification.type
              ?.toLowerCase()
              .includes(search);


          return (
            matchesFilter &&
            matchesSearch
          );

        }
      );

    }, [
      notifications,
      filter,
      searchText,
    ]);


  // =====================================================
  // MARK AS READ
  // =====================================================

  const handleMarkAsRead = async (
    notification
  ) => {

    if (
      !notification?.id ||
      notification.read === true
    ) {
      return;
    }


    try {

      setProcessingId(
        notification.id
      );


      await markNotificationAsRead(
        notification.id
      );


      setNotifications(
        (previous) =>
          previous.map(
            (item) =>
              item.id === notification.id
                ? {
                    ...item,
                    read: true,
                  }
                : item
          )
      );


    } catch (err) {

      console.error(
        "Mark notification as read error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to mark notification as read."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead = async () => {

    const unreadNotifications =
      notifications.filter(
        (notification) =>
          notification.read === false
      );


    if (
      unreadNotifications.length === 0
    ) {
      return;
    }


    try {

      for (
        const notification
        of unreadNotifications
      ) {

        await markNotificationAsRead(
          notification.id
        );

      }


      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );


    } catch (err) {

      console.error(
        "Mark all notifications error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to mark all notifications as read."
      );

    }

  };


  // =====================================================
  // OPEN DELETE DIALOG
  // =====================================================

  const openDeleteDialog = (
    notification
  ) => {

    setSelectedNotification(
      notification
    );

    setDeleteDialogOpen(true);

  };


  // =====================================================
  // CLOSE DELETE DIALOG
  // =====================================================

  const closeDeleteDialog = () => {

    if (processingId) {
      return;
    }

    setDeleteDialogOpen(false);

    setSelectedNotification(null);

  };


  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleDelete = async () => {

    if (
      !selectedNotification?.id
    ) {
      return;
    }


    try {

      setProcessingId(
        selectedNotification.id
      );


      await deleteNotification(
        selectedNotification.id
      );


      setNotifications(
        (previous) =>
          previous.filter(
            (notification) =>
              notification.id !==
              selectedNotification.id
          )
      );


      setDeleteDialogOpen(false);

      setSelectedNotification(null);


    } catch (err) {

      console.error(
        "Delete notification error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to delete notification."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (
    type
  ) => {

    switch (
      String(type || "")
        .toUpperCase()
    ) {

      case "BOOKING":
      case "BOOKING_ACCEPTED":
      case "BOOKING_REJECTED":
      case "BOOKING_COMPLETED":

        return (
          <EventAvailable />
        );


      case "PAYMENT":
      case "PAYMENT_SUCCESS":
      case "PAYMENT_FAILED":

        return (
          <Payment />
        );


      case "PROPERTY":

        return (
          <HomeWork />
        );


      case "INQUIRY":

        return (
          <Message />
        );


      case "COMPLAINT":

        return (
          <ReportProblem />
        );


      case "REVIEW":

        return (
          <Star />
        );


      default:

        return (
          <Notifications />
        );

    }

  };


  // =====================================================
  // NOTIFICATION COLOR
  // =====================================================

  const getNotificationColor = (
    type
  ) => {

    switch (
      String(type || "")
        .toUpperCase()
    ) {

      case "BOOKING":
      case "BOOKING_ACCEPTED":
      case "BOOKING_REJECTED":
      case "BOOKING_COMPLETED":

        return "#2563eb";


      case "PAYMENT":
      case "PAYMENT_SUCCESS":

        return "#16a34a";


      case "PAYMENT_FAILED":

        return "#dc2626";


      case "INQUIRY":

        return "#9333ea";


      case "COMPLAINT":

        return "#ea580c";


      case "REVIEW":

        return "#ca8a04";


      default:

        return "#3769e8";

    }

  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "Unknown date";
    }


    try {

      return new Date(date)
        .toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );

    } catch (error) {

      return date;

    }

  };


  // =====================================================
  // REFERENCE NAVIGATION
  // =====================================================

  const handleNotificationClick = async (
    notification
  ) => {

    // Mark unread notification as read
    if (
      notification.read === false
    ) {

      await handleMarkAsRead(
        notification
      );

    }


    /*
     * We intentionally do not force navigation
     * based on referenceId because notification
     * types can point to different modules.
     *
     * The notification itself remains visible
     * and can be handled from the related module.
     */

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >

        <CircularProgress />

        <Typography
          color="text.secondary"
        >
          Loading owner notifications...
        </Typography>

      </Box>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <Box
      sx={{
        width: "100%",
      }}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              color: "#172554",
              mb: 0.5,
            }}
          >
            Owner Notifications
          </Typography>


          <Typography
            color="text.secondary"
          >
            Stay updated with your properties,
            bookings, inquiries and payments.
          </Typography>

        </Box>


        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          <Tooltip title="Refresh">

            <IconButton
              onClick={loadNotifications}
              sx={{
                border:
                  "1px solid #dbe2ea",
                backgroundColor: "white",
              }}
            >

              <Refresh />

            </IconButton>

          </Tooltip>


          <Button
            variant="contained"
            startIcon={<DoneAll />}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#3769e8",
              "&:hover": {
                backgroundColor: "#2855c7",
              },
            }}
          >
            Mark All as Read
          </Button>

        </Box>

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >

        {/* ALL */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Avatar
                sx={{
                  backgroundColor:
                    "#e8efff",
                  color: "#3769e8",
                }}
              >
                <Notifications />
              </Avatar>


              <Box>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                >
                  Total Notifications
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="700"
                >
                  {notifications.length}
                </Typography>

              </Box>

            </Box>

          </CardContent>

        </Card>


        {/* UNREAD */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Avatar
                sx={{
                  backgroundColor:
                    "#fee2e2",
                  color: "#dc2626",
                }}
              >

                <Badge
                  badgeContent={
                    unreadCount
                  }
                  color="error"
                >

                  <NotificationsNone />

                </Badge>

              </Avatar>


              <Box>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                >
                  Unread
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="700"
                  color="#dc2626"
                >
                  {unreadCount}
                </Typography>

              </Box>

            </Box>

          </CardContent>

        </Card>


        {/* READ */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Avatar
                sx={{
                  backgroundColor:
                    "#dcfce7",
                  color: "#16a34a",
                }}
              >

                <CheckCircle />

              </Avatar>


              <Box>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                >
                  Read
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="700"
                  color="#16a34a"
                >
                  {readCount}
                </Typography>

              </Box>

            </Box>

          </CardContent>

        </Card>

      </Box>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid #e5e7eb",
          borderRadius: 3,
          mb: 3,
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr",
              },
              gap: 2,
            }}
          >

            <TextField
              fullWidth
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search notifications..."
              InputProps={{
                startAdornment: (
                  <Search
                    sx={{
                      mr: 1,
                      color:
                        "text.secondary",
                    }}
                  />
                ),
              }}
            />


            <TextField
              select
              fullWidth
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
              label="Filter"
            >

              <MenuItem value="ALL">
                All Notifications
              </MenuItem>

              <MenuItem value="UNREAD">
                Unread
              </MenuItem>

              <MenuItem value="READ">
                Read
              </MenuItem>

            </TextField>

          </Box>

        </CardContent>

      </Card>


      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      {filteredNotifications.length === 0 ? (

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Box
              sx={{
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
              }}
            >

              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor:
                    "#eef2ff",
                  color: "#3769e8",
                  mb: 1,
                }}
              >

                <NotificationsNone
                  sx={{
                    fontSize: 34,
                  }}
                />

              </Avatar>


              <Typography
                variant="h6"
                fontWeight="600"
              >
                No Notifications Found
              </Typography>


              <Typography
                color="text.secondary"
              >
                {searchText ||
                filter !== "ALL"
                  ? "No notifications match your current search or filter."
                  : "You don't have any notifications yet."}
              </Typography>

            </Box>

          </CardContent>

        </Card>

      ) : (

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >

          {filteredNotifications.map(
            (notification) => {

              const iconColor =
                getNotificationColor(
                  notification.type
                );


              const isUnread =
                notification.read === false;


              const isProcessing =
                processingId ===
                notification.id;


              return (

                <Card
                  key={notification.id}
                  elevation={0}
                  sx={{
                    border:
                      isUnread
                        ? "1px solid #bfdbfe"
                        : "1px solid #e5e7eb",

                    borderRadius: 3,

                    backgroundColor:
                      isUnread
                        ? "#f8fbff"
                        : "white",

                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      boxShadow:
                        "0 6px 20px rgba(0,0,0,0.08)",
                      transform:
                        "translateY(-1px)",
                    },
                  }}
                >

                  <CardContent>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                      }}
                    >

                      {/* =================================================
                          ICON
                      ================================================= */}

                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          flexShrink: 0,
                          backgroundColor:
                            `${iconColor}15`,
                          color:
                            iconColor,
                        }}
                      >

                        {getNotificationIcon(
                          notification.type
                        )}

                      </Avatar>


                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                      >

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                            mb: 0.5,
                          }}
                        >

                          <Typography
                            fontWeight={
                              isUnread
                                ? 700
                                : 600
                            }
                            fontSize={17}
                          >
                            {notification.title ||
                              "Notification"}
                          </Typography>


                          {isUnread && (

                            <Chip
                              label="NEW"
                              size="small"
                              color="primary"
                              sx={{
                                height: 22,
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            />

                          )}

                        </Box>


                        <Typography
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            mb: 1,
                          }}
                        >
                          {notification.message ||
                            "No message available."}
                        </Typography>


                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >

                          {notification.type && (

                            <Chip
                              label={
                                notification.type
                              }
                              size="small"
                              variant="outlined"
                              sx={{
                                textTransform:
                                  "capitalize",
                              }}
                            />

                          )}


                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDate(
                              notification.createdAt
                            )}
                          </Typography>

                        </Box>

                      </Box>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexShrink: 0,
                        }}
                      >

                        {isUnread && (

                          <Tooltip
                            title="Mark as read"
                          >

                            <span>

                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleMarkAsRead(
                                    notification
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                              >

                                {isProcessing ? (

                                  <CircularProgress
                                    size={20}
                                  />

                                ) : (

                                  <Done />

                                )}

                              </IconButton>

                            </span>

                          </Tooltip>

                        )}


                        {!isUnread && (

                          <Tooltip
                            title="Read"
                          >

                            <IconButton
                              disabled
                              sx={{
                                color:
                                  "#16a34a",
                              }}
                            >

                              <DoneAll />

                            </IconButton>

                          </Tooltip>

                        )}


                        <Tooltip
                          title="Delete"
                        >

                          <IconButton
                            color="error"
                            onClick={() =>
                              openDeleteDialog(
                                notification
                              )
                            }
                            disabled={
                              isProcessing
                            }
                          >

                            <Delete />

                          </IconButton>

                        </Tooltip>

                      </Box>

                    </Box>

                  </CardContent>

                </Card>

              );

            }
          )}

        </Box>

      )}


      {/* =================================================
          DELETE CONFIRMATION DIALOG
      ================================================= */}

      <Dialog
        open={deleteDialogOpen}
        onClose={
          closeDeleteDialog
        }
        maxWidth="xs"
        fullWidth
      >

        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Delete Notification
        </DialogTitle>


        <DialogContent>

          <DialogContentText>

            Are you sure you want to delete this
            notification?

            <br />

            <strong>
              This action cannot be undone.
            </strong>

          </DialogContentText>

        </DialogContent>


        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >

          <Button
            onClick={
              closeDeleteDialog
            }
            startIcon={<Close />}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            startIcon={<Delete />}
            disabled={
              Boolean(processingId)
            }
            sx={{
              textTransform: "none",
            }}
          >

            {processingId ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              "Delete"
            )}

          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

}


export default OwnerNotifications;