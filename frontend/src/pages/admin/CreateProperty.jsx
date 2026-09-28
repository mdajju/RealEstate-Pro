import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProperty,
  getPropertyTypes,
  getStates,
  getCitiesByState,
  getUsers,
} from "../../api";

function CreateProperty() {
  const navigate = useNavigate();

  // =========================================
  // Dropdown Data
  // =========================================

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [owners, setOwners] = useState([]);
  const [agents, setAgents] = useState([]);

  // =========================================
  // Messages
  // =========================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // Form State
  // =========================================

  const [formData, setFormData] = useState({
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
  // Load Initial Data
  // =========================================

  useEffect(() => {
    loadInitialData();
  }, []);

  // =========================================
  // Load Cities When State Changes
  // =========================================

  useEffect(() => {
    if (formData.stateId) {
      loadCities(formData.stateId);
    } else {
      setCities([]);
    }
  }, [formData.stateId]);

  // =========================================
  // Load Dropdown Data
  // =========================================

  const loadInitialData = async () => {
    try {
      const [
        propertyTypeRes,
        stateRes,
        usersRes,
      ] = await Promise.all([
        getPropertyTypes(),
        getStates(),
        getUsers(),
      ]);

      if (propertyTypeRes?.success) {
        setPropertyTypes(propertyTypeRes.data || []);
      }

      if (stateRes?.success) {
        setStates(stateRes.data || []);
      }

      if (usersRes?.success) {
        const users = usersRes.data || [];

        setOwners(
          users.filter(
            (user) =>
              user.roleName === "OWNER" ||
              user.role?.roleName === "OWNER"
          )
        );

        setAgents(
          users.filter(
            (user) =>
              user.roleName === "AGENT" ||
              user.role?.roleName === "AGENT"
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dropdown data.");
    }
  };

  // =========================================
  // Load Cities
  // =========================================

  const loadCities = async (stateId) => {
    try {
      const response = await getCitiesByState(stateId);

      if (response?.success) {
        setCities(response.data || []);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error(err);
      setCities([]);
    }
  };

  // =========================================
  // Handle Input Change
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // Handle Submit
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...formData,

        latitude: formData.latitude
          ? parseFloat(formData.latitude)
          : null,

        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : null,

        price: Number(formData.price),

        area: Number(formData.area),

        bedrooms: formData.bedrooms
          ? Number(formData.bedrooms)
          : 0,

        bathrooms: formData.bathrooms
          ? Number(formData.bathrooms)
          : 0,
      };

      const result = await createProperty(payload);

      if (result.success) {
        setMessage(result.message || "Property created successfully.");

        setTimeout(() => {
          navigate("/admin/properties");
        }, 1500);
      } else {
        setError(result.message || "Unable to create property.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create property."
      );
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="container mt-4">
      <h2>Create Property</h2>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Title */}

        <div className="mb-3">
          <label className="form-label">
            Title
          </label>

          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}

        <div className="mb-3">
          <label className="form-label">
            Description
          </label>

          <textarea
            name="description"
            rows="4"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Property Type */}

        <div className="mb-3">
          <label className="form-label">
            Property Type
          </label>

          <select
            className="form-control"
            name="propertyTypeId"
            value={formData.propertyTypeId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Property Type
            </option>

            {propertyTypes.map((type) => (
  <option
    key={type.id}
    value={type.id}
  >
    {type.typeName}
  </option>
))}
          </select>
        </div>

        {/* Owner */}

        <div className="mb-3">
          <label className="form-label">
            Owner
          </label>

          <select
            className="form-control"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Owner
            </option>

            {owners.map((owner) => (
              <option
                key={owner.id}
                value={owner.id}
              >
                {owner.firstName} {owner.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Agent */}

        <div className="mb-3">
          <label className="form-label">
            Agent
          </label>

          <select
            className="form-control"
            name="agentId"
            value={formData.agentId}
            onChange={handleChange}
          >
            <option value="">
              Select Agent
            </option>

            {agents.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
              >
                {agent.firstName} {agent.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* State */}

        <div className="mb-3">
          <label className="form-label">
            State
          </label>

          <select
            className="form-control"
            name="stateId"
            value={formData.stateId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select State
            </option>

            {states.map((state) => (
              <option
                key={state.id}
                value={state.id}
              >
                {state.stateName}
              </option>
            ))}
          </select>
        </div>

        {/* City */}

        <div className="mb-3">
          <label className="form-label">
            City
          </label>

          <select
            className="form-control"
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select City
            </option>

            {cities.map((city) => (
              <option
                key={city.id}
                value={city.id}
              >
                {city.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}

        <div className="mb-3">
          <label className="form-label">
            Address
          </label>

          <textarea
            className="form-control"
            rows="3"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Latitude */}

        <div className="mb-3">
          <label className="form-label">
            Latitude
          </label>

          <input
            className="form-control"
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
        </div>

        {/* Longitude */}

        <div className="mb-3">
          <label className="form-label">
            Longitude
          </label>

          <input
            className="form-control"
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>

        {/* Price */}

        <div className="mb-3">
          <label className="form-label">
            Price
          </label>

          <input
            className="form-control"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Area */}

        <div className="mb-3">
          <label className="form-label">
            Area (Sq.ft)
          </label>

          <input
            className="form-control"
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bedrooms */}

        <div className="mb-3">
          <label className="form-label">
            Bedrooms
          </label>

          <input
            className="form-control"
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
          />
        </div>

        {/* Bathrooms */}

        <div className="mb-3">
          <label className="form-label">
            Bathrooms
          </label>

          <input
            className="form-control"
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
          />
        </div>

        {/* Facing */}

        <div className="mb-3">
          <label className="form-label">
            Facing
          </label>

          <input
            className="form-control"
            type="text"
            name="facing"
            value={formData.facing}
            onChange={handleChange}
          />
        </div>

                {/* Status */}

        <div className="mb-3">
          <label className="form-label">
            Status
          </label>

          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="AVAILABLE">
              AVAILABLE
            </option>

            <option value="PENDING_APPROVAL">
              PENDING APPROVAL
            </option>

            <option value="SOLD">
              SOLD
            </option>

            <option value="RENTED">
              RENTED
            </option>

            <option value="REJECTED">
              REJECTED
            </option>
          </select>
        </div>

        {/* Submit Buttons */}

        <div className="mt-4">

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Creating Property..."
              : "Create Property"}
          </button>

          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/admin/properties")}
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default CreateProperty;