import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../api";

function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD BOOKING
  // =========================================

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getBookingById(id);

      console.log(
        "Booking details response:",
        result
      );

      if (result.success) {
        setBooking(result.data);
      } else {
        setError(
          result.message ||
            "Unable to load booking details."
        );
      }
    } catch (err) {
      console.error(
        "Get booking details error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load booking details."
      );
    } finally {
      setLoading(false);
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
        <h2>Booking Details</h2>
        <p>Loading booking details...</p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div>
        <h2>Booking Details</h2>

        <p
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/bookings")
          }
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  // =========================================
  // BOOKING NOT FOUND
  // =========================================

  if (!booking) {
    return (
      <div>
        <h2>Booking Details</h2>

        <p>Booking not found.</p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/bookings")
          }
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div>
      <h2>Booking Details</h2>

      <p>
        View complete information about this
        property booking.
      </p>

      {/* =========================================
          BOOKING INFORMATION
          ========================================= */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>Booking Information</h3>

        <p>
          <strong>Booking ID:</strong>{" "}
          {booking.id || "-"}
        </p>

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

        <p>
          <strong>Booking Date:</strong>{" "}
          {booking.bookingDate || "-"}
        </p>

        <p>
          <strong>Message:</strong>{" "}
          {booking.message || "-"}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {booking.createdAt || "-"}
        </p>

        <p>
          <strong>Updated At:</strong>{" "}
          {booking.updatedAt || "-"}
        </p>
      </div>

      {/* =========================================
          PROPERTY INFORMATION
          ========================================= */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>Property Information</h3>

        <p>
          <strong>Property ID:</strong>{" "}
          {booking.propertyId || "-"}
        </p>

        <p>
          <strong>Property Title:</strong>{" "}
          {booking.propertyTitle || "-"}
        </p>
      </div>

      {/* =========================================
          CUSTOMER INFORMATION
          ========================================= */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>Customer Information</h3>

        <p>
          <strong>Customer ID:</strong>{" "}
          {booking.customerId || "-"}
        </p>

        <p>
          <strong>Customer Name:</strong>{" "}
          {booking.customerName || "-"}
        </p>
      </div>

      {/* =========================================
          OWNER INFORMATION
          ========================================= */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>Owner Information</h3>

        <p>
          <strong>Owner ID:</strong>{" "}
          {booking.ownerId || "-"}
        </p>

        <p>
          <strong>Owner Name:</strong>{" "}
          {booking.ownerName || "-"}
        </p>
      </div>

      {/* =========================================
          BACK BUTTON
          ========================================= */}

      <button
        type="button"
        onClick={() =>
          navigate("/admin/bookings")
        }
      >
        ← Back to Bookings
      </button>
    </div>
  );
}

export default AdminBookingDetails;