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

    setNotifications(res.data.data || []);

  } catch (error) {

    console.error(error);

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

      fetchNotifications();

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

      fetchNotifications();

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
  // JSX
  // =====================================================

  return (

    <Box p={3}>
              <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
      >
        Notification Management
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Manage all system notifications
      </Typography>

      <Paper elevation={3}>

        <Box
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <TextField
            label="Search Notification"
            size="small"
            sx={{ width: 350 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="outlined"
            onClick={fetchNotifications}
          >
            Refresh
          </Button>

        </Box>

        {loading ? (

          <Box
            display="flex"
            justifyContent="center"
            py={5}
          >
            <CircularProgress />
          </Box>

        ) : (

          <TableContainer>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell><b>Title</b></TableCell>

                  <TableCell><b>Message</b></TableCell>

                  <TableCell><b>Type</b></TableCell>

                  <TableCell><b>Status</b></TableCell>

                  <TableCell><b>Created</b></TableCell>

                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {filteredNotifications.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      align="center"
                    >
                      No Notifications Found
                    </TableCell>

                  </TableRow>

                ) : (

                  filteredNotifications.map((notification) => (

                    <TableRow
                      key={notification.id}
                      hover
                    >

                      <TableCell>
                        {notification.title}
                      </TableCell>

                      <TableCell>
                        {notification.message}
                      </TableCell>

                      <TableCell>

                        <Chip
                          label={notification.type}
                          color="primary"
                          size="small"
                        />

                      </TableCell>

                      <TableCell>

                        <Chip
                          label={
                            notification.read
                              ? "Read"
                              : "Unread"
                          }
                          color={
                            notification.read
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />

                      </TableCell>

                      <TableCell>

                        {new Date(
                          notification.createdAt
                        ).toLocaleDateString()}

                      </TableCell>

                      <TableCell align="center">

                        <Box
                          display="flex"
                          gap={1}
                          justifyContent="center"
                        >

                          {!notification.read && (

                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                handleMarkAsRead(notification.id)
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
                              handleDeleteClick(notification.id)
                            }
                          >
                            Delete
                          </Button>

                        </Box>

                      </TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Paper>
    
          {/* =======================
          DELETE DIALOG
      ======================= */}

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle>
          Delete Notification
        </DialogTitle>

        <DialogContent>

          <Typography>
            Are you sure you want to delete this notification?
          </Typography>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpenDelete(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteNotification}
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

}

export default AdminNotifications;