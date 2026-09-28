
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

import {
  getCustomerFavourites,
  removeFavourite,
} from "../../api";

import { useNavigate } from "react-router-dom";

function CustomerFavourites() {

  const navigate = useNavigate();

  const [favourites, setFavourites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD FAVOURITES
  // =====================================================

  useEffect(() => {
    fetchFavourites();
  }, []);

  // =====================================================
  // GET LOGGED-IN CUSTOMER
  // =====================================================

  const getLoggedInUser = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // FETCH FAVOURITES
  // =====================================================

  const fetchFavourites = async () => {

    try {

      setLoading(true);

      setError("");

      const user = getLoggedInUser();

      if (!user) {

        setError(
          "User information not found. Please login again."
        );

        return;
      }

      const userId =
        user.id ||
        user.userId;

      if (!userId) {

        setError(
          "Customer ID not found. Please login again."
        );

        return;
      }

      console.log(
        "Customer ID:",
        userId
      );

      const response =
        await getCustomerFavourites(
          userId
        );

      console.log(
        "Favourite response:",
        response
      );

      // Handle ApiResponse
      if (response?.success) {

        setFavourites(
          response.data || []
        );

      } else if (Array.isArray(response)) {

        setFavourites(response);

      } else if (
        Array.isArray(response?.data)
      ) {

        setFavourites(
          response.data
        );

      } else {

        setFavourites([]);

      }

    } catch (error) {

      console.error(
        "Favourite API error:",
        error
      );

      if (error.response?.data?.message) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Failed to load favourite properties."
        );

      }

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // REMOVE FAVOURITE
  // =====================================================

  const handleRemoveFavourite = async (
    propertyId
  ) => {

    try {

      const user =
        getLoggedInUser();

      if (!user) {

        setError(
          "Please login again."
        );

        return;
      }

      const userId =
        user.id ||
        user.userId;

      await removeFavourite(
        userId,
        propertyId
      );

      // Remove from UI immediately
      setFavourites(
        previous =>
          previous.filter(
            favourite =>
              favourite.propertyId !==
              propertyId
          )
      );

    } catch (error) {

      console.error(
        "Remove favourite error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to remove property from favourites."
      );

    }

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >

        <CircularProgress />

      </Box>

    );

  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <Box p={3}>

        <Alert severity="error">
          {error}
        </Alert>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={fetchFavourites}
        >
          Try Again
        </Button>

      </Box>

    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <Box p={3}>

      {/* HEADER */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            My Favourite Properties
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Properties you have saved for later.
          </Typography>

        </Box>

        <Chip
          label={`${favourites.length} Favourite${
            favourites.length !== 1
              ? "s"
              : ""
          }`}
          color="primary"
        />

      </Box>


      {/* EMPTY STATE */}

      {favourites.length === 0 ? (

        <Box
          textAlign="center"
          py={8}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={1}
          >
            No Favourite Properties
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            You haven't added any properties
            to your favourites yet.
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              navigate(
                "/customer/properties"
              )
            }
          >
            Browse Properties
          </Button>

        </Box>

      ) : (

        <Grid
          container
          spacing={3}
        >

          {favourites.map(
            (favourite) => (

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={favourite.id}
              >

                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                  }}
                >

                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >

                    {/* TITLE */}

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {favourite.propertyTitle ||
                        "Property"}
                    </Typography>


                    {/* ADDRESS */}

                    <Typography
                      color="text.secondary"
                      mb={2}
                    >
                      📍{" "}
                      {favourite.propertyAddress ||
                        "Address not available"}
                    </Typography>


                    {/* PRICE */}

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      mb={2}
                    >
                      ₹{" "}
                      {Number(
                        favourite.propertyPrice || 0
                      ).toLocaleString("en-IN")}
                    </Typography>


                    {/* STATUS */}

                    <Chip
                      label="Favourite"
                      color="error"
                      size="small"
                      sx={{ mb: 2 }}
                    />


                    {/* BUTTONS */}

                    <Box
                      display="flex"
                      gap={1}
                      mt={2}
                    >

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          navigate(
                            `/customer/properties/${favourite.propertyId}`
                          )
                        }
                      >
                        View Property
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleRemoveFavourite(
                            favourite.propertyId
                          )
                        }
                      >
                        Remove
                      </Button>

                    </Box>

                  </CardContent>

                </Card>

              </Grid>

            )
          )}

        </Grid>

      )}

    </Box>

  );

}

export default CustomerFavourites;
