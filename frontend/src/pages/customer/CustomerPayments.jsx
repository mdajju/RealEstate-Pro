import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCustomerPayments,
  cancelPayment,
} from "../../api";

function CustomerPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  // =========================================
  // LOAD CUSTOMER PAYMENTS
  // =========================================

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
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

      const user = JSON.parse(storedUser);

      console.log(
        "Logged-in user:",
        user
      );

      // =========================================
      // CHECK CUSTOMER ROLE
      // =========================================

      if (user.role !== "CUSTOMER") {
        setError(
          "Only customers can view customer payments."
        );
        return;
      }

      // =========================================
      // GET CUSTOMER ID
      // =========================================

      const customerId =
        user.userId;

      if (!customerId) {
        setError(
          "Customer ID not found. Please login again."
        );
        return;
      }

      console.log(
        "Loading payments for customer:",
        customerId
      );

      // =========================================
      // API CALL
      // =========================================

      const result =
        await getCustomerPayments(
          customerId
        );

      console.log(
        "Customer payments response:",
        result
      );

      if (result.success) {
        setPayments(
          result.data || []
        );
      } else {
        setError(
          result.message ||
            "Unable to load your payments."
        );
      }
    } catch (err) {
      console.error(
        "Get customer payments error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load your payments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FORMAT AMOUNT
  // =========================================

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined
    ) {
      return "₹0";
    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(amount);
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDateTime = (
    dateValue
  ) => {
    if (!dateValue) {
      return "-";
    }

    try {
      return new Date(
        dateValue
      ).toLocaleString();
    } catch {
      return dateValue;
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

    switch (normalizedStatus) {
      case "SUCCESS":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
        };

      case "FAILED":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
        };

      case "PENDING":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
        };

      case "CANCELLED":
        return {
          backgroundColor: "#e2e3e5",
          color: "#383d41",
        };

      case "REFUNDED":
        return {
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
        };

      default:
        return {
          backgroundColor: "#eeeeee",
          color: "#333333",
        };
    }
  };

  // =========================================
  // CANCEL PAYMENT
  // =========================================

  const handleCancelPayment =
    async (paymentId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this payment?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancellingId(
          paymentId
        );

        setMessage("");
        setError("");

        const result =
          await cancelPayment(
            paymentId
          );

        console.log(
          "Cancel payment response:",
          result
        );

        if (result.success) {
          setMessage(
            result.message ||
              "Payment cancelled successfully."
          );

          // Reload payments
          await loadPayments();
        } else {
          setError(
            result.message ||
              "Unable to cancel payment."
          );
        }
      } catch (err) {
        console.error(
          "Cancel payment error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to cancel payment."
        );
      } finally {
        setCancellingId(null);
      }
    };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>
          My Payments
        </h1>

        <p style={styles.centerText}>
          Loading your payments...
        </p>
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
            My Payments
          </h1>

          <p style={styles.subtitle}>
            View and manage your property
            payment transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPayments}
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
          TOTAL PAYMENTS
          ===================================== */}

      <div style={styles.totalBox}>

        <h2 style={styles.totalTitle}>
          Total Payments:{" "}
          {payments.length}
        </h2>

      </div>

      {/* =====================================
          EMPTY
          ===================================== */}

      {payments.length === 0 ? (

        <div style={styles.emptyBox}>

          <h3>
            No Payments Found
          </h3>

          <p>
            You don't have any payment
            records yet.
          </p>

        </div>

      ) : (

        <div>

          {/* =================================
              PAYMENT LIST
              ================================= */}

          {payments.map(
            (payment) => (

              <div
                key={payment.id}
                style={styles.card}
              >

                {/* ===========================
                    HEADER
                    =========================== */}

                <div
                  style={
                    styles.cardHeader
                  }
                >

                  <div>

                    <h2
                      style={
                        styles.paymentTitle
                      }
                    >
                      {payment.description ||
                        "Property Payment"}
                    </h2>

                    <p
                      style={
                        styles.paymentId
                      }
                    >
                      Payment ID:{" "}
                      {payment.id ||
                        "-"}
                    </p>

                  </div>

                  <span
                    style={{
                      ...styles.status,
                      ...getStatusStyle(
                        payment.status
                      ),
                    }}
                  >
                    {payment.status ||
                      "-"}
                  </span>

                </div>

                {/* ===========================
                    PAYMENT DETAILS
                    =========================== */}

                <div
                  style={
                    styles.detailsGrid
                  }
                >

                  {/* BOOKING ID */}

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
                      Booking ID
                    </span>

                    <span
                      style={
                        styles.detailValue
                      }
                    >
                      {payment.bookingId ||
                        "-"}
                    </span>
                  </div>

                  {/* CUSTOMER */}

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
                      Customer
                    </span>

                    <span
                      style={
                        styles.detailValue
                      }
                    >
                      {payment.customerName ||
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
                      {payment.ownerName ||
                        "-"}
                    </span>
                  </div>

                  {/* AMOUNT */}

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
                      Amount
                    </span>

                    <span
                      style={styles.amount}
                    >
                      {formatAmount(
                        payment.amount
                      )}
                    </span>
                  </div>

                  {/* PAYMENT METHOD */}

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
                      Payment Method
                    </span>

                    <span
                      style={
                        styles.detailValue
                      }
                    >
                      {payment.paymentMethod ||
                        "-"}
                    </span>
                  </div>

                  {/* TRANSACTION ID */}

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
                      Transaction ID
                    </span>

                    <span
                      style={
                        styles.detailValue
                      }
                    >
                      {payment.transactionId ||
                        "-"}
                    </span>
                  </div>

                  {/* CREATED AT */}

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
                      {formatDateTime(
                        payment.createdAt
                      )}
                    </span>
                  </div>

                  {/* UPDATED AT */}

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
                      {formatDateTime(
                        payment.updatedAt
                      )}
                    </span>
                  </div>

                </div>

                {/* ===========================
                    ACTIONS
                    =========================== */}

                <div
                  style={
                    styles.actionContainer
                  }
                >

                  {/* VIEW BOOKING */}

                  {payment.bookingId && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/customer/bookings/${payment.bookingId}`
                        )
                      }
                      style={
                        styles.viewButton
                      }
                    >
                      View Booking
                    </button>
                  )}

                  {/* CANCEL PAYMENT */}

                  {String(
                    payment.status || ""
                  ).toUpperCase() ===
                    "PENDING" && (

                    <button
                      type="button"
                      disabled={
                        cancellingId ===
                        payment.id
                      }
                      onClick={() =>
                        handleCancelPayment(
                          payment.id
                        )
                      }
                      style={{
                        ...styles.cancelButton,
                        cursor:
                          cancellingId ===
                          payment.id
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          cancellingId ===
                          payment.id
                            ? 0.6
                            : 1,
                      }}
                    >
                      {cancellingId ===
                      payment.id
                        ? "Cancelling..."
                        : "Cancel Payment"}
                    </button>

                  )}

                </div>

                {/* ACTION LOADING */}

                {cancellingId ===
                  payment.id && (

                  <p
                    style={
                      styles.actionLoading
                    }
                  >
                    Processing payment...
                  </p>

                )}

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
    borderBottom:
      "1px solid #eee",
    paddingBottom: "15px",
  },

  paymentTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#333",
  },

  paymentId: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#777",
  },

  status: {
    padding: "7px 14px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "13px",
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

  amount: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111",
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
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#6c757d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },

  cancelButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: "14px",
  },

  actionLoading: {
    marginTop: "12px",
    color: "#666",
    fontSize: "14px",
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

  emptyBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center",
  },

  centerText: {
    textAlign: "center",
    marginTop: "50px",
    color: "#666",
  },

};

export default CustomerPayments;