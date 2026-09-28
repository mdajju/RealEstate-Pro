import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";

import {
  getAllStates,
  createState,
  updateState,
  deleteState,
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} from "../../api";

function AdminLocations() {

  // =====================================================
  // TAB
  // =====================================================

  const [tab, setTab] = useState(0);

  // =====================================================
  // STATES
  // =====================================================

  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add State

  const [openAdd, setOpenAdd] = useState(false);
  const [stateName, setStateName] = useState("");
  const [active, setActive] = useState(true);

  // Edit State

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  // Delete State

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteStateId, setDeleteStateId] = useState(null);

  // =====================================================
  // CITIES
  // =====================================================

  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const [openAddCity, setOpenAddCity] = useState(false);

  const [cityName, setCityName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [cityActive, setCityActive] = useState(true);

  const [openEditCity, setOpenEditCity] = useState(false);

const [selectedCity, setSelectedCity] = useState(null);

const [openDeleteCity, setOpenDeleteCity] = useState(false);
const [deleteCityId, setDeleteCityId] = useState(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    fetchStates();
    fetchCities();

  }, []);

  // =====================================================
  // FETCH STATES
  // =====================================================

  const fetchStates = async () => {

    try {

      setLoading(true);

      const res = await getAllStates();

      setStates(res.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // FETCH CITIES
  // =====================================================

  const fetchCities = async () => {

    try {

      setCityLoading(true);

      const res = await getAllCities();

      setCities(res.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setCityLoading(false);

    }

  };

  // =====================================================
  // CREATE STATE
  // =====================================================

  const handleCreateState = async () => {

    try {

      await createState({
        stateName,
        active,
      });

      setOpenAdd(false);
      setStateName("");
      setActive(true);

      fetchStates();

    } catch (err) {

      console.error(err);
      alert("Unable to create state");

    }

  };

  // =====================================================
  // EDIT STATE
  // =====================================================

  const handleEditClick = (state) => {

    setSelectedState(state);
    setStateName(state.stateName);
    setActive(state.active);

    setOpenEdit(true);

  };

  const handleUpdateState = async () => {

    try {

      await updateState(selectedState.id, {
        stateName,
        active,
      });

      setOpenEdit(false);
      setSelectedState(null);
      setStateName("");
      setActive(true);

      fetchStates();

    } catch (err) {

      console.error(err);
      alert("Unable to update state");

    }

  };

  // =====================================================
  // DELETE STATE
  // =====================================================

  const handleDeleteClick = (id) => {

    setDeleteStateId(id);
    setOpenDelete(true);

  };

  const handleDeleteState = async () => {

    try {

      await deleteState(deleteStateId);

      setOpenDelete(false);
      setDeleteStateId(null);

      fetchStates();

    } catch (err) {

      console.error(err);
      alert("Unable to delete state");

    }

  };

  // =====================================================
  // CREATE CITY
  // =====================================================

  const handleCreateCity = async () => {

    try {

      await createCity({

        cityName,
        stateId: selectedStateId,
        active: cityActive,

      });

      setOpenAddCity(false);

      setCityName("");
      setSelectedStateId("");
      setCityActive(true);

      fetchCities();

    } catch (err) {

      console.error(err);
      alert("Unable to create city");

    }

  };


  const handleEditCityClick = (city) => {

  setSelectedCity(city);

  setCityName(city.cityName);

  setSelectedStateId(city.stateId);

  setCityActive(city.active);

  setOpenEditCity(true);

};

const handleUpdateCity = async () => {

  try {

    await updateCity(selectedCity.id, {

      cityName,

      stateId: selectedStateId,

      active: cityActive,

    });

    setOpenEditCity(false);

    setSelectedCity(null);

    setCityName("");

    setSelectedStateId("");

    setCityActive(true);

    fetchCities();

  } catch (error) {

    console.error(error);

    alert("Unable to update city.");

  }

};

// =====================================================
// DELETE CITY
// =====================================================

const handleDeleteCityClick = (id) => {

  setDeleteCityId(id);
  setOpenDeleteCity(true);

};

const handleDeleteCity = async () => {

  try {

    await deleteCity(deleteCityId);

    setOpenDeleteCity(false);
    setDeleteCityId(null);

    fetchCities();

  } catch (error) {

    console.error(error);
    alert("Unable to delete city.");

  }

};

  // =====================================================
  // FILTERS
  // =====================================================

  const filteredStates = states.filter((state) =>
    state.stateName?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = cities.filter((city) => {

    const keyword = citySearch.toLowerCase();

    return (
      city.cityName?.toLowerCase().includes(keyword) ||
      city.stateName?.toLowerCase().includes(keyword)
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
        Location Management
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Manage States and Cities
      </Typography>

      <Paper elevation={3}>

        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
        >
          <Tab label="States" />
          <Tab label="Cities" />
        </Tabs>

        <Box p={3}>

          {/* =====================================================
              STATES TAB
          ===================================================== */}

          {tab === 0 && (

            <>
                          <Box
                display="flex"
                justifyContent="space-between"
                mb={3}
              >
                <TextField
                  label="Search State"
                  size="small"
                  sx={{ width: 300 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenAdd(true)}
                  >
                    Add State
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={fetchStates}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  mt={5}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Paper elevation={3}>
                  <TableContainer>
                    <Table>

                      <TableHead>

                        <TableRow>

                          <TableCell>
                            <b>State</b>
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

                      <TableBody>

                        {filteredStates.length === 0 ? (

                          <TableRow>

                            <TableCell
                              colSpan={4}
                              align="center"
                            >
                              No States Found
                            </TableCell>

                          </TableRow>

                        ) : (

                          filteredStates.map((state) => (

                            <TableRow
                              key={state.id}
                              hover
                            >

                              <TableCell>
                                {state.stateName}
                              </TableCell>

                              <TableCell>

                                <Chip
                                  label={
                                    state.active
                                      ? "Active"
                                      : "Inactive"
                                  }
                                  color={
                                    state.active
                                      ? "success"
                                      : "default"
                                  }
                                />

                              </TableCell>

                              <TableCell>
                                {new Date(
                                  state.createdAt
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
    onClick={() => handleEditClick(state)}
  >
    Edit
  </Button>

  <Button
    variant="contained"
    color="error"
    size="small"
    onClick={() => handleDeleteClick(state.id)}
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
                </Paper>
              )}

            </>

          )}

          {/* =====================================================
              CITIES TAB
          ===================================================== */}

          {tab === 1 && (

            <>

              <Box
                display="flex"
                justifyContent="space-between"
                mb={3}
              >

                <TextField
                  label="Search City"
                  size="small"
                  sx={{ width: 300 }}
                  value={citySearch}
                  onChange={(e) =>
                    setCitySearch(e.target.value)
                  }
                />

                <Box display="flex" gap={2}>

                  <Button
                    variant="contained"
                    onClick={() =>
                      setOpenAddCity(true)
                    }
                  >
                    Add City
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={fetchCities}
                  >
                    Refresh
                  </Button>

                </Box>

              </Box>

              {cityLoading ? (

                <Box
                  display="flex"
                  justifyContent="center"
                  mt={5}
                >
                  <CircularProgress />
                </Box>

              ) : (

                <Paper elevation={3}>

                  <TableContainer>

                    <Table>

                      <TableHead>

                        <TableRow>

                          <TableCell>
                            <b>City</b>
                          </TableCell>

                          <TableCell>
                            <b>State</b>
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

                      <TableBody>

                        {filteredCities.length === 0 ? (

                          <TableRow>

                            <TableCell
                              colSpan={5}
                              align="center"
                            >
                              No Cities Found
                            </TableCell>

                          </TableRow>

                        ) : (

                          filteredCities.map((city) => (

                            <TableRow
                              key={city.id}
                              hover
                            >

                              <TableCell>
                                {city.cityName}
                              </TableCell>

                              <TableCell>
                                {city.stateName}
                              </TableCell>

                              <TableCell>

                                <Chip
                                  label={
                                    city.active
                                      ? "Active"
                                      : "Inactive"
                                  }
                                  color={
                                    city.active
                                      ? "success"
                                      : "default"
                                  }
                                />

                              </TableCell>

                              <TableCell>
                                {new Date(
                                  city.createdAt
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
      onClick={() => handleEditCityClick(city)}
    >
      Edit
    </Button>

    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => handleDeleteCityClick(city.id)}
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

                </Paper>

              )}

            </>

          )}

        </Box>

      </Paper>

      {/* =======================
          ADD STATE DIALOG
      ======================= */}

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">

        <DialogTitle>Add State</DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="State Name"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            }
            label="Active"
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpenAdd(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateState}
          >
            Save
          </Button>

        </DialogActions>

      </Dialog>

      {/* =======================
          EDIT STATE DIALOG
      ======================= */}

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">

        <DialogTitle>Edit State</DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="State Name"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            }
            label="Active"
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpenEdit(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateState}
          >
            Update
          </Button>

        </DialogActions>

      </Dialog>

      {/* =======================
          DELETE STATE DIALOG
      ======================= */}

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >

        <DialogTitle>
          Delete State
        </DialogTitle>

        <DialogContent>

          <Typography>
            Are you sure you want to delete this state?
          </Typography>

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteState}
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>

      {/* =======================
          ADD CITY DIALOG
      ======================= */}

      <Dialog
        open={openAddCity}
        onClose={() => setOpenAddCity(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Add City
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />

          <FormControl
            fullWidth
            margin="normal"
          >

            <InputLabel>
              State
            </InputLabel>

            <Select
              value={selectedStateId}
              label="State"
              onChange={(e) =>
                setSelectedStateId(e.target.value)
              }
            >

              {states.map((state) => (

                <MenuItem
                  key={state.id}
                  value={state.id}
                >
                  {state.stateName}
                </MenuItem>

              ))}

            </Select>

          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={cityActive}
                onChange={(e) =>
                  setCityActive(e.target.checked)
                }
              />
            }
            label="Active"
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setOpenAddCity(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateCity}
          >
            Save
          </Button>

        </DialogActions>

      </Dialog>



      {/* =========================================
        EDIT CITY DIALOG
========================================= */}

<Dialog
  open={openEditCity}
  onClose={() => setOpenEditCity(false)}
  fullWidth
  maxWidth="sm"
>

  <DialogTitle>
    Edit City
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      label="City Name"
      margin="normal"
      value={cityName}
      onChange={(e) => setCityName(e.target.value)}
    />

    <FormControl
      fullWidth
      margin="normal"
    >
      <InputLabel>
        State
      </InputLabel>

      <Select
        value={selectedStateId}
        label="State"
        onChange={(e) =>
          setSelectedStateId(e.target.value)
        }
      >

        {states.map((state) => (

          <MenuItem
            key={state.id}
            value={state.id}
          >
            {state.stateName}
          </MenuItem>

        ))}

      </Select>

    </FormControl>

    <FormControlLabel
      control={
        <Switch
          checked={cityActive}
          onChange={(e) =>
            setCityActive(e.target.checked)
          }
        />
      }
      label="Active"
    />

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() => setOpenEditCity(false)}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleUpdateCity}
    >
      Update
    </Button>

  </DialogActions>

</Dialog>

{/* =======================
    DELETE CITY DIALOG
======================= */}

<Dialog
  open={openDeleteCity}
  onClose={() => setOpenDeleteCity(false)}
>

  <DialogTitle>
    Delete City
  </DialogTitle>

  <DialogContent>

    <Typography>
      Are you sure you want to delete this city?
    </Typography>

  </DialogContent>

  <DialogActions>

    <Button onClick={() => setOpenDeleteCity(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={handleDeleteCity}
    >
      Delete
    </Button>

  </DialogActions>

</Dialog>

    </Box>

  );

}

export default AdminLocations;