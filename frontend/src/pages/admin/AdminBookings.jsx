import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from "../../api";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [actionId, setActionId] = useState(null);

  // =========================================
  // LOAD ALL BOOKINGS
  // =========================================

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllBookings();

      console.log("Bookings response:", result);

      if (result.success) {
        setBookings(result.data || []);
      } else {
        setError(
          result.message ||
            "Unable to load bookings."
        );
      }
    } catch (err) {
      console.error(
        "Get bookings error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ACCEPT BOOKING
  // =========================================

  const handleAccept = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(bookingId);
      setMessage("");
      setError("");

      const result =
        await acceptBooking(bookingId);

      console.log(
        "Accept booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking accepted successfully."
        );

        await loadBookings();
      } else {
        setError(
          result.message ||
            "Unable to accept booking."
        );
      }
    } catch (err) {
      console.error(
        "Accept booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to accept booking."
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================
  // REJECT BOOKING
  // =========================================

  const handleReject = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(bookingId);
      setMessage("");
      setError("");

      const result =
        await rejectBooking(bookingId);

      console.log(
        "Reject booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking rejected successfully."
        );

        await loadBookings();
      } else {
        setError(
          result.message ||
            "Unable to reject booking."
        );
      }
    } catch (err) {
      console.error(
        "Reject booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to reject booking."
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================
  // COMPLETE BOOKING
  // =========================================

  const handleComplete = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to complete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(bookingId);
      setMessage("");
      setError("");

      const result =
        await completeBooking(bookingId);

      console.log(
        "Complete booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking completed successfully."
        );

        await loadBookings();
      } else {
        setError(
          result.message ||
            "Unable to complete booking."
        );
      }
    } catch (err) {
      console.error(
        "Complete booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to complete booking."
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    const normalizedStatus =
      String(status || "").toUpperCase();

    if (normalizedStatus === "ACCEPTED") {
      return {
        color: "green",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "REJECTED") {
      return {
        color: "red",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "CANCELLED") {
      return {
        color: "gray",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "COMPLETED") {
      return {
        color: "blue",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "PENDING") {
      return {
        color: "orange",
        fontWeight: "bold",
      };
    }

    return {
      fontWeight: "bold",
    };
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div>
        <h2>Booking Management</h2>

        <p>Loading bookings...</p>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div>
      <h2>Booking Management</h2>

      <p>
        Manage RealEstate Pro property
        bookings.
      </p>

      {/* =========================================
          SUCCESS MESSAGE
          ========================================= */}

      {message && (
        <p
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      {/* =========================================
          ERROR MESSAGE
          ========================================= */}

      {error && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      {/* =========================================
          NO BOOKINGS
          ========================================= */}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div>
          {/* Total Bookings */}

          <p>
            <strong>
              Total Bookings: {bookings.length}
            </strong>
          </p>

          {/* =========================================
              BOOKING LIST
              ========================================= */}

          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              {/* =========================================
                  BOOKING INFORMATION
                  ========================================= */}

              <h3>
                Booking Details
              </h3>

              {/* Booking ID */}

              <p>
                <strong>Booking ID:</strong>{" "}
                {booking.id}
              </p>

              {/* =========================================
                  PROPERTY INFORMATION
                  ========================================= */}

              <p>
                <strong>Property ID:</strong>{" "}
                {booking.propertyId || "-"}
              </p>

              <p>
                <strong>
                  Property Title:
                </strong>{" "}
                {booking.propertyTitle || "-"}
              </p>

              {/* =========================================
                  CUSTOMER INFORMATION
                  ========================================= */}

              <p>
                <strong>Customer ID:</strong>{" "}
                {booking.customerId || "-"}
              </p>

              <p>
                <strong>Customer Name:</strong>{" "}
                {booking.customerName || "-"}
              </p>

              {/* =========================================
                  OWNER INFORMATION
                  ========================================= */}

              <p>
                <strong>Owner ID:</strong>{" "}
                {booking.ownerId || "-"}
              </p>

              <p>
                <strong>Owner Name:</strong>{" "}
                {booking.ownerName || "-"}
              </p>

              {/* =========================================
                  BOOKING DATE
                  ========================================= */}

              <p>
                <strong>Booking Date:</strong>{" "}
                {booking.bookingDate || "-"}
              </p>

              {/* =========================================
                  MESSAGE
                  ========================================= */}

              <p>
                <strong>Message:</strong>{" "}
                {booking.message || "-"}
              </p>

              {/* =========================================
                  STATUS
                  ========================================= */}

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={getStatusStyle(
                    booking.status
                  )}
                >
                  {booking.status || "-"}
                </span>
              </p>

              {/* =========================================
                  CREATED AT
                  ========================================= */}

              <p>
                <strong>Created At:</strong>{" "}
                {booking.createdAt || "-"}
              </p>

              {/* =========================================
                  UPDATED AT
                  ========================================= */}

              <p>
                <strong>Updated At:</strong>{" "}
                {booking.updatedAt || "-"}
              </p>

              {/* =========================================
                  ACTION BUTTONS
                  ========================================= */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                {/* =====================================
                    VIEW
                    ===================================== */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/bookings/${booking.id}`
                    )
                  }
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>

                {/* =====================================
                    ACCEPT
                    ===================================== */}

                {String(
                  booking.status
                ).toUpperCase() ===
                  "PENDING" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAccept(
                        booking.id
                      )
                    }
                    disabled={
                      actionId === booking.id
                    }
                    style={{
                      backgroundColor:
                        "green",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "4px",
                      cursor:
                        actionId ===
                        booking.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {actionId ===
                    booking.id
                      ? "Processing..."
                      : "Accept"}
                  </button>
                )}

                {/* =====================================
                    REJECT
                    ===================================== */}

                {String(
                  booking.status
                ).toUpperCase() ===
                  "PENDING" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleReject(
                        booking.id
                      )
                    }
                    disabled={
                      actionId === booking.id
                    }
                    style={{
                      backgroundColor:
                        "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "4px",
                      cursor:
                        actionId ===
                        booking.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {actionId ===
                    booking.id
                      ? "Processing..."
                      : "Reject"}
                  </button>
                )}

                {/* =====================================
                    COMPLETE
                    ===================================== */}

                {String(
                  booking.status
                ).toUpperCase() ===
                  "ACCEPTED" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleComplete(
                        booking.id
                      )
                    }
                    disabled={
                      actionId === booking.id
                    }
                    style={{
                      backgroundColor:
                        "#007bff",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "4px",
                      cursor:
                        actionId ===
                        booking.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {actionId ===
                    booking.id
                      ? "Processing..."
                      : "Complete"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;