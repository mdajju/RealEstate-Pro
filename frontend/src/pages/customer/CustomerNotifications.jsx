
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
} from "@mui/material";

import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api";


// =====================================================
// CUSTOMER NOTIFICATIONS
// =====================================================

function CustomerNotifications() {

  // =====================================================
  // STATE
  // =====================================================

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Delete dialog
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteNotificationId, setDeleteNotificationId] =
    useState(null);


  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getLoggedInUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (error) {

      console.error(
        "Unable to read logged-in user:",
        error
      );

      return null;

    }

  };


  const user = getLoggedInUser();


  // =====================================================
  // GET CUSTOMER ID
  // =====================================================

  const userId =
    user?.id ||
    user?.userId ||
    user?._id;


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {

    if (userId) {

      fetchNotifications();

    } else {

      setLoading(false);

    }

  }, [userId]);


  // =====================================================
  // FETCH CUSTOMER NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {

    try {

      setLoading(true);

      const response =
        await getUserNotifications(userId);

      console.log(
        "Customer Notifications:",
        response
      );

      /*
       * API response:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: [...]
       * }
       */

      const notificationData =
        response?.data || [];

      if (Array.isArray(notificationData)) {

        setNotifications(
          notificationData
        );

      } else {

        setNotifications([]);

      }

    } catch (error) {

      console.error(
        "Error fetching customer notifications:",
        error
      );

      setNotifications([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // MARK NOTIFICATION AS READ
  // =====================================================

  const handleMarkAsRead = async (
    notificationId
  ) => {

    try {

      await markNotificationAsRead(
        notificationId
      );

      await fetchNotifications();

    } catch (error) {

      console.error(
        "Error marking notification as read:",
        error
      );

      alert(
        "Unable to mark notification as read."
      );

    }

  };


  // =====================================================
  // OPEN DELETE DIALOG
  // =====================================================

  const handleDeleteClick = (
    notificationId
  ) => {

    setDeleteNotificationId(
      notificationId
    );

    setOpenDelete(true);

  };


  // =====================================================
  // CLOSE DELETE DIALOG
  // =====================================================

  const handleCloseDeleteDialog = () => {

    setOpenDelete(false);

    setDeleteNotificationId(null);

  };


  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleDeleteNotification = async () => {

    if (!deleteNotificationId) {
      return;
    }

    try {

      await deleteNotification(
        deleteNotificationId
      );

      handleCloseDeleteDialog();

      await fetchNotifications();

    } catch (error) {

      console.error(
        "Error deleting notification:",
        error
      );

      alert(
        "Unable to delete notification."
      );

    }

  };


  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredNotifications =
    notifications.filter(
      (notification) => {

        const keyword =
          search.trim().toLowerCase();

        if (!keyword) {
          return true;
        }

        const title =
          notification.title
            ?.toLowerCase() || "";

        const message =
          notification.message
            ?.toLowerCase() || "";

        const type =
          notification.type
            ?.toLowerCase() || "";

        return (
          title.includes(keyword) ||
          message.includes(keyword) ||
          type.includes(keyword)
        );

      }
    );


  // =====================================================
  // NO CUSTOMER FOUND
  // =====================================================

  if (!userId) {

    return (

      <Box p={3}>

        <Paper
          elevation={3}
          sx={{ p: 4 }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
          >
            Customer Information Not Found
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Please login again to view your
            notifications.
          </Typography>

          <Button
            variant="contained"
            href="/login"
          >
            Go To Login
          </Button>

        </Paper>

      </Box>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <Box p={3}>

      {/* ===============================================
          PAGE HEADER
      =============================================== */}

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
      >
        My Notifications
      </Typography>


      <Typography
        color="text.secondary"
        mb={3}
      >
        View and manage your notifications
      </Typography>


      {/* ===============================================
          NOTIFICATION CARD
      =============================================== */}

      <Paper elevation={3}>

        {/* =============================================
            SEARCH + REFRESH
        ============================================= */}

        <Box
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >

          <TextField
            label="Search Notification"
            size="small"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            sx={{
              width: 350,
            }}
          />


          <Button
            variant="outlined"
            onClick={fetchNotifications}
          >
            Refresh
          </Button>

        </Box>


        {/* =============================================
            LOADING
        ============================================= */}

        {loading ? (

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >

            <CircularProgress />

          </Box>

        ) : (

          <TableContainer>

            <Table>

              {/* =======================================
                  TABLE HEADER
              ======================================= */}

              <TableHead>

                <TableRow>

                  <TableCell>
                    <b>Title</b>
                  </TableCell>

                  <TableCell>
                    <b>Message</b>
                  </TableCell>

                  <TableCell>
                    <b>Type</b>
                  </TableCell>

                  <TableCell>
                    <b>Status</b>
                  </TableCell>

                  <TableCell>
                    <b>Created</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>

                </TableRow>

              </TableHead>


              {/* =======================================
                  TABLE BODY
              ======================================= */}

              <TableBody>

                {filteredNotifications.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      align="center"
                    >

                      <Typography
                        color="text.secondary"
                        py={3}
                      >
                        No Notifications Found
                      </Typography>

                    </TableCell>

                  </TableRow>

                ) : (

                  filteredNotifications.map(
                    (notification) => {

                      const notificationId =
                        notification.id ||
                        notification._id;

                      const isRead =
                        notification.read === true ||
                        notification.isRead === true;

                      return (

                        <TableRow
                          key={notificationId}
                          hover
                        >

                          {/* =================================
                              TITLE
                          ================================= */}

                          <TableCell>

                            <Typography
                              fontWeight={
                                isRead
                                  ? "normal"
                                  : "bold"
                              }
                            >
                              {notification.title ||
                                "Notification"}
                            </Typography>

                          </TableCell>


                          {/* =================================
                              MESSAGE
                          ================================= */}

                          <TableCell>

                            {notification.message ||
                              "-"}

                          </TableCell>


                          {/* =================================
                              TYPE
                          ================================= */}

                          <TableCell>

                            <Chip
                              label={
                                notification.type ||
                                "GENERAL"
                              }
                              color="primary"
                              size="small"
                            />

                          </TableCell>


                          {/* =================================
                              STATUS
                          ================================= */}

                          <TableCell>

                            <Chip
                              label={
                                isRead
                                  ? "Read"
                                  : "Unread"
                              }
                              color={
                                isRead
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />

                          </TableCell>


                          {/* =================================
                              CREATED
                          ================================= */}

                          <TableCell>

                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                              : "-"}

                          </TableCell>


                          {/* =================================
                              ACTIONS
                          ================================= */}

                          <TableCell align="center">

                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              gap={1}
                            >

                              {!isRead && (

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    handleMarkAsRead(
                                      notificationId
                                    )
                                  }
                                >
                                  Mark Read
                                </Button>

                              )}


                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDeleteClick(
                                    notificationId
                                  )
                                }
                              >
                                Delete
                              </Button>

                            </Box>

                          </TableCell>

                        </TableRow>

                      );

                    }
                  )

                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Paper>


      {/* ===============================================
          DELETE CONFIRMATION DIALOG
      =============================================== */}

      <Dialog
        open={openDelete}
        onClose={
          handleCloseDeleteDialog
        }
      >

        <DialogTitle>
          Delete Notification
        </DialogTitle>


        <DialogContent>

          <Typography>
            Are you sure you want to delete
            this notification?
          </Typography>

        </DialogContent>


        <DialogActions>

          <Button
            onClick={
              handleCloseDeleteDialog
            }
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            color="error"
            onClick={
              handleDeleteNotification
            }
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

}


export default CustomerNotifications;
