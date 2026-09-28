import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCustomerReviews,
  getCustomerBookings,
  createReview,
  deleteReview,
} from "../../api";

function CustomerReviews() {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState("");

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // =========================================
  // GET CUSTOMER ID
  // =========================================

  const getCustomerId = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(
        storedUser
      );

      return (
        user.userId ||
        user.id ||
        user.user?.id ||
        null
      );
    } catch (error) {
      console.error(
        "User JSON parse error:",
        error
      );

      return null;
    }
  };

  // =========================================
  // LOAD REVIEWS
  // =========================================

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const customerId =
        getCustomerId();

      if (!customerId) {
        setError(
          "Customer ID not found. Please login again."
        );
        return;
      }

      const result =
        await getCustomerReviews(
          customerId
        );

      console.log(
        "Customer reviews response:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setReviews(
          result.data || []
        );
      } else {
        setReviews([]);

        setError(
          result?.message ||
            "Unable to load reviews."
        );
      }
    } catch (err) {
      console.error(
        "Get customer reviews error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD CUSTOMER BOOKINGS
  // =========================================

  const loadBookings = async () => {
    try {
      const customerId =
        getCustomerId();

      if (!customerId) {
        return;
      }

      const result =
        await getCustomerBookings(
          customerId
        );

      console.log(
        "Customer bookings for reviews:",
        result
      );

      if (
        result &&
        result.success
      ) {
        const allBookings =
          result.data || [];

        // Reviews should normally be
        // given after booking completion.
        const completedBookings =
          allBookings.filter(
            (booking) =>
              String(
                booking.status || ""
              ).toUpperCase() ===
              "COMPLETED"
          );

        setBookings(
          completedBookings
        );
      }
    } catch (err) {
      console.error(
        "Get customer bookings error:",
        err
      );
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadReviews();
    loadBookings();
  }, []);

  // =========================================
  // OPEN REVIEW FORM
  // =========================================

  const handleOpenForm = () => {
    setMessage("");
    setError("");

    setSelectedBooking("");
    setRating(5);
    setComment("");

    setShowForm(true);
  };

  // =========================================
  // CLOSE REVIEW FORM
  // =========================================

  const handleCloseForm = () => {
    if (submitting) {
      return;
    }

    setShowForm(false);
    setSelectedBooking("");
    setRating(5);
    setComment("");
  };

  // =========================================
  // CREATE REVIEW
  // =========================================

  const handleCreateReview = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const customerId =
      getCustomerId();

    if (!customerId) {
      setError(
        "Customer ID not found. Please login again."
      );
      return;
    }

    if (!selectedBooking) {
      setError(
        "Please select a completed booking."
      );
      return;
    }

    const booking =
      bookings.find(
        (item) =>
          String(item.id) ===
          String(selectedBooking)
      );

    if (!booking) {
      setError(
        "Selected booking was not found."
      );
      return;
    }

    if (
      !rating ||
      rating < 1 ||
      rating > 5
    ) {
      setError(
        "Please select a rating between 1 and 5."
      );
      return;
    }

    if (!comment.trim()) {
      setError(
        "Please enter your review."
      );
      return;
    }

    const reviewData = {
  userId: customerId,

  propertyId: booking.propertyId,

  rating: Number(rating),

  comment: comment.trim(),
};
    console.log(
      "Creating review:",
      reviewData
    );

    try {
      setSubmitting(true);

      const result =
        await createReview(
          reviewData
        );

      console.log(
        "Create review response:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setMessage(
          result.message ||
            "Review submitted successfully."
        );

        setShowForm(false);

        setSelectedBooking("");
        setRating(5);
        setComment("");

        await loadReviews();
      } else {
        setError(
          result?.message ||
            "Unable to create review."
        );
      }
    } catch (err) {
      console.error(
        "Create review error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to create review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // DELETE REVIEW
  // =========================================

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

      setMessage("");
      setError("");

      const result =
        await deleteReview(
          reviewId
        );

      console.log(
        "Delete review response:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setMessage(
          result.message ||
            "Review deleted successfully."
        );

        await loadReviews();
      } else {
        setError(
          result?.message ||
            "Unable to delete review."
        );
      }
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // STAR DISPLAY
  // =========================================

  const renderStars = (
    ratingValue
  ) => {
    const ratingNumber =
      Number(ratingValue) || 0;

    return (
      <span
        style={{
          fontSize: "20px",
          letterSpacing: "2px",
        }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span
              key={star}
              style={{
                color:
                  star <=
                  ratingNumber
                    ? "#f5b301"
                    : "#ccc",
              }}
            >
              ★
            </span>
          )
        )}
      </span>
    );
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    try {
      return new Date(
        value
      ).toLocaleString();
    } catch {
      return value;
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>
          <h2>
            My Reviews
          </h2>

          <p>
            Loading your reviews...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div style={styles.page}>

      {/* =====================================
          HEADER
          ===================================== */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            My Reviews
          </h1>

          <p style={styles.subtitle}>
            View and manage reviews you
            have submitted for properties.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenForm}
          style={styles.addButton}
        >
          + Write Review
        </button>

      </div>

      {/* =====================================
          SUCCESS MESSAGE
          ===================================== */}

      {message && (
        <div style={styles.successBox}>
          {message}
        </div>
      )}

      {/* =====================================
          ERROR MESSAGE
          ===================================== */}

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* =====================================
          REVIEW FORM
          ===================================== */}

      {showForm && (
        <div style={styles.formCard}>

          <h2>
            Write a Review
          </h2>

          <p style={styles.formSubtitle}>
            You can review a completed
            property booking.
          </p>

          <form
            onSubmit={
              handleCreateReview
            }
          >

            {/* BOOKING */}

            <div style={styles.formGroup}>

              <label
                style={styles.label}
              >
                Completed Booking
              </label>

              {bookings.length === 0 ? (
                <div
                  style={
                    styles.warningBox
                  }
                >
                  You don't have any
                  completed bookings
                  available for review.
                </div>
              ) : (
                <select
                  value={
                    selectedBooking
                  }
                  onChange={(e) =>
                    setSelectedBooking(
                      e.target.value
                    )
                  }
                  disabled={
                    submitting
                  }
                  style={
                    styles.input
                  }
                >
                  <option value="">
                    Select completed
                    booking
                  </option>

                  {bookings.map(
                    (booking) => (
                      <option
                        key={
                          booking.id
                        }
                        value={
                          booking.id
                        }
                      >
                        {booking.propertyTitle ||
                          "Property"}{" "}
                        - Booking ID:{" "}
                        {booking.id}
                      </option>
                    )
                  )}
                </select>
              )}

            </div>

            {/* RATING */}

            <div style={styles.formGroup}>

              <label
                style={styles.label}
              >
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(
                      e.target.value
                    )
                  )
                }
                disabled={
                  submitting
                }
                style={
                  styles.input
                }
              >
                <option value={5}>
                  5 - Excellent
                </option>

                <option value={4}>
                  4 - Very Good
                </option>

                <option value={3}>
                  3 - Good
                </option>

                <option value={2}>
                  2 - Fair
                </option>

                <option value={1}>
                  1 - Poor
                </option>
              </select>

              <div
                style={{
                  marginTop: "8px",
                }}
              >
                {renderStars(
                  rating
                )}
              </div>

            </div>

            {/* COMMENT */}

            <div style={styles.formGroup}>

              <label
                style={styles.label}
              >
                Review
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                disabled={
                  submitting
                }
                placeholder="Write your review..."
                rows="5"
                style={{
                  ...styles.input,
                  resize: "vertical",
                }}
              />

            </div>

            {/* FORM ACTIONS */}

            <div
              style={
                styles.formActions
              }
            >

              <button
                type="submit"
                disabled={
                  submitting ||
                  bookings.length === 0
                }
                style={{
                  ...styles.submitButton,
                  opacity:
                    submitting ||
                    bookings.length ===
                      0
                      ? 0.6
                      : 1,
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                disabled={
                  submitting
                }
                style={
                  styles.cancelButton
                }
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================
          TOTAL REVIEWS
          ===================================== */}

      <div style={styles.totalBox}>

        <h2
          style={
            styles.totalTitle
          }
        >
          Total Reviews:{" "}
          {reviews.length}
        </h2>

      </div>

      {/* =====================================
          EMPTY
          ===================================== */}

      {reviews.length === 0 ? (

        <div style={styles.emptyBox}>

          <h3>
            No Reviews Found
          </h3>

          <p>
            You have not submitted
            any property reviews yet.
          </p>

        </div>

      ) : (

        <div>

          {reviews.map(
            (review) => (

              <div
                key={review.id}
                style={styles.reviewCard}
              >

                {/* HEADER */}

                <div
                  style={
                    styles.reviewHeader
                  }
                >

                  <div>

                    <h2
                      style={
                        styles.reviewTitle
                      }
                    >
                      {review.propertyTitle ||
                        "Property Review"}
                    </h2>

                    <p
                      style={
                        styles.reviewId
                      }
                    >
                      Review ID:{" "}
                      {review.id || "-"}
                    </p>

                  </div>

                  {renderStars(
                    review.rating
                  )}

                </div>

                {/* DETAILS */}

                <div
                  style={
                    styles.reviewDetails
                  }
                >

                  <div>
                    <strong>
                      Property ID
                    </strong>

                    <span>
                      {review.propertyId ||
                        "-"}
                    </span>
                  </div>

                  <div>
                    <strong>
                      Rating
                    </strong>

                    <span>
                      {review.rating ||
                        0}{" "}
                      / 5
                    </span>
                  </div>

                  <div>
                    <strong>
                      Created At
                    </strong>

                    <span>
                      {formatDate(
                        review.createdAt
                      )}
                    </span>
                  </div>

                  <div>
                    <strong>
                      Updated At
                    </strong>

                    <span>
                      {formatDate(
                        review.updatedAt
                      )}
                    </span>
                  </div>

                </div>

                {/* COMMENT */}

                <div
                  style={
                    styles.commentBox
                  }
                >

                  <strong>
                    Your Review
                  </strong>

                  <p>
                    {review.comment ||
                      "-"}
                  </p>

                </div>

                {/* ACTIONS */}

                <div
                  style={
                    styles.actionContainer
                  }
                >

                  {review.propertyId && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/customer/properties/${review.propertyId}`
                        )
                      }
                      style={
                        styles.viewButton
                      }
                    >
                      View Property
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={
                      deletingId ===
                      review.id
                    }
                    onClick={() =>
                      handleDelete(
                        review.id
                      )
                    }
                    style={{
                      ...styles.deleteButton,
                      opacity:
                        deletingId ===
                        review.id
                          ? 0.6
                          : 1,
                    }}
                  >
                    {deletingId ===
                    review.id
                      ? "Deleting..."
                      : "Delete Review"}
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

// =========================================
// STYLES
// =========================================

const styles = {
  page: {
    padding: "30px",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    marginTop: "8px",
    color: "#666",
    fontSize: "16px",
  },

  addButton: {
    padding: "11px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  loadingBox: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  successBox: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border:
      "1px solid #c3e6cb",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "20px",
  },

  errorBox: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border:
      "1px solid #f5c6cb",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "20px",
  },

  totalBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px 20px",
    marginBottom: "20px",
  },

  totalTitle: {
    margin: 0,
    fontSize: "20px",
  },

  formCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  formSubtitle: {
    color: "#666",
    marginBottom: "20px",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    color: "#333",
  },

  input: {
    width: "100%",
    maxWidth: "700px",
    padding: "11px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  warningBox: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    border:
      "1px solid #ffeeba",
    borderRadius: "5px",
    padding: "12px",
  },

  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  submitButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  cancelButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#6c757d",
    color: "#fff",
    cursor: "pointer",
  },

  emptyBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "50px",
    textAlign: "center",
  },

  reviewCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    borderBottom:
      "1px solid #eee",
    paddingBottom: "15px",
    marginBottom: "20px",
  },

  reviewTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#333",
  },

  reviewId: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#777",
  },

  reviewDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px 30px",
  },

  commentBox: {
    marginTop: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    padding: "15px",
  },

  actionContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop:
      "1px solid #eee",
  },

  viewButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0d6efd",
    color: "#fff",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};

export default CustomerReviews;