import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProperties,
  deleteProperty,
} from "../../api";

function AdminProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =========================================
  // LOAD PROPERTIES
  // =========================================

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProperties();

      console.log("Properties response:", result);

      if (result.success) {
        setProperties(result.data || []);
      } else {
        setError(
          result.message || "Unable to load properties."
        );
      }
    } catch (err) {
      console.error("Get properties error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE PROPERTY
  // =========================================

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      const result = await deleteProperty(id);

      console.log("Delete property response:", result);

      if (result.success) {
        setMessage(
          result.message ||
            "Property deleted successfully."
        );

        // Remove deleted property from current list
        setProperties((previous) =>
          previous.filter(
            (property) => property.id !== id
          )
        );
      } else {
        setError(
          result.message ||
            "Property deletion failed."
        );
      }
    } catch (err) {
      console.error(
        "Delete property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete property."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div>
        <h2>Property Management</h2>
        <p>Loading properties...</p>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div>
      <h2>Property Management</h2>

      <p>
        Manage RealEstate Pro properties.
      </p>

      {/* Success Message */}

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

      {/* Error Message */}

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

      {/* Add Property */}

      <button
        type="button"
        onClick={() =>
          navigate("/admin/properties/create")
        }
        style={{
          marginBottom: "20px",
        }}
      >
        + Add Property
      </button>

      {/* No Properties */}

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div>
          <p>
            <strong>
              Total Properties: {properties.length}
            </strong>
          </p>

          {properties.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              {/* Property Title */}

              <h3>{property.title}</h3>

              {/* Property ID */}

              <p>
                <strong>Property ID:</strong>{" "}
                {property.id}
              </p>

              {/* Description */}

              <p>
                <strong>Description:</strong>{" "}
                {property.description || "-"}
              </p>

              {/* Price */}

              <p>
                <strong>Price:</strong>{" "}
                {property.price}
              </p>

              {/* Area */}

              <p>
                <strong>Area:</strong>{" "}
                {property.area}
              </p>

              {/* Status */}

              <p>
                <strong>Status:</strong>{" "}
                {property.status}
              </p>

              {/* Address */}

              <p>
                <strong>Address:</strong>{" "}
                {property.address}
              </p>

              {/* Active */}

              <p>
                <strong>Active:</strong>{" "}
                {property.active ? "Yes" : "No"}
              </p>

              {/* Buttons */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                {/* View */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/properties/${property.id}`
                    )
                  }
                >
                  View
                </button>

                {/* Edit */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/properties/${property.id}/edit`
                    )
                  }
                >
                  Edit
                </button>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      property.id,
                      property.title
                    )
                  }
                  disabled={
                    deletingId === property.id
                  }
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "4px",
                    cursor:
                      deletingId === property.id
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {deletingId === property.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProperties;