
import { useEffect, useState } from "react";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../api";

import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  MenuItem,
} from "@mui/material";

import {
  People,
  Search,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Close,
  CheckCircle,
  Cancel,
  VerifiedUser,
  PersonAdd,
  Email,
  Phone,
  CalendarMonth,
  ManageAccounts,
  LocationOn,
  Lock,
  Shield,
} from "@mui/icons-material";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =========================================
  // LOAD USERS
  // =========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getUsers();

      console.log("Users API response:", result);

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.message || "Failed to load users.");
      }
    } catch (error) {
      console.error("Users API error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.firstName?.toLowerCase().includes(searchText) ||
      user.lastName?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      String(user.mobile || "").toLowerCase().includes(searchText) ||
      user.roleName?.toLowerCase().includes(searchText) ||
      user.status?.toLowerCase().includes(searchText)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // =========================================
  // STATISTICS
  // =========================================

  const totalUsers = users.length;

  const verifiedUsers = users.filter(
    (user) => user.verified === true
  ).length;

  const unverifiedUsers = users.filter(
    (user) => user.verified !== true
  ).length;

  const activeUsers = users.filter(
    (user) => user.status?.toUpperCase() === "ACTIVE"
  ).length;

  // =========================================
  // VIEW USER
  // =========================================

  const handleView = async (id) => {
    try {
      const result = await getUserById(id);

      console.log("User details:", result);

      if (result.success) {
        setSelectedUser(result.data);
        setShowView(true);
      } else {
        window.alert(result.message || "Failed to fetch user.");
      }
    } catch (error) {
      console.error("Get user error:", error);

      window.alert(
        error.response?.data?.message ||
          "Failed to fetch user."
      );
    }
  };

  // =========================================
  // OPEN EDIT
  // =========================================

  const handleEdit = (user) => {
    setSelectedUser(user);

    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobile: user.mobile || "",
      password: "",
      address: user.address || "",
      profileImage: user.profileImage || "",
      roleId: user.roleId || "",
    });

    setShowEdit(true);
  };

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // UPDATE USER
  // =========================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!selectedUser?.id) {
      window.alert("Unable to identify the selected user.");
      return;
    }

    try {
      setSaving(true);

      const result = await updateUser(
        selectedUser.id,
        editForm
      );

      console.log("Update user response:", result);

      if (result.success) {
        window.alert("User updated successfully.");

        setShowEdit(false);
        setSelectedUser(null);

        await fetchUsers();
      } else {
        window.alert(
          result.message || "Failed to update user."
        );
      }
    } catch (error) {
      console.error("Update user error:", error);

      window.alert(
        error.response?.data?.message ||
          "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE USER
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await deleteUser(id);

      console.log("Delete user response:", result);

      if (result.success) {
        window.alert("User deleted successfully.");
        await fetchUsers();
      } else {
        window.alert(
          result.message || "Failed to delete user."
        );
      }
    } catch (error) {
      console.error("Delete user error:", error);

      window.alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // =========================================
  // HELPERS
  // =========================================

  const getUserName = (user) => {
    const name = [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return name || user?.name || "Unnamed User";
  };

  const getInitials = (user) => {
    const first = user?.firstName?.charAt(0) || "";
    const last = user?.lastName?.charAt(0) || "";

    return (first + last).toUpperCase() || "?";
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return {
          color: "#168653",
          backgroundColor: "#e8f8ef",
        };

      case "INACTIVE":
        return {
          color: "#68778d",
          backgroundColor: "#eef1f5",
        };

      case "BLOCKED":
        return {
          color: "#d32f2f",
          backgroundColor: "#ffebee",
        };

      case "PENDING":
        return {
          color: "#a66b00",
          backgroundColor: "#fff5dc",
        };

      default:
        return {
          color: "#526581",
          backgroundColor: "#edf2f7",
        };
    }
  };

  const formatDate = (date, includeTime = false) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return includeTime
      ? parsedDate.toLocaleString()
      : parsedDate.toLocaleDateString();
  };

  const statCards = [
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "All registered accounts",
      icon: <People />,
      background: "#eaf2ff",
      iconBackground: "#3769e8",
    },
    {
      title: "Active Users",
      value: activeUsers,
      subtitle: "Currently active accounts",
      icon: <CheckCircle />,
      background: "#eafaf2",
      iconBackground: "#20a464",
    },
    {
      title: "Verified Users",
      value: verifiedUsers,
      subtitle: "Verified accounts",
      icon: <VerifiedUser />,
      background: "#f3edff",
      iconBackground: "#7b4de8",
    },
    {
      title: "Unverified Users",
      value: unverifiedUsers,
      subtitle: "Awaiting verification",
      icon: <Cancel />,
      background: "#fff5e8",
      iconBackground: "#e99518",
    },
  ];

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "65vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={44} />

        <Typography color="text.secondary">
          Loading users...
        </Typography>
      </Box>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && users.length === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchUsers}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        color: "#172b4d",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.7,
            }}
          >
            <ManageAccounts
              sx={{ color: "#3769e8", fontSize: 32 }}
            />

            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: 25, md: 32 },
                fontWeight: 800,
                color: "#172b4d",
              }}
            >
              Users Management
            </Typography>
          </Box>

          <Typography color="text.secondary">
            Manage registered users, account information, and access.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Refresh Users
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* WELCOME BANNER */}

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 3, md: 3.5 },
          borderRadius: 4,
          color: "white",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(120deg, #16213e 0%, #294c83 58%, #3769e8 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -35,
            top: -75,
            width: 210,
            height: 210,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            icon={<People />}
            label="User Administration"
            sx={{
              mb: 1.5,
              color: "white",
              backgroundColor: "rgba(255,255,255,0.14)",
              "& .MuiChip-icon": { color: "white" },
              fontWeight: 600,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: 24, md: 31 },
              fontWeight: 800,
            }}
          >
            Manage Your Community
          </Typography>

          <Typography
            sx={{
              mt: 1,
              maxWidth: 650,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            View account details, search registered users, and maintain
            user information from one convenient workspace.
          </Typography>
        </Box>
      </Paper>

      {/* STATISTICS */}

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                minHeight: 155,
                height: "100%",
                borderRadius: 3,
                backgroundColor: stat.background,
                border: "1px solid rgba(0,0,0,0.04)",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 28px rgba(23,43,77,0.09)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  mb: 1.5,
                  backgroundColor: stat.iconBackground,
                }}
              >
                {stat.icon}
              </Avatar>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#43536b",
                }}
              >
                {stat.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.4,
                  fontWeight: 800,
                  color: "#172b4d",
                }}
              >
                {stat.value}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "#68778d",
                }}
              >
                {stat.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* SEARCH AND TABLE */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e7eaf0",
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#172b4d" }}
            >
              Registered Users
            </Typography>

            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ mt: 0.5 }}
            >
              Search, view, edit, or delete user records.
            </Typography>
          </Box>

          <Chip
            icon={<People />}
            label={`${filteredUsers.length} user${
              filteredUsers.length !== 1 ? "s" : ""
            }`}
            sx={{
              fontWeight: 700,
              color: "#3769e8",
              backgroundColor: "#eaf2ff",
            }}
          />
        </Box>

        <Divider />

        {/* SEARCH TOOLBAR */}

        <Box
          sx={{
            p: 2.5,
            display: "flex",
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search by name, email, mobile, role or status..."
            sx={{
              maxWidth: { sm: 520 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fbfcfe",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#718096" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="text"
            startIcon={<Refresh />}
            onClick={() => {
              setSearch("");
              setPage(0);
              fetchUsers();
            }}
            sx={{
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Reset Search
          </Button>
        </Box>

        {/* USERS TABLE */}

        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 1150 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f6f8fc",
                  "& th": {
                    color: "#526581",
                    fontWeight: 800,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    borderBottom: "1px solid #e7eaf0",
                    whiteSpace: "nowrap",
                    py: 2,
                  },
                }}
              >
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verification</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Box sx={{ py: 7 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 2,
                          color: "#718096",
                          backgroundColor: "#edf2f7",
                        }}
                      >
                        <People sx={{ fontSize: 30 }} />
                      </Avatar>

                      <Typography
                        sx={{ fontWeight: 700, color: "#243b53" }}
                      >
                        No users found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Try a different search term.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      "& td": {
                        borderBottom: "1px solid #edf0f5",
                        py: 1.7,
                      },
                      "&:hover": {
                        backgroundColor: "#fafbff",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "#718096" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ minWidth: 175 }}
                      >
                        <Avatar
                          src={user.profileImage || undefined}
                          alt={getUserName(user)}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#3769e8",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(user)}
                        </Avatar>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#243b53",
                            }}
                          >
                            {getUserName(user)}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#718096",
                            }}
                          >
                            User account
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ fontSize: 13 }}>
                      {user.email || "-"}
                    </TableCell>

                    <TableCell sx={{ fontSize: 13 }}>
                      {user.mobile || "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        icon={<Shield sx={{ fontSize: "15px !important" }} />}
                        label={user.roleName || "-"}
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#5261a8",
                          backgroundColor: "#eff0ff",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={user.status || "-"}
                        sx={{
                          ...getStatusColor(user.status),
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        icon={
                          user.verified ? (
                            <CheckCircle sx={{ fontSize: "15px !important" }} />
                          ) : (
                            <Cancel sx={{ fontSize: "15px !important" }} />
                          )
                        }
                        label={user.verified ? "Verified" : "Unverified"}
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: user.verified ? "#168653" : "#a66b00",
                          backgroundColor: user.verified
                            ? "#e8f8ef"
                            : "#fff5dc",
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 12,
                        color: "#68778d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="View user">
                          <IconButton
                            size="small"
                            onClick={() => handleView(user.id)}
                            sx={{
                              color: "#3769e8",
                              backgroundColor: "#eaf2ff",
                              "&:hover": {
                                backgroundColor: "#d8e6ff",
                              },
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit user">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user)}
                            sx={{
                              color: "#a66b00",
                              backgroundColor: "#fff5dc",
                              "&:hover": {
                                backgroundColor: "#ffedbd",
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete user">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            sx={{
                              color: "#d32f2f",
                              backgroundColor: "#ffebee",
                              "&:hover": {
                                backgroundColor: "#ffd9dd",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              px: 2,
            },
          }}
        />
      </Paper>

      {/* ===================================
          VIEW USER DIALOG
      ==================================== */}

      <Dialog
        open={showView && Boolean(selectedUser)}
        onClose={() => setShowView(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            color: "white",
            background:
              "linear-gradient(120deg, #16213e, #3769e8)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                User Details
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}
              >
                Account information and status
              </Typography>
            </Box>

            <IconButton
              onClick={() => setShowView(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        {selectedUser && (
          <>
            <DialogContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 3, mt: 1 }}
              >
                <Avatar
                  src={selectedUser.profileImage || undefined}
                  sx={{
                    width: 70,
                    height: 70,
                    backgroundColor: "#3769e8",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {getInitials(selectedUser)}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="#172b4d"
                  >
                    {getUserName(selectedUser)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {selectedUser.email || "-"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}
                  >
                    <Chip
                      size="small"
                      label={selectedUser.roleName || "No role"}
                    />

                    <Chip
                      size="small"
                      label={selectedUser.status || "Unknown"}
                      sx={getStatusColor(selectedUser.status)}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                {[
                  {
                    label: "Email Address",
                    value: selectedUser.email || "-",
                    icon: <Email />,
                  },
                  {
                    label: "Mobile Number",
                    value: selectedUser.mobile || "-",
                    icon: <Phone />,
                  },
                  {
                    label: "Address",
                    value: selectedUser.address || "-",
                    icon: <LocationOn />,
                  },
                  {
                    label: "Role",
                    value: selectedUser.roleName || "-",
                    icon: <Shield />,
                  },
                  {
                    label: "Verification",
                    value: selectedUser.verified
                      ? "Verified"
                      : "Not Verified",
                    icon: <VerifiedUser />,
                  },
                  {
                    label: "Created At",
                    value: formatDate(selectedUser.createdAt, true),
                    icon: <CalendarMonth />,
                  },
                  {
                    label: "Updated At",
                    value: formatDate(selectedUser.updatedAt, true),
                    icon: <CalendarMonth />,
                  },
                ].map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 36,
                        height: 36,
                        color: "#3769e8",
                        backgroundColor: "#eaf2ff",
                      }}
                    >
                      {item.icon}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#243b53",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button
                onClick={() => setShowView(false)}
                variant="outlined"
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  setShowView(false);
                  handleEdit(selectedUser);
                }}
                variant="contained"
                startIcon={<Edit />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ===================================
          EDIT USER DIALOG
      ==================================== */}

      <Dialog
        open={showEdit && Boolean(selectedUser)}
        onClose={() => {
          if (!saving) setShowEdit(false);
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            color: "white",
            background:
              "linear-gradient(120deg, #16213e, #3769e8)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Edit User
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}
              >
                Update the selected user's information
              </Typography>
            </Box>

            <IconButton
              disabled={saving}
              onClick={() => setShowEdit(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Box component="form" onSubmit={handleUpdate}>
          <DialogContent sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Make sure the information is correct before saving.
              The role ID must be valid for your backend.
            </Alert>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={editForm.firstName || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={editForm.lastName || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={editForm.mobile || ""}
                  onChange={handleChange}
                  inputProps={{ maxLength: 10 }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={editForm.password || ""}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  helperText="Your existing update API determines how passwords are processed."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role ID"
                  name="roleId"
                  value={editForm.roleId || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={editForm.address || ""}
                  onChange={handleChange}
                  multiline
                  minRows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="profileImage"
                  value={editForm.profileImage || ""}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              p: 2.5,
              gap: 1,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={saving}
              onClick={() => setShowEdit(false)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={
                saving ? (
                  <CircularProgress size={17} color="inherit" />
                ) : (
                  <CheckCircle />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AdminUsers;
