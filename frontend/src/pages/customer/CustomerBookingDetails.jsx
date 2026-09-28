
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getBookingById,
  cancelBooking,
  createPayment,
  getBookingPayments,
} from "../../api";

function CustomerBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================
  // BOOKING STATE
  // =========================================

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // MESSAGE STATE
  // =========================================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // BOOKING ACTION STATE
  // =========================================

  const [cancelling, setCancelling] = useState(false);

  // =========================================
  // PAYMENT STATE
  // =========================================

  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [paymentDescription, setPaymentDescription] =
    useState("");

  const [creatingPayment, setCreatingPayment] =
    useState(false);

  // =========================================
  // LOAD BOOKING DETAILS
  // =========================================

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await getBookingById(id);

      console.log(
        "Customer booking details response:",
        result
      );

      if (result.success) {
        setBooking(result.data);

        // Load payments for this booking
        await loadBookingPayments(id);
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
  // LOAD BOOKING PAYMENTS
  // =========================================

  const loadBookingPayments = async (
    bookingId
  ) => {
    try {
      setPaymentLoading(true);

      const result =
        await getBookingPayments(
          bookingId
        );

      console.log(
        "Booking payments response:",
        result
      );

      if (result.success) {
        setPayments(
          result.data || []
        );
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error(
        "Get booking payments error:",
        err
      );

      setPayments([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  // =========================================
  // CANCEL BOOKING
  // =========================================

  const handleCancel = async () => {
    if (!booking) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setMessage("");
      setError("");

      const result =
        await cancelBooking(
          booking.id
        );

      console.log(
        "Cancel booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking cancelled successfully."
        );

        if (result.data) {
          setBooking(result.data);
        } else {
          await loadBooking();
        }
      } else {
        setError(
          result.message ||
            "Unable to cancel booking."
        );
      }
    } catch (err) {
      console.error(
        "Cancel booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  // =========================================
  // CREATE PAYMENT
  // =========================================

  const handleCreatePayment =
    async () => {
      if (!booking) {
        return;
      }

      // Get logged-in customer
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
        user = JSON.parse(
          storedUser
        );
      } catch {
        setError(
          "Invalid user information. Please login again."
        );
        return;
      }

      const customerId =
        user.userId;

      if (!customerId) {
        setError(
          "Customer ID not found. Please login again."
        );
        return;
      }

      // Validate booking information
      if (!booking.id) {
        setError(
          "Booking ID is missing."
        );
        return;
      }

      if (!booking.ownerId) {
        setError(
          "Owner ID is missing from this booking."
        );
        return;
      }

      if (
        booking.propertyPrice ===
          null ||
        booking.propertyPrice ===
          undefined
      ) {
        setError(
          "Property price is not available."
        );
        return;
      }

      try {
        setCreatingPayment(true);
        setMessage("");
        setError("");

        const paymentData = {
          bookingId: booking.id,

          customerId: customerId,

          ownerId: booking.ownerId,

          amount: Number(
            booking.propertyPrice
          ),

          paymentMethod:
            paymentMethod,

          description:
            paymentDescription.trim() ||
            `Payment for ${booking.propertyTitle || "property booking"}`,
        };

        console.log(
          "Creating payment with data:",
          paymentData
        );

        const result =
          await createPayment(
            paymentData
          );

        console.log(
          "Create payment response:",
          result
        );

        if (result.success) {
          setMessage(
            result.message ||
              "Payment initiated successfully."
          );

          setShowPaymentForm(false);

          setPaymentDescription("");

          // Reload booking payments
          await loadBookingPayments(
            booking.id
          );
        } else {
          setError(
            result.message ||
              "Unable to create payment."
          );
        }
      } catch (err) {
        console.error(
          "Create payment error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to create payment."
        );
      } finally {
        setCreatingPayment(false);
      }
    };

  // =========================================
  // CHECK SUCCESS PAYMENT
  // =========================================

  const successfulPayment =
    payments.find(
      (payment) =>
        String(
          payment.status || ""
        ).toUpperCase() ===
        "SUCCESS"
    );

  // =========================================
  // CHECK PENDING PAYMENT
  // =========================================

  const pendingPayment =
    payments.find(
      (payment) =>
        String(
          payment.status || ""
        ).toUpperCase() ===
        "PENDING"
    );

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

    if (
      normalizedStatus ===
      "PENDING"
    ) {
      return {
        color: "#f39c12",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "ACCEPTED"
    ) {
      return {
        color: "green",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "COMPLETED"
    ) {
      return {
        color: "#007bff",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "REJECTED"
    ) {
      return {
        color: "#dc3545",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "CANCELLED"
    ) {
      return {
        color: "gray",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "SUCCESS"
    ) {
      return {
        color: "green",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "FAILED"
    ) {
      return {
        color: "#dc3545",
        fontWeight: "bold",
      };
    }

    if (
      normalizedStatus ===
      "REFUNDED"
    ) {
      return {
        color: "#007bff",
        fontWeight: "bold",
      };
    }

    return {
      fontWeight: "bold",
    };
  };

  // =========================================
  // FORMAT AMOUNT
  // =========================================

  const formatAmount = (
    amount
  ) => {
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
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div>
        <h2>
          Booking Details
        </h2>

        <p>
          Loading booking details...
        </p>
      </div>
    );
  }

  // =========================================
  // ERROR / NOT FOUND
  // =========================================

  if (!booking) {
    return (
      <div>
        <h2>
          Booking Details
        </h2>

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

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customer/bookings"
            )
          }
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  const status = String(
    booking.status || ""
  ).toUpperCase();

  const canCancel =
    status === "PENDING" ||
    status === "ACCEPTED";

  // Payment is allowed only for
  // an accepted booking.
  const canMakePayment =
    status === "ACCEPTED" &&
    !successfulPayment &&
    !pendingPayment;

  // =========================================
  // PAGE
  // =========================================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <h2>
        Customer Booking Details
      </h2>

      <p>
        View complete information about
        your property booking.
      </p>

      {/* =========================================
          SUCCESS MESSAGE
          ========================================= */}

      {message && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "6px",
            marginTop: "15px",
          }}
        >
          {message}
        </div>
      )}

      {/* =========================================
          ERROR MESSAGE
          ========================================= */}

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            marginTop: "15px",
          }}
        >
          {error}
        </div>
      )}

      {/* =========================================
          BOOKING INFORMATION
          ========================================= */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "25px",
          marginTop: "20px",
          backgroundColor: "#fff",
        }}
      >
        <h3>
          Booking Information
        </h3>

        <p>
          <strong>
            Booking ID:
          </strong>{" "}
          {booking.id || "-"}
        </p>

        <p>
          <strong>
            Status:
          </strong>{" "}
          <span
            style={getStatusStyle(
              booking.status
            )}
          >
            {booking.status || "-"}
          </span>
        </p>

        <p>
          <strong>
            Active:
          </strong>{" "}
          {booking.active
            ? "Yes"
            : "No"}
        </p>

        <hr />

        {/* =========================================
            PROPERTY INFORMATION
            ========================================= */}

        <h3>
          Property Information
        </h3>

        <p>
          <strong>
            Property ID:
          </strong>{" "}
          {booking.propertyId || "-"}
        </p>

        <p>
          <strong>
            Property Title:
          </strong>{" "}
          {booking.propertyTitle || "-"}
        </p>

        <p>
          <strong>
            Property Address:
          </strong>{" "}
          {booking.propertyAddress || "-"}
        </p>

        <p>
          <strong>
            Property Price:
          </strong>{" "}
          {booking.propertyPrice !==
            undefined &&
          booking.propertyPrice !==
            null
            ? formatAmount(
                booking.propertyPrice
              )
            : "-"}
        </p>

        <hr />

        {/* =========================================
            CUSTOMER INFORMATION
            ========================================= */}

        <h3>
          Customer Information
        </h3>

        <p>
          <strong>
            Customer ID:
          </strong>{" "}
          {booking.customerId || "-"}
        </p>

        <p>
          <strong>
            Customer Name:
          </strong>{" "}
          {booking.customerName || "-"}
        </p>

        <hr />

        {/* =========================================
            OWNER INFORMATION
            ========================================= */}

        <h3>
          Owner Information
        </h3>

        <p>
          <strong>
            Owner ID:
          </strong>{" "}
          {booking.ownerId || "-"}
        </p>

        <p>
          <strong>
            Owner Name:
          </strong>{" "}
          {booking.ownerName || "-"}
        </p>

        <hr />

        {/* =========================================
            VISIT INFORMATION
            ========================================= */}

        <h3>
          Visit Information
        </h3>

        <p>
          <strong>
            Visit Date:
          </strong>{" "}
          {formatDateTime(
            booking.visitDate
          )}
        </p>

        <p>
          <strong>
            Message:
          </strong>{" "}
          {booking.message || "-"}
        </p>

        <hr />

        {/* =========================================
            BOOKING TIMELINE
            ========================================= */}

        <h3>
          Booking Timeline
        </h3>

        <p>
          <strong>
            Created At:
          </strong>{" "}
          {formatDateTime(
            booking.createdAt
          )}
        </p>

        <p>
          <strong>
            Updated At:
          </strong>{" "}
          {formatDateTime(
            booking.updatedAt
          )}
        </p>

        {/* =========================================
            PAYMENT SECTION
            ========================================= */}

        <hr />

        <h3>
          Payment
        </h3>

        {paymentLoading ? (
          <p>
            Loading payment information...
          </p>
        ) : successfulPayment ? (
          <div
            style={{
              backgroundColor: "#d4edda",
              border:
                "1px solid #c3e6cb",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: "#155724",
                fontWeight: "bold",
              }}
            >
              Payment Successful
            </p>

            <p>
              <strong>
                Amount:
              </strong>{" "}
              {formatAmount(
                successfulPayment.amount
              )}
            </p>

            <p>
              <strong>
                Payment Method:
              </strong>{" "}
              {successfulPayment.paymentMethod ||
                "-"}
            </p>

            <p>
              <strong>
                Transaction ID:
              </strong>{" "}
              {successfulPayment.transactionId ||
                "-"}
            </p>

            <p>
              <strong>
                Payment Date:
              </strong>{" "}
              {formatDateTime(
                successfulPayment.createdAt
              )}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/customer/payments"
                )
              }
              style={{
                marginTop: "10px",
                backgroundColor:
                  "#007bff",
                color: "white",
                border: "none",
                padding: "9px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View My Payments
            </button>
          </div>
        ) : pendingPayment ? (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border:
                "1px solid #ffeeba",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: "#856404",
                fontWeight: "bold",
              }}
            >
              Payment Pending
            </p>

            <p>
              A payment has already been
              initiated for this booking.
            </p>

            <p>
              <strong>
                Amount:
              </strong>{" "}
              {formatAmount(
                pendingPayment.amount
              )}
            </p>

            <p>
              <strong>
                Payment Method:
              </strong>{" "}
              {pendingPayment.paymentMethod ||
                "-"}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/customer/payments"
                )
              }
              style={{
                marginTop: "10px",
                backgroundColor:
                  "#6c757d",
                color: "white",
                border: "none",
                padding: "9px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View My Payments
            </button>
          </div>
        ) : (
          <div>
            <p>
              No payment has been initiated
              for this booking.
            </p>

            {status === "ACCEPTED" && (
              <button
                type="button"
                onClick={() =>
                  setShowPaymentForm(
                    !showPaymentForm
                  )
                }
                style={{
                  backgroundColor:
                    "#198754",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {showPaymentForm
                  ? "Close Payment Form"
                  : "Make Payment"}
              </button>
            )}

            {status !== "ACCEPTED" && (
              <p
                style={{
                  color: "#666",
                }}
              >
                Payment can be initiated
                after the owner accepts
                your booking.
              </p>
            )}
          </div>
        )}

        {/* =========================================
            PAYMENT FORM
            ========================================= */}

        {showPaymentForm &&
          canMakePayment && (
            <div
              style={{
                marginTop: "20px",
                border:
                  "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor:
                  "#f8f9fa",
              }}
            >
              <h3>
                Make Payment
              </h3>

              <p>
                <strong>
                  Property:
                </strong>{" "}
                {booking.propertyTitle ||
                  "-"}
              </p>

              <p>
                <strong>
                  Amount:
                </strong>{" "}
                {formatAmount(
                  booking.propertyPrice
                )}
              </p>

              {/* PAYMENT METHOD */}

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Payment Method
                </label>

               <select
  value={paymentMethod}
  onChange={(e) =>
    setPaymentMethod(e.target.value)
  }
  disabled={creatingPayment}
  style={{
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  }}
>
  <option value="UPI">
    UPI
  </option>

  <option value="CARD">
    Card
  </option>

  <option value="NET_BANKING">
    Net Banking
  </option>

  <option value="WALLET">
    Wallet
  </option>

  <option value="CASH">
    Cash
  </option>
</select>
              </div>

              {/* DESCRIPTION */}

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Description
                </label>

                <textarea
                  value={
                    paymentDescription
                  }
                  onChange={(e) =>
                    setPaymentDescription(
                      e.target.value
                    )
                  }
                  disabled={
                    creatingPayment
                  }
                  placeholder="Enter payment description"
                  rows="3"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    padding: "10px",
                    border:
                      "1px solid #ccc",
                    borderRadius: "5px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* PAYMENT ACTIONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    handleCreatePayment
                  }
                  disabled={
                    creatingPayment
                  }
                  style={{
                    backgroundColor:
                      "#198754",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 18px",
                    borderRadius: "5px",
                    cursor:
                      creatingPayment
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      creatingPayment
                        ? 0.6
                        : 1,
                  }}
                >
                  {creatingPayment
                    ? "Creating Payment..."
                    : "Confirm Payment"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentForm(
                      false
                    )
                  }
                  disabled={
                    creatingPayment
                  }
                  style={{
                    backgroundColor:
                      "#6c757d",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 18px",
                    borderRadius: "5px",
                    cursor:
                      creatingPayment
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>

              <p
                style={{
                  marginTop: "15px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                Note: This step creates
                a payment record with
                PENDING status. Actual
                online payment gateway
                integration can be added
                later.
              </p>
            </div>
          )}

        {/* =========================================
            ACTION BUTTONS
            ========================================= */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "25px",
          }}
        >
          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/customer/bookings"
              )
            }
            style={{
              padding: "8px 14px",
              borderRadius: "4px",
              border:
                "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Back to My Bookings
          </button>

          {/* VIEW PAYMENTS */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/customer/payments"
              )
            }
            style={{
              backgroundColor:
                "#007bff",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            My Payments
          </button>

          {/* CANCEL BOOKING */}

          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                backgroundColor:
                  "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "4px",
                cursor:
                  cancelling
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerBookingDetails;
