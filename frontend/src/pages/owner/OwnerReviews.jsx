import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";

import {
  ArrowBack,
  Delete,
  Star,
  Home,
} from "@mui/icons-material";

import {
  getOwnerReviews,
  deleteReview,
} from "../../api";


// =====================================================
// OWNER REVIEWS
// =====================================================

function OwnerReviews() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);


  // =====================================================
  // GET OWNER ID
  // =====================================================

  const getOwnerId = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user =
        JSON.parse(storedUser);

      return (
        user.userId ||
        user.id ||
        user._id ||
        null
      );

    } catch (error) {

      console.error(
        "Failed to read logged-in user:",
        error
      );

      return null;
    }
  };


  // =====================================================
  // FETCH OWNER REVIEWS
  // =====================================================

  const fetchReviews = async () => {

    try {

      setLoading(true);

      setError("");

      const ownerId =
        getOwnerId();

      if (!ownerId) {

        setError(
          "Owner information not found. Please login again."
        );

        return;
      }


      console.log(
        "OWNER REVIEWS OWNER ID:",
        ownerId
      );


      const response =
        await getOwnerReviews(ownerId);


      console.log(
        "OWNER REVIEWS RESPONSE:",
        response
      );


      if (response?.success) {

        setReviews(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } else {

        setError(
          response?.message ||
          "Failed to load owner reviews."
        );

      }

    } catch (error) {

      console.error(
        "OWNER REVIEWS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load reviews."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchReviews();

  }, []);


  // =====================================================
  // DELETE REVIEW
  // =====================================================

  const handleDelete = async (
    reviewId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(reviewId);


      const response =
        await deleteReview(reviewId);


      console.log(
        "DELETE REVIEW RESPONSE:",
        response
      );


      // Remove review from UI
      setReviews(
        previousReviews =>
          previousReviews.filter(
            review =>
              review.id !== reviewId
          )
      );


    } catch (error) {

      console.error(
        "DELETE REVIEW ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete review."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "N/A";
    }

    try {

      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {

      return date;
    }
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <CircularProgress />

      </Box>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },

        backgroundColor: "#f5f7fb",

        minHeight: "100vh",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Customer Reviews
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Reviews received for your properties
          </Typography>

        </Box>


        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/owner/dashboard")
          }
        >
          Dashboard
        </Button>

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
        }}
      >

        <CardContent>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
          >

            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff3e0",
              }}
            >

              <Star
                sx={{
                  color: "#f59e0b",
                  fontSize: 34,
                }}
              />

            </Box>


            <Box>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {reviews.length}
              </Typography>

              <Typography
                color="text.secondary"
              >
                Total Reviews
              </Typography>

            </Box>

          </Stack>

        </CardContent>

      </Card>


      {/* =================================================
          NO REVIEWS
      ================================================= */}

      {reviews.length === 0 ? (

        <Card
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 8,
          }}
        >

          <CardContent>

            <Star
              sx={{
                fontSize: 60,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
            >
              No Reviews Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Customers have not reviewed your
              properties yet.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        /* =================================================
           REVIEW LIST
        ================================================= */

        <Stack spacing={3}>

          {reviews.map(
            (review) => (

              <Card
                key={review.id}
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.06)",
                }}
              >

                <CardContent>

                  {/* ======================================
                      REVIEW HEADER
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >

                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                        }}
                      >
                        {review.userName
                          ? review.userName
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </Avatar>


                      <Box>

                        <Typography
                          fontWeight={700}
                        >
                          {review.userName ||
                            "Customer"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {formatDate(
                            review.createdAt
                          )}
                        </Typography>

                      </Box>

                    </Box>


                    <Chip
                      label={
                        review.active
                          ? "Active"
                          : "Deleted"
                      }
                      color={
                        review.active
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />

                  </Box>


                  <Divider
                    sx={{
                      my: 2,
                    }}
                  />


                  {/* ======================================
                      PROPERTY
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >

                    <Home
                      fontSize="small"
                      color="action"
                    />

                    <Typography
                      fontWeight={600}
                    >
                      {review.propertyTitle ||
                        "Property"}
                    </Typography>

                  </Box>


                  {/* ======================================
                      RATING
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >

                    <Rating
                      value={
                        Number(
                          review.rating || 0
                        )
                      }
                      readOnly
                      precision={1}
                    />

                    <Typography
                      fontWeight={700}
                    >
                      {review.rating}/5
                    </Typography>

                  </Box>


                  {/* ======================================
                      COMMENT
                  ====================================== */}

                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      color: "text.primary",
                    }}
                  >
                    "{review.comment}"
                  </Typography>


                  {/* ======================================
                      ACTIONS
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "flex-end",
                      mt: 3,
                    }}
                  >

                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={
                        deletingId === review.id
                          ? (
                            <CircularProgress
                              size={18}
                              color="inherit"
                            />
                          )
                          : (
                            <Delete />
                          )
                      }
                      disabled={
                        deletingId === review.id
                      }
                      onClick={() =>
                        handleDelete(
                          review.id
                        )
                      }
                    >
                      {deletingId === review.id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>

                  </Box>

                </CardContent>

              </Card>

            )
          )}

        </Stack>

      )}

    </Box>
  );
}


export default OwnerReviews;