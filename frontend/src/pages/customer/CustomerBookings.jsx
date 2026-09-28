import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCustomerBookings,
  cancelBooking,
} from "../../api";

function CustomerBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  // =========================================
  // LOAD CUSTOMER BOOKINGS
  // =========================================

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setError(
          "User information not found. Please login again."
        );
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (parseError) {
        console.error(
          "User JSON parse error:",
          parseError
        );

        setError(
          "Invalid user information. Please login again."
        );

        return;
      }

      console.log(
        "Logged-in customer:",
        user
      );

      // =========================================
      // CUSTOMER ROLE CHECK
      // =========================================

      const role = String(
        user.role || ""
      ).toUpperCase();

      if (role !== "CUSTOMER") {
        setError(
          "Only customers can view customer bookings."
        );
        return;
      }

      // =========================================
      // CUSTOMER ID
      // =========================================

      const customerId =
        user.userId ||
        user.id ||
        user.user?.id;

      if (!customerId) {
        setError(
          "Customer ID not found. Please login again."
        );
        return;
      }

      console.log(
        "Loading bookings for customer:",
        customerId
      );

      // =========================================
      // API
      // =========================================

      const result =
        await getCustomerBookings(
          customerId
        );

      console.log(
        "Customer bookings response:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setBookings(
          result.data || []
        );
      } else {
        setError(
          result?.message ||
            "Unable to load your bookings."
        );
      }

    } catch (err) {
      console.error(
        "Get customer bookings error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load your bookings."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadBookings();
  }, []);

  // =========================================
  // CANCEL BOOKING
  // =========================================

  const handleCancel = async (
    bookingId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(
        bookingId
      );

      setMessage("");
      setError("");

      const result =
        await cancelBooking(
          bookingId
        );

      console.log(
        "Cancel booking response:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setMessage(
          result.message ||
            "Booking cancelled successfully."
        );

        await loadBookings();

      } else {
        setError(
          result?.message ||
            "Unable to cancel booking."
        );
      }

    } catch (err) {
      console.error(
        "Cancel booking error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to cancel booking."
      );

    } finally {
      setCancellingId(null);
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (
    status
  ) => {
    const normalizedStatus =
      String(
        status || ""
      ).toUpperCase();

    switch (
      normalizedStatus
    ) {
      case "ACCEPTED":
        return {
          backgroundColor: "#d1fae5",
          color: "#065f46",
        };

      case "REJECTED":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        };

      case "CANCELLED":
        return {
          backgroundColor: "#e5e7eb",
          color: "#374151",
        };

      case "COMPLETED":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
        };

      case "PENDING":
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
        };

      default:
        return {
          backgroundColor: "#eeeeee",
          color: "#333333",
        };
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
            My Bookings
          </h2>

          <p>
            Loading your bookings...
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
            My Bookings
          </h1>

          <p style={styles.subtitle}>
            View and manage your property
            bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBookings}
          style={styles.refreshButton}
        >
          Refresh
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
          TOTAL BOOKINGS
          ===================================== */}

      <div style={styles.totalBox}>
        <h2 style={styles.totalTitle}>
          Total Bookings:{" "}
          {bookings.length}
        </h2>
      </div>

      {/* =====================================
          EMPTY
          ===================================== */}

      {bookings.length === 0 ? (

        <div style={styles.emptyBox}>

          <h3>
            No Bookings Found
          </h3>

          <p>
            You have not created any
            property bookings yet.
          </p>

        </div>

      ) : (

        <div>

          {bookings.map(
            (booking) => {

              const status =
                String(
                  booking.status || ""
                ).toUpperCase();

              const canCancel =
                status === "PENDING" ||
                status === "ACCEPTED";

              return (
                <div
                  key={booking.id}
                  style={styles.card}
                >

                  {/* =========================
                      CARD HEADER
                      ========================= */}

                  <div
                    style={
                      styles.cardHeader
                    }
                  >

                    <div>

                      <h2
                        style={
                          styles.cardTitle
                        }
                      >
                        {booking.propertyTitle ||
                          "Property Booking"}
                      </h2>

                      <p
                        style={
                          styles.bookingId
                        }
                      >
                        Booking ID:{" "}
                        {booking.id || "-"}
                      </p>

                    </div>

                    <span
                      style={{
                        ...styles.status,
                        ...getStatusStyle(
                          booking.status
                        ),
                      }}
                    >
                      {booking.status ||
                        "UNKNOWN"}
                    </span>

                  </div>

                  {/* =========================
                      BOOKING DETAILS
                      ========================= */}

                  <div
                    style={
                      styles.detailsGrid
                    }
                  >

                    {/* PROPERTY ID */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Property ID
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.propertyId ||
                          "-"}
                      </span>
                    </div>

                    {/* PROPERTY TITLE */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Property
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.propertyTitle ||
                          "-"}
                      </span>
                    </div>

                    {/* OWNER ID */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Owner ID
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.ownerId ||
                          "-"}
                      </span>
                    </div>

                    {/* OWNER */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Owner
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.ownerName ||
                          "-"}
                      </span>
                    </div>

                    {/* BOOKING DATE */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Booking Date
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.bookingDate ||
                          "-"}
                      </span>
                    </div>

                    {/* MESSAGE */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Message
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.message ||
                          "-"}
                      </span>
                    </div>

                    {/* CREATED */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Created At
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.createdAt ||
                          "-"}
                      </span>
                    </div>

                    {/* UPDATED */}

                    <div
                      style={
                        styles.detailItem
                      }
                    >
                      <span
                        style={
                          styles.detailLabel
                        }
                      >
                        Updated At
                      </span>

                      <span
                        style={
                          styles.detailValue
                        }
                      >
                        {booking.updatedAt ||
                          "-"}
                      </span>
                    </div>

                  </div>

                  {/* =========================
                      ACTIONS
                      ========================= */}

                  <div
                    style={
                      styles.actionContainer
                    }
                  >

                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/customer/bookings/${booking.id}`
                        )
                      }
                      style={
                        styles.viewButton
                      }
                    >
                      View Details
                    </button>

                    {/* CANCEL */}

                    {canCancel && (
                      <button
                        type="button"
                        disabled={
                          cancellingId ===
                          booking.id
                        }
                        onClick={() =>
                          handleCancel(
                            booking.id
                          )
                        }
                        style={{
                          ...styles.cancelButton,
                          cursor:
                            cancellingId ===
                            booking.id
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            cancellingId ===
                            booking.id
                              ? 0.6
                              : 1,
                        }}
                      >
                        {cancellingId ===
                        booking.id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}

                  </div>

                </div>
              );
            }
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

  refreshButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },

  loadingBox: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
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

  successBox: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "20px",
  },

  errorBox: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "20px",
  },

  emptyBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "50px",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
    gap: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#333",
  },

  bookingId: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#777",
  },

  status: {
    padding: "7px 14px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px 30px",
  },

  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  detailLabel: {
    fontSize: "13px",
    color: "#777",
    fontWeight: "600",
  },

  detailValue: {
    fontSize: "14px",
    color: "#333",
    wordBreak: "break-word",
  },

  actionContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },

  viewButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#6c757d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },

  cancelButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: "14px",
  },

};

export default CustomerBookings;