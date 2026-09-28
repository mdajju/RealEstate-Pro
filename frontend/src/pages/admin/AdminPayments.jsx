import { useEffect, useState } from "react";

import {
  getAllPayments,
  markPaymentSuccessful,
  markPaymentFailed,
  cancelPayment,
  refundPayment,
  deletePayment,
} from "../../api";


function AdminPayments() {

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);


  // =========================================
  // LOAD ALL PAYMENTS
  // =========================================

  const loadPayments = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await getAllPayments();


      if (
        response &&
        response.success
      ) {

        setPayments(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } else {

        setPayments([]);

        setError(
          response?.message ||
          "Failed to load payments."
        );

      }

    } catch (error) {

      console.error(
        "Payment loading error:",
        error
      );


      setPayments([]);

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load payments."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD PAYMENTS WHEN PAGE OPENS
  // =========================================

  useEffect(() => {

    loadPayments();

  }, []);


  // =========================================
  // FORMAT AMOUNT
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


    if (Number.isNaN(numericAmount)) {

      return "₹0";

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
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    try {

      return new Date(date).toLocaleString(
        "en-IN"
      );

    } catch {

      return date;

    }

  };


  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {

    switch (status) {

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


      case "REFUNDED":

        return {
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
        };


      case "CANCELLED":

        return {
          backgroundColor: "#e2e3e5",
          color: "#383d41",
        };


      case "PENDING":

        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
        };


      default:

        return {
          backgroundColor: "#eeeeee",
          color: "#333333",
        };

    }

  };


  // =========================================
  // PAYMENT ACTION
  // =========================================

  const handlePaymentAction = async (
    paymentId,
    action
  ) => {

    try {

      setActionLoading(paymentId);

      setError("");


      let response;


      // =====================================
      // MARK SUCCESSFUL
      // =====================================

      if (action === "success") {

        response =
          await markPaymentSuccessful(
            paymentId
          );

      }


      // =====================================
      // MARK FAILED
      // =====================================

      else if (action === "failed") {

        response =
          await markPaymentFailed(
            paymentId
          );

      }


      // =====================================
      // CANCEL PAYMENT
      // =====================================

      else if (action === "cancel") {

        response =
          await cancelPayment(
            paymentId
          );

      }


      // =====================================
      // REFUND PAYMENT
      // =====================================

      else if (action === "refund") {

        response =
          await refundPayment(
            paymentId
          );

      }


      // =====================================
      // DELETE PAYMENT
      // =====================================

      else if (action === "delete") {

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this payment?"
          );


        if (!confirmed) {

          setActionLoading(null);

          return;

        }


        response =
          await deletePayment(
            paymentId
          );

      }


      // =====================================
      // UNKNOWN ACTION
      // =====================================

      else {

        setError(
          "Invalid payment action."
        );

        return;

      }


      // =====================================
      // HANDLE RESPONSE
      // =====================================

      if (
        response &&
        response.success
      ) {

        await loadPayments();

      } else {

        setError(
          response?.message ||
          "Payment operation failed."
        );

      }

    } catch (error) {

      console.error(
        "Payment action error:",
        error
      );


      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Payment operation failed."
      );

    } finally {

      setActionLoading(null);

    }

  };


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {

    return (

      <div style={styles.page}>

        <div style={styles.header}>

          <div>

            <h1 style={styles.title}>
              Payment Management
            </h1>

            <p style={styles.subtitle}>
              View and manage all payment
              transactions.
            </p>

          </div>

        </div>


        <div style={styles.loadingBox}>

          <p style={styles.centerText}>
            Loading payments...
          </p>

        </div>

      </div>

    );

  }


  // =========================================
  // MAIN PAGE
  // =========================================

  return (

    <div style={styles.page}>


      {/* =====================================
          HEADER
          ===================================== */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Payment Management
          </h1>

          <p style={styles.subtitle}>
            View and manage all payment
            transactions.
          </p>

        </div>


        <button
          onClick={loadPayments}
          disabled={loading}
          style={styles.refreshButton}
        >
          Refresh
        </button>

      </div>


      {/* =====================================
          ERROR
          ===================================== */}

      {error && (

        <div style={styles.errorBox}>

          <strong>
            Error:
          </strong>{" "}

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
          EMPTY STATE
          ===================================== */}

      {payments.length === 0 ? (

        <div style={styles.emptyBox}>

          <h3>
            No Payments Found
          </h3>

          <p>
            There are no payment records
            available.
          </p>

        </div>

      ) : (

        <div>


          {/* =================================
              PAYMENT CARDS
              ================================= */}

          {payments.map((payment) => (

            <div
              key={payment.id}
              style={styles.card}
            >


              {/* =============================
                  PAYMENT HEADER
                  ============================= */}

              <div
                style={styles.cardHeader}
              >

                <div>

                  <h2
                    style={
                      styles.paymentTitle
                    }
                  >
                    {payment.description ||
                      "Payment"}
                  </h2>


                  <p
                    style={
                      styles.paymentId
                    }
                  >
                    Payment ID:{" "}

                    {payment.id || "-"}
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
                    "UNKNOWN"}
                </span>

              </div>


              {/* =============================
                  PAYMENT DETAILS
                  ============================= */}

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
                    {formatDate(
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
                    {formatDate(
                      payment.updatedAt
                    )}
                  </span>

                </div>

              </div>


              {/* =================================
                  ACTION BUTTONS
                  ================================= */}

              <div
                style={
                  styles.actionContainer
                }
              >


                {/* =============================
                    PENDING ACTIONS
                    ============================= */}

                {payment.status ===
                  "PENDING" && (

                  <>

                    <button
                      disabled={
                        actionLoading ===
                        payment.id
                      }
                      onClick={() =>
                        handlePaymentAction(
                          payment.id,
                          "success"
                        )
                      }
                      style={
                        styles.successButton
                      }
                    >
                      Mark Successful
                    </button>


                    <button
                      disabled={
                        actionLoading ===
                        payment.id
                      }
                      onClick={() =>
                        handlePaymentAction(
                          payment.id,
                          "failed"
                        )
                      }
                      style={
                        styles.failedButton
                      }
                    >
                      Mark Failed
                    </button>


                    <button
                      disabled={
                        actionLoading ===
                        payment.id
                      }
                      onClick={() =>
                        handlePaymentAction(
                          payment.id,
                          "cancel"
                        )
                      }
                      style={
                        styles.cancelButton
                      }
                    >
                      Cancel
                    </button>

                  </>

                )}


                {/* =============================
                    SUCCESS ACTION
                    ============================= */}

                {payment.status ===
                  "SUCCESS" && (

                  <button
                    disabled={
                      actionLoading ===
                      payment.id
                    }
                    onClick={() =>
                      handlePaymentAction(
                        payment.id,
                        "refund"
                      )
                    }
                    style={
                      styles.refundButton
                    }
                  >
                    Refund Payment
                  </button>

                )}


                {/* =============================
                    DELETE
                    ============================= */}

                <button
                  disabled={
                    actionLoading ===
                    payment.id
                  }
                  onClick={() =>
                    handlePaymentAction(
                      payment.id,
                      "delete"
                    )
                  }
                  style={
                    styles.deleteButton
                  }
                >
                  Delete
                </button>

              </div>


              {/* =================================
                  ACTION LOADING
                  ================================= */}

              {actionLoading ===
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

          ))}

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


  refreshButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
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
    color: "#222",
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


  paymentTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#333",
  },


  paymentId: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#777",
    wordBreak: "break-all",
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


  successButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },


  failedButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },


  cancelButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#6c757d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },


  refundButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0d6efd",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },


  deleteButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#b02a37",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },


  actionLoading: {
    marginTop: "12px",
    color: "#666",
    fontSize: "14px",
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
    padding: "40px",
    textAlign: "center",
  },


  loadingBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "40px",
  },


  centerText: {
    textAlign: "center",
    margin: 0,
    color: "#666",
  },

};


export default AdminPayments;