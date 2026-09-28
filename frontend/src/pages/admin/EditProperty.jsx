import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty } from "../../api";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [property, setProperty] = useState({
    title: "",
    description: "",
    propertyTypeId: "",
    ownerId: "",
    agentId: "",
    stateId: "",
    cityId: "",
    address: "",
    latitude: "",
    longitude: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    facing: "",
    status: "AVAILABLE",
    images: [],
    amenities: [],
  });

  // =========================================
  // LOAD PROPERTY
  // =========================================

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPropertyById(id);

        console.log("Property response:", result);

        if (result.success) {
          const data = result.data;

          setProperty({
            title: data.title || "",
            description: data.description || "",
            propertyTypeId: data.propertyTypeId || "",
            ownerId: data.ownerId || "",
            agentId: data.agentId || "",
            stateId: data.stateId || "",
            cityId: data.cityId || "",
            address: data.address || "",
            latitude: data.latitude ?? "",
            longitude: data.longitude ?? "",
            price: data.price ?? "",
            area: data.area ?? "",
            bedrooms: data.bedrooms ?? "",
            bathrooms: data.bathrooms ?? "",
            facing: data.facing || "",
            status: data.status || "AVAILABLE",
            images: data.images || [],
            amenities: data.amenities || [],
          });
        } else {
          setError(
            result.message || "Unable to load property."
          );
        }
      } catch (err) {
        console.error("Get property error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProperty((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE UPDATE
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const requestData = {
        title: property.title,
        description: property.description,
        propertyTypeId: property.propertyTypeId,
        ownerId: property.ownerId,
        agentId: property.agentId || null,
        stateId: property.stateId,
        cityId: property.cityId,
        address: property.address,

        latitude:
          property.latitude === ""
            ? null
            : Number(property.latitude),

        longitude:
          property.longitude === ""
            ? null
            : Number(property.longitude),

        price: Number(property.price),
        area: Number(property.area),

        bedrooms:
          property.bedrooms === ""
            ? null
            : Number(property.bedrooms),

        bathrooms:
          property.bathrooms === ""
            ? null
            : Number(property.bathrooms),

        facing: property.facing || null,
        status: property.status,
        images: property.images,
        amenities: property.amenities,
      };

      console.log(
        "Update property request:",
        requestData
      );

      const result = await updateProperty(
        id,
        requestData
      );

      console.log(
        "Update property response:",
        result
      );

      if (result.success) {
        setMessage(
          "Property updated successfully!"
        );

        setTimeout(() => {
          navigate("/admin/properties");
        }, 1000);
      } else {
        setError(
          result.message ||
            "Property update failed."
        );
      }
    } catch (err) {
      console.error(
        "Update property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div>
        <h2>Edit Property</h2>
        <p>Loading property details...</p>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div>
      <h2>Edit Property</h2>

      <p>
        Property ID: <strong>{id}</strong>
      </p>

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

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <div>
          <label>Property Title</label>

          <br />

          <input
            type="text"
            name="title"
            value={property.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Description */}
        <div>
          <label>Description</label>

          <br />

          <textarea
            name="description"
            value={property.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <br />

        {/* Property Type */}
        <div>
          <label>Property Type ID</label>

          <br />

          <input
            type="text"
            name="propertyTypeId"
            value={property.propertyTypeId}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Owner */}
        <div>
          <label>Owner ID</label>

          <br />

          <input
            type="text"
            name="ownerId"
            value={property.ownerId}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Agent */}
        <div>
          <label>Agent ID</label>

          <br />

          <input
            type="text"
            name="agentId"
            value={property.agentId}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* State */}
        <div>
          <label>State ID</label>

          <br />

          <input
            type="text"
            name="stateId"
            value={property.stateId}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* City */}
        <div>
          <label>City ID</label>

          <br />

          <input
            type="text"
            name="cityId"
            value={property.cityId}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Address */}
        <div>
          <label>Address</label>

          <br />

          <input
            type="text"
            name="address"
            value={property.address}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Latitude */}
        <div>
          <label>Latitude</label>

          <br />

          <input
            type="number"
            step="any"
            name="latitude"
            value={property.latitude}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Longitude */}
        <div>
          <label>Longitude</label>

          <br />

          <input
            type="number"
            step="any"
            name="longitude"
            value={property.longitude}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Price */}
        <div>
          <label>Price</label>

          <br />

          <input
            type="number"
            step="any"
            name="price"
            value={property.price}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Area */}
        <div>
          <label>Area</label>

          <br />

          <input
            type="number"
            step="any"
            name="area"
            value={property.area}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Bedrooms */}
        <div>
          <label>Bedrooms</label>

          <br />

          <input
            type="number"
            name="bedrooms"
            value={property.bedrooms}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Bathrooms */}
        <div>
          <label>Bathrooms</label>

          <br />

          <input
            type="number"
            name="bathrooms"
            value={property.bathrooms}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Facing */}
        <div>
          <label>Facing</label>

          <br />

          <input
            type="text"
            name="facing"
            value={property.facing}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Status */}
        <div>
          <label>Status</label>

          <br />

          <select
            name="status"
            value={property.status}
            onChange={handleChange}
          >
            <option value="AVAILABLE">
              AVAILABLE
            </option>

            <option value="SOLD">
              SOLD
            </option>

            <option value="RENTED">
              RENTED
            </option>

            <option value="PENDING">
              PENDING
            </option>
          </select>
        </div>

        <br />

        {/* Buttons */}
        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Updating..."
            : "Update Property"}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/properties")
          }
          style={{
            marginLeft: "10px",
          }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}

export default EditProperty;