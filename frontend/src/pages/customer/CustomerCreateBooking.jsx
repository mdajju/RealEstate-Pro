
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getPropertyById,
  createBooking,
} from "../../api";

function CustomerCreateBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [property, setProperty] = useState(null);

  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // GET MINIMUM DATETIME
  // =========================================

  const getMinDateTime = () => {
    const now = new Date();

    // Add 5 minutes to avoid timing problems
    now.setMinutes(now.getMinutes() + 5);

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // =========================================
  // LOAD PROPERTY
  // =========================================

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        setError("Property ID not found.");
        return;
      }

      const result = await getPropertyById(id);

      console.log(
        "Booking property response:",
        result
      );

      if (result && result.success) {
        setProperty(result.data);

        console.log(
          "Property owner information:",
          result.data?.ownerId,
          result.data?.owner,
          result.data?.owner?.id
        );
      } else {
        setError(
          result?.message ||
            "Unable to load property."
        );
      }

    } catch (err) {
      console.error(
        "Load property error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load property."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // GET CUSTOMER
  // =========================================

  const getCustomerId = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(storedUser);

      console.log(
        "Logged-in customer:",
        user
      );

      return (
        user.userId ||
        user.id ||
        user.user?.id ||
        null
      );

    } catch (err) {
      console.error(
        "User parse error:",
        err
      );

      return null;
    }
  };

  // =========================================
  // GET OWNER ID
  // =========================================

  const getOwnerId = () => {
    if (!property) {
      return null;
    }

    /*
     * Different possible property response structures
     */

    return (
      property.ownerId ||
      property.owner?.id ||
      property.owner?.userId ||
      property.owner?.user?.id ||
      null
    );
  };

  // =========================================
  // SUBMIT BOOKING
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // =========================================
    // CHECK LOGIN
    // =========================================

    const token =
      localStorage.getItem("token");

    if (!token) {
      setError(
        "Your session has expired. Please login again."
      );

      navigate("/login");

      return;
    }

    // =========================================
    // GET CUSTOMER ID
    // =========================================

    const customerId =
      getCustomerId();

    if (!customerId) {
      setError(
        "Customer information not found. Please login again."
      );

      return;
    }

    // =========================================
    // PROPERTY CHECK
    // =========================================

    if (!property) {
      setError(
        "Property information is not available."
      );

      return;
    }

    // =========================================
    // GET OWNER ID
    // =========================================

    const ownerId =
      getOwnerId();

    console.log(
      "Customer ID:",
      customerId
    );

    console.log(
      "Owner ID:",
      ownerId
    );

    if (!ownerId) {
      setError(
        "Owner information is not available for this property."
      );

      return;
    }

    // =========================================
    // VISIT DATE VALIDATION
    // =========================================

    if (!visitDate) {
      setError(
        "Please select a visit date and time."
      );

      return;
    }

    const selectedDate =
      new Date(visitDate);

    const currentDate =
      new Date();

    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {
      setError(
        "Please select a valid visit date and time."
      );

      return;
    }

    if (
      selectedDate <= currentDate
    ) {
      setError(
        "Visit date and time must be in the future."
      );

      return;
    }

    // =========================================
    // STATUS CHECK
    // =========================================

    const propertyStatus =
      String(
        property.status || ""
      ).toUpperCase();

    if (
      propertyStatus !== "AVAILABLE"
    ) {
      setError(
        "This property is currently not available for booking."
      );

      return;
    }

    try {
      setSubmitting(true);

      // =========================================
      // BOOKING DATA
      // =========================================

      const bookingData = {
        propertyId:
          property.id,

        customerId:
          customerId,

        ownerId:
          ownerId,

        visitDate:
          visitDate,

        message:
          message.trim(),
      };

      console.log(
        "Creating booking with:",
        bookingData
      );

      // =========================================
      // API
      // =========================================

      const result =
        await createBooking(
          bookingData
        );

      console.log(
        "Create booking response:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setSuccess(
          result.message ||
            "Property booking created successfully."
        );

        // =========================================
        // REDIRECT
        // =========================================

        setTimeout(() => {
          navigate(
            "/customer/bookings"
          );
        }, 1000);

      } else {
        setError(
          result?.message ||
            "Unable to create booking."
        );
      }

    } catch (err) {
      console.error(
        "Create booking error:",
        err
      );

      console.error(
        "Backend response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          "Failed to create booking."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "₹0";
    }

    const numericAmount =
      Number(amount);

    if (
      Number.isNaN(numericAmount)
    ) {
      return String(amount);
    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(numericAmount);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>

          <div style={styles.icon}>
            🏠
          </div>

          <h2>
            Book Property
          </h2>

          <p>
            Loading property information...
          </p>

        </div>
      </div>
    );
  }

  // =========================================
  // PROPERTY NOT FOUND
  // =========================================

  if (!property) {
    return (
      <div style={styles.page}>

        <div style={styles.errorBox}>
          <h2>
            Property Not Found
          </h2>

          <p>
            {error ||
              "Unable to find this property."}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customer/properties"
            )
          }
          style={styles.secondaryButton}
        >
          ← Back to Properties
        </button>

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
            Book Property
          </h1>

          <p style={styles.subtitle}>
            Schedule a visit for this property.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/customer/properties/${property.id}`
            )
          }
          style={styles.secondaryButton}
        >
          ← Back to Property
        </button>

      </div>

      {/* =====================================
          ERROR
          ===================================== */}

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* =====================================
          SUCCESS
          ===================================== */}

      {success && (
        <div style={styles.successBox}>
          {success}
        </div>
      )}

      {/* =====================================
          MAIN CONTENT
          ===================================== */}

      <div style={styles.container}>

        {/* ===================================
            PROPERTY SUMMARY
            =================================== */}

        <div style={styles.propertyCard}>

          <h2 style={styles.propertyTitle}>
            {property.title ||
              "Property"}
          </h2>

          <p style={styles.propertyId}>
            Property ID:{" "}
            {property.id || "-"}
          </p>

          <div style={styles.propertyDetails}>

            <div>

              <span style={styles.label}>
                Price
              </span>

              <strong style={styles.price}>
                {formatAmount(
                  property.price
                )}
              </strong>

            </div>

            <div>

              <span style={styles.label}>
                Status
              </span>

              <strong
                style={{
                  color:
                    String(
                      property.status || ""
                    ).toUpperCase() ===
                    "AVAILABLE"
                      ? "green"
                      : "red",
                }}
              >
                {property.status ||
                  "-"}
              </strong>

            </div>

            <div>

              <span style={styles.label}>
                Address
              </span>

              <span>
                {property.address ||
                  "-"}
              </span>

            </div>

            <div>

              <span style={styles.label}>
                City
              </span>

              <span>
                {property.cityName ||
                  "-"}
              </span>

            </div>

          </div>

        </div>

        {/* ===================================
            BOOKING FORM
            =================================== */}

        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            Booking Information
          </h2>

          <p style={styles.formSubtitle}>
            Enter your preferred visit date,
            time and message.
          </p>

          <form
            onSubmit={handleSubmit}
          >

            {/* ===============================
                VISIT DATE
                =============================== */}

            <div style={styles.formGroup}>

              <label
                htmlFor="visitDate"
                style={styles.formLabel}
              >
                Visit Date & Time
              </label>

              <input
                id="visitDate"
                type="datetime-local"
                value={visitDate}
                min={getMinDateTime()}
                onChange={(event) =>
                  setVisitDate(
                    event.target.value
                  )
                }
                disabled={submitting}
                style={styles.input}
              />

              <small style={styles.helpText}>
                Select a future date and time
                for your property visit.
              </small>

            </div>

            {/* ===============================
                MESSAGE
                =============================== */}

            <div style={styles.formGroup}>

              <label
                htmlFor="message"
                style={styles.formLabel}
              >
                Message
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                disabled={submitting}
                placeholder="Enter any message or requirements for the property owner..."
                rows="5"
                style={styles.textarea}
              />

            </div>

            {/* ===============================
                BUTTONS
                =============================== */}

            <div
              style={styles.actionContainer}
            >

              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  navigate(
                    `/customer/properties/${property.id}`
                  )
                }
                style={
                  styles.secondaryButton
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.bookButton,
                  opacity:
                    submitting ? 0.6 : 1,
                  cursor:
                    submitting
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {submitting
                  ? "Creating Booking..."
                  : "Confirm Booking"}
              </button>

            </div>

          </form>

        </div>

      </div>

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
    gap: "20px",
    flexWrap: "wrap",
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

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  propertyCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  propertyTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#222",
  },

  propertyId: {
    marginTop: "8px",
    color: "#777",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  propertyDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },

  label: {
    display: "block",
    fontSize: "13px",
    color: "#777",
    fontWeight: "600",
    marginBottom: "5px",
  },

  price: {
    fontSize: "20px",
    color: "#198754",
  },

  formCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "30px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  formTitle: {
    margin: 0,
    fontSize: "23px",
    color: "#222",
  },

  formSubtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  formGroup: {
    marginBottom: "22px",
  },

  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },

  helpText: {
    display: "block",
    marginTop: "6px",
    color: "#777",
    fontSize: "12px",
  },

  actionContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },

  bookButton: {
    padding: "11px 25px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#198754",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },

  secondaryButton: {
    padding: "11px 20px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
  },

  successBox: {
    maxWidth: "1000px",
    margin: "0 auto 20px",
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    borderRadius: "6px",
    padding: "15px",
    fontWeight: "600",
  },

  errorBox: {
    maxWidth: "1000px",
    margin: "0 auto 20px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
    borderRadius: "6px",
    padding: "15px",
    fontWeight: "600",
  },

  loadingBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "50px",
    textAlign: "center",
    maxWidth: "600px",
    margin: "50px auto",
  },

  icon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

};

export default CustomerCreateBooking;
