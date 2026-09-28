import { useEffect, useState } from "react";

import {
  createComplaint,
  getCustomerComplaints,
} from "../../api";

function CustomerComplaints() {

  // =====================================================
  // STATE
  // =====================================================

  const [user, setUser] = useState(null);

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    againstUserId: "",
    propertyId: "",
    title: "",
    description: "",
  });

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {

        const parsedUser =
          JSON.parse(storedUser);

        console.log(
          "Logged-in customer:",
          parsedUser
        );

        setUser(parsedUser);

      } else {

        setError(
          "Logged-in user information not found."
        );
      }

    } catch (err) {

      console.error(
        "Error reading logged-in user:",
        err
      );

      setError(
        "Unable to read logged-in user information."
      );
    }

  }, []);

  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = () => {

    if (!user) {
      return null;
    }

    return (
      user.userId ||
      user.id ||
      user._id
    );
  };

  // =====================================================
  // LOAD CUSTOMER COMPLAINTS
  // =====================================================

  useEffect(() => {

    const userId = getUserId();

    if (!userId) {
      return;
    }

    loadComplaints(userId);

  }, [user]);

  // =====================================================
  // LOAD COMPLAINTS
  // =====================================================

  const loadComplaints = async (userId) => {

    try {

      setLoading(true);

      setError("");

      console.log(
        "Loading complaints for customer:",
        userId
      );

      const response =
        await getCustomerComplaints(userId);

      console.log(
        "Customer complaints response:",
        response
      );

      if (
        response &&
        Array.isArray(response.data)
      ) {

        setComplaints(response.data);

      } else {

        setComplaints([]);
      }

    } catch (err) {

      console.error(
        "Error loading customer complaints:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load complaints."
      );

      setComplaints([]);

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT COMPLAINT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setSuccess("");

    const userId = getUserId();

    if (!userId) {

      setError(
        "Customer ID could not be found."
      );

      return;
    }

    if (!formData.title.trim()) {

      setError(
        "Complaint title is required."
      );

      return;
    }

    if (!formData.description.trim()) {

      setError(
        "Complaint description is required."
      );

      return;
    }

    try {

      setSubmitting(true);

      const complaintData = {

        userId: userId,

        againstUserId:
          formData.againstUserId.trim() ||
          null,

        propertyId:
          formData.propertyId.trim() ||
          null,

        title:
          formData.title.trim(),

        description:
          formData.description.trim(),
      };

      console.log(
        "Submitting complaint:",
        complaintData
      );

      const response =
        await createComplaint(
          complaintData
        );

      console.log(
        "Create complaint response:",
        response
      );

      setSuccess(
        "Complaint submitted successfully."
      );

      setFormData({
        againstUserId: "",
        propertyId: "",
        title: "",
        description: "",
      });

      setShowForm(false);

      await loadComplaints(userId);

    } catch (err) {

      console.error(
        "Error creating complaint:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to submit complaint."
      );

    } finally {

      setSubmitting(false);
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "PENDING":
        return "status-pending";

      case "UNDER_REVIEW":
        return "status-review";

      case "RESOLVED":
        return "status-resolved";

      case "REJECTED":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-IN"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div style={styles.page}>

        <h1 style={styles.heading}>
          My Complaints
        </h1>

        <p style={styles.loading}>
          Loading complaints...
        </p>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.heading}>
            My Complaints
          </h1>

          <p style={styles.subtitle}>
            Submit and track complaints related to
            properties or users.
          </p>

        </div>

        <button
          type="button"
          style={styles.addButton}
          onClick={() => {

            setShowForm(
              (previous) => !previous
            );

            setError("");

            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ New Complaint"}
        </button>

      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (

        <div style={styles.success}>
          {success}
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* =================================================
          CREATE COMPLAINT FORM
      ================================================= */}

      {showForm && (

        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            Submit Complaint
          </h2>

          <form
            onSubmit={handleSubmit}
          >

            {/* ===========================================
                AGAINST USER ID
            =========================================== */}

            <label style={styles.label}>
              Against User ID
            </label>

            <input
              type="text"
              name="againstUserId"
              value={
                formData.againstUserId
              }
              onChange={handleChange}
              placeholder="Optional"
              style={styles.input}
            />

            {/* ===========================================
                PROPERTY ID
            =========================================== */}

            <label style={styles.label}>
              Property ID
            </label>

            <input
              type="text"
              name="propertyId"
              value={
                formData.propertyId
              }
              onChange={handleChange}
              placeholder="Optional"
              style={styles.input}
            />

            {/* ===========================================
                TITLE
            =========================================== */}

            <label style={styles.label}>
              Complaint Title *
            </label>

            <input
              type="text"
              name="title"
              value={
                formData.title
              }
              onChange={handleChange}
              placeholder="Enter complaint title"
              style={styles.input}
            />

            {/* ===========================================
                DESCRIPTION
            =========================================== */}

            <label style={styles.label}>
              Description *
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Describe your complaint..."
              rows="6"
              style={styles.textarea}
            />

            {/* ===========================================
                SUBMIT
            =========================================== */}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitButton,
                opacity:
                  submitting ? 0.6 : 1,
              }}
            >

              {submitting
                ? "Submitting..."
                : "Submit Complaint"}

            </button>

          </form>

        </div>
      )}

      {/* =================================================
          COMPLAINT COUNT
      ================================================= */}

      <div style={styles.countCard}>

        <h2>
          Total Complaints:{" "}
          {complaints.length}
        </h2>

      </div>

      {/* =================================================
          NO COMPLAINTS
      ================================================= */}

      {complaints.length === 0 ? (

        <div style={styles.emptyCard}>

          <h2>
            No Complaints Found
          </h2>

          <p>
            You have not submitted any complaints yet.
          </p>

        </div>

      ) : (

        <div>

          {complaints.map(
            (complaint) => (

              <div
                key={complaint.id}
                style={styles.complaintCard}
              >

                {/* =====================================
                    HEADER
                ===================================== */}

                <div style={styles.cardHeader}>

                  <div>

                    <h2>
                      {complaint.title}
                    </h2>

                    <p style={styles.idText}>
                      Complaint ID:{" "}
                      {complaint.id}
                    </p>

                  </div>

                  <span
                    className={getStatusClass(
                      complaint.status
                    )}
                    style={
                      styles.status
                    }
                  >
                    {complaint.status}
                  </span>

                </div>

                {/* =====================================
                    DETAILS
                ===================================== */}

                <div style={styles.details}>

                  <div>

                    <strong>
                      Property ID
                    </strong>

                    <p>
                      {complaint.propertyId ||
                        "Not specified"}
                    </p>

                  </div>

                  <div>

                    <strong>
                      Against User
                    </strong>

                    <p>
                      {complaint.againstUserId ||
                        "Not specified"}
                    </p>

                  </div>

                  <div>

                    <strong>
                      Created At
                    </strong>

                    <p>
                      {formatDate(
                        complaint.createdAt
                      )}
                    </p>

                  </div>

                  <div>

                    <strong>
                      Updated At
                    </strong>

                    <p>
                      {formatDate(
                        complaint.updatedAt
                      )}
                    </p>

                  </div>

                </div>

                {/* =====================================
                    DESCRIPTION
                ===================================== */}

                <div style={styles.descriptionBox}>

                  <strong>
                    Your Complaint
                  </strong>

                  <p>
                    {complaint.description}
                  </p>

                </div>

                {/* =====================================
                    ADMIN REMARK
                ===================================== */}

                {complaint.adminRemark && (

                  <div style={styles.remarkBox}>

                    <strong>
                      Admin Remark
                    </strong>

                    <p>
                      {complaint.adminRemark}
                    </p>

                  </div>
                )}

              </div>
            )
          )}

        </div>
      )}

      {/* =================================================
          INTERNAL CSS
      ================================================= */}

      <style>
        {`

          .status-pending {
            background: #fff3cd;
            color: #856404;
          }

          .status-review {
            background: #cfe2ff;
            color: #084298;
          }

          .status-resolved {
            background: #d1e7dd;
            color: #0f5132;
          }

          .status-rejected {
            background: #f8d7da;
            color: #842029;
          }

          .status-default {
            background: #e2e3e5;
            color: #41464b;
          }

        `}
      </style>

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#666",
    marginTop: "8px",
  },

  addButton: {
    background: "#198754",
    color: "white",
    border: "none",
    padding: "13px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  success: {
    background: "#d1e7dd",
    color: "#0f5132",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px",
  },

  error: {
    background: "#f8d7da",
    color: "#842029",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px",
  },

  loading: {
    fontSize: "18px",
    color: "#666",
  },

  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "25px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },

  formTitle: {
    marginTop: 0,
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginTop: "15px",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
  },

  submitButton: {
    marginTop: "20px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  countCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.06)",
  },

  emptyCard: {
    background: "#fff",
    padding: "60px 20px",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.06)",
  },

  complaintCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    borderBottom:
      "1px solid #eee",
    paddingBottom: "15px",
  },

  idText: {
    color: "#777",
    fontSize: "13px",
  },

  status: {
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  details: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },

  descriptionBox: {
    background: "#f8f9fa",
    padding: "18px",
    borderRadius: "7px",
    marginTop: "20px",
  },

  remarkBox: {
    background: "#fff3cd",
    padding: "18px",
    borderRadius: "7px",
    marginTop: "15px",
  },
};

export default CustomerComplaints;