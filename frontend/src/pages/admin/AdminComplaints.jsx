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
  Chip,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
InputLabel,
Select,
MenuItem,
TextareaAutosize,
} from "@mui/material";

import {
  getAllComplaints,
  updateComplaintStatus,
} from "../../api";

function AdminComplaints() {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // View Dialog States

  const [openView, setOpenView] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);

const [status, setStatus] = useState("");

const [adminRemark, setAdminRemark] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {

    try {

      setLoading(true);

      const res = await getAllComplaints();

      setComplaints(res.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const handleViewComplaint = (complaint) => {

  setSelectedComplaint(complaint);

  setOpenView(true);

};

const handleEditComplaint = (complaint) => {

  setSelectedComplaint(complaint);

  setStatus(complaint.status);

  setAdminRemark(complaint.adminRemark || "");

  setOpenEdit(true);

};



const handleUpdateComplaint = async () => {

  try {

    await updateComplaintStatus(
      selectedComplaint.id,
      status,
      adminRemark
    );

    setOpenEdit(false);

    setSelectedComplaint(null);

    await fetchComplaints();

    alert("Complaint updated successfully.");

  } catch (error) {

    console.error(error);

    alert("Failed to update complaint.");

  }

};

  const getStatusColor = (status) => {

    switch (status) {

      case "OPEN":
        return "warning";

      case "UNDER_REVIEW":
        return "info";

      case "RESOLVED":
        return "success";

      case "REJECTED":
        return "error";

      default:
        return "default";

    }

  };

  const filteredComplaints = complaints.filter((complaint) => {

    const keyword = search.toLowerCase();

    return (

      complaint.title?.toLowerCase().includes(keyword) ||

      complaint.userId?.toLowerCase().includes(keyword) ||

      complaint.propertyId?.toLowerCase().includes(keyword) ||

      complaint.status?.toLowerCase().includes(keyword)

    );

  });

  if (loading) {

    return (

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>

    );

  }

  return (

    <Box p={3}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
      >
        Complaint Management
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Manage all complaints submitted by users.
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >

        <TextField
          label="Search Complaints"
          variant="outlined"
          size="small"
          sx={{ width: 350 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={fetchComplaints}
        >
          Refresh
        </Button>

      </Box>

      <Paper elevation={3}>

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <b>Title</b>
                </TableCell>

                <TableCell>
                  <b>Status</b>
                </TableCell>

                <TableCell>
                  <b>User</b>
                </TableCell>

                <TableCell>
                  <b>Property</b>
                </TableCell>

                <TableCell>
                  <b>Created</b>
                </TableCell>

                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {filteredComplaints.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    No Complaints Found
                  </TableCell>

                </TableRow>

              ) : (

                filteredComplaints.map((complaint) => (

                  <TableRow
                    key={complaint.id}
                    hover
                  >

                    <TableCell>
                      {complaint.title}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={complaint.status}
                        color={getStatusColor(
                          complaint.status
                        )}
                      />

                    </TableCell>

                    <TableCell>
                      {complaint.userId}
                    </TableCell>

                    <TableCell>
                      {complaint.propertyId}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell align="center">

                     <Box
  display="flex"
  gap={1}
  justifyContent="center"
>

  <Button
    variant="outlined"
    size="small"
    onClick={() => handleViewComplaint(complaint)}
  >
    View
  </Button>

  <Button
    variant="contained"
    size="small"
    onClick={() => handleEditComplaint(complaint)}
  >
    Edit
  </Button>

</Box>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>
            {/* ===========================
          VIEW COMPLAINT DIALOG
      ============================ */}


      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Complaint Details
        </DialogTitle>

        <DialogContent dividers>

          {selectedComplaint && (

            <Box>

              <Typography mb={2}>
                <strong>Complaint ID :</strong>
                <br />
                {selectedComplaint.id}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography mb={2}>
                <strong>Title :</strong>
                <br />
                {selectedComplaint.title}
              </Typography>

              <Typography mb={2}>
                <strong>Description :</strong>
                <br />
                {selectedComplaint.description}
              </Typography>

              <Typography mb={2}>
                <strong>User ID :</strong>
                <br />
                {selectedComplaint.userId}
              </Typography>

              <Typography mb={2}>
                <strong>Against User :</strong>
                <br />
                {selectedComplaint.againstUserId}
              </Typography>

              <Typography mb={2}>
                <strong>Property ID :</strong>
                <br />
                {selectedComplaint.propertyId}
              </Typography>

              <Typography mb={2}>
                <strong>Status :</strong>

                <Chip
                  sx={{ ml: 2 }}
                  label={selectedComplaint.status}
                  color={getStatusColor(selectedComplaint.status)}
                />
              </Typography>

              <Typography mb={2}>
                <strong>Admin Remark :</strong>
                <br />
                {selectedComplaint.adminRemark || "-"}
              </Typography>

              <Typography mb={2}>
                <strong>Created At :</strong>
                <br />
                {selectedComplaint.createdAt
                  ? new Date(selectedComplaint.createdAt).toLocaleString()
                  : "-"}
              </Typography>

              <Typography mb={2}>
                <strong>Updated At :</strong>
                <br />
                {selectedComplaint.updatedAt
                  ? new Date(selectedComplaint.updatedAt).toLocaleString()
                  : "-"}
              </Typography>

            </Box>

          )}

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpenView(false)}
            variant="contained"
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

{/* =========================================
    UPDATE COMPLAINT DIALOG
========================================= */}

<Dialog
  open={openEdit}
  onClose={() => setOpenEdit(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>
    Update Complaint
  </DialogTitle>

  <DialogContent dividers>

    <FormControl
      fullWidth
      sx={{ mt: 2 }}
    >
      <InputLabel>
        Status
      </InputLabel>

      <Select
        value={status}
        label="Status"
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <MenuItem value="OPEN">
          OPEN
        </MenuItem>

        <MenuItem value="UNDER_REVIEW">
          UNDER REVIEW
        </MenuItem>

        <MenuItem value="RESOLVED">
          RESOLVED
        </MenuItem>

        <MenuItem value="REJECTED">
          REJECTED
        </MenuItem>

      </Select>

    </FormControl>

    <Typography
      mt={3}
      mb={1}
      fontWeight="bold"
    >
      Admin Remark
    </Typography>

    <TextareaAutosize
      minRows={5}
      value={adminRemark}
      onChange={(e) =>
        setAdminRemark(e.target.value)
      }
      placeholder="Enter admin remark..."
      style={{
        width: "100%",
        padding: "12px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />

  </DialogContent>

  <DialogActions>

    <Button
      color="inherit"
      onClick={() =>
        setOpenEdit(false)
      }
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      color="primary"
      onClick={handleUpdateComplaint}
    >
      Save
    </Button>

  </DialogActions>

</Dialog>







    </Box>

  );

}

export default AdminComplaints;