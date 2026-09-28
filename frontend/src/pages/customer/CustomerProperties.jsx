import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProperties,
  getPropertyImages,
} from "../../api";

function CustomerProperties() {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // =========================================================
  // BACKEND URL
  // =========================================================

  const BACKEND_URL = "http://localhost:9090";

  // =========================================================
  // PROPERTY TYPE IDS
  // =========================================================

  const PROPERTY_TYPE_IDS = {
    APARTMENT: "6a65185ecd3542bc460cb2d0",
    VILLA: "6a6518fc5ab22eeec670701b",
    HOUSE: "",
    PLOT: "",
    COMMERCIAL: "",
  };

  // =========================================================
  // LOAD PROPERTIES
  // =========================================================

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {

    try {

      setLoading(true);
      setError("");

      console.log("======================================");
      console.log("CUSTOMER PROPERTIES: Loading...");
      console.log("======================================");

      // =====================================================
      // STEP 1
      // LOAD PROPERTIES
      // =====================================================

      const result = await getProperties();

      console.log(
        "CUSTOMER PROPERTIES API RESPONSE:",
        result
      );

      if (!result) {

        setError(
          "No response received from property server."
        );

        setProperties([]);
        setFilteredProperties([]);

        return;
      }

      if (!result.success) {

        setError(
          result.message ||
          "Unable to load properties."
        );

        setProperties([]);
        setFilteredProperties([]);

        return;
      }

      const propertyData =
        Array.isArray(result.data)
          ? result.data
          : [];

      console.log(
        "TOTAL PROPERTIES:",
        propertyData.length
      );

      // =====================================================
      // IMPORTANT
      //
      // DISPLAY PROPERTIES IMMEDIATELY.
      //
      // DO NOT WAIT FOR IMAGES.
      // =====================================================

      const initialProperties =
        propertyData.map((property) => ({
          ...property,
          images: [],
        }));

      setProperties(initialProperties);
      setFilteredProperties(initialProperties);

      setLoading(false);

      // =====================================================
      // STEP 2
      // LOAD IMAGES IN BACKGROUND
      // =====================================================

      loadImagesForProperties(
        initialProperties
      );

    } catch (err) {

      console.error(
        "CUSTOMER PROPERTIES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load properties."
      );

      setProperties([]);
      setFilteredProperties([]);

      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PROPERTY IMAGES
  // =========================================================

  const loadImagesForProperties = async (
    propertyList
  ) => {

    console.log(
      "Loading property images in background..."
    );

    const updatedProperties =
      await Promise.all(

        propertyList.map(
          async (property) => {

            if (!property?.id) {

              return {
                ...property,
                images: [],
              };

            }

            try {

              // =================================================
              // IMAGE REQUEST
              // =================================================

              const imageResult =
                await getPropertyImages(
                  property.id
                );

              console.log(
                `Images for property ${property.id}:`,
                imageResult
              );

              const backendImages =
                Array.isArray(
                  imageResult?.data
                )
                  ? imageResult.data
                  : [];

              // =================================================
              // ACTIVE IMAGES ONLY
              // =================================================

              const activeImages =
                backendImages
                  .filter(
                    (image) =>
                      image &&
                      image.active !== false &&
                      image.imageUrl
                  )
                  .sort(
                    (a, b) =>
                      Number(
                        a?.displayOrder ?? 0
                      ) -
                      Number(
                        b?.displayOrder ?? 0
                      )
                  );

              return {
                ...property,
                images: activeImages,
              };

            } catch (imageError) {

              console.warn(
                `Unable to load images for property ${property.id}:`,
                imageError
              );

              // =================================================
              // IMPORTANT
              //
              // If image API fails, property still remains visible.
              // =================================================

              return {
                ...property,
                images: [],
              };

            }

          }
        )

      );

    // =========================================================
    // UPDATE PROPERTY IMAGES
    // =========================================================

    setProperties(
      updatedProperties
    );

    console.log(
      "Properties updated with images:",
      updatedProperties
    );
  };

  // =========================================================
  // GET TITLE
  // =========================================================

  const getPropertyTitle = (property) => {

    return String(
      property?.title ||
      property?.propertyTitle ||
      "Property"
    );

  };

  // =========================================================
  // GET DESCRIPTION
  // =========================================================

  const getPropertyDescription = (property) => {

    return String(
      property?.description ||
      ""
    );

  };

  // =========================================================
  // GET ADDRESS
  // =========================================================

  const getPropertyAddress = (property) => {

    if (!property) {
      return "";
    }

    if (
      typeof property.address === "string" &&
      property.address.trim() !== ""
    ) {

      return property.address;

    }

    if (
      typeof property.location === "string" &&
      property.location.trim() !== ""
    ) {

      return property.location;

    }

    return "";

  };

  // =========================================================
  // GET CITY
  // =========================================================

  const getPropertyCity = (property) => {

    if (!property) {
      return "";
    }

    if (
      typeof property.cityName === "string" &&
      property.cityName.trim() !== ""
    ) {

      return property.cityName;

    }

    if (
      typeof property.city === "string" &&
      property.city.trim() !== ""
    ) {

      return property.city;

    }

    if (
      property.city &&
      typeof property.city === "object"
    ) {

      return String(
        property.city.cityName ||
        property.city.name ||
        ""
      );

    }

    return "";

  };

  // =========================================================
  // NORMALIZE PROPERTY TYPE
  // =========================================================

  const normalizePropertyType = (type) => {

    if (!type) {
      return "";
    }

    const value =
      String(type)
        .trim()
        .toLowerCase();

    if (
      value === "apartment" ||
      value === "apartments"
    ) {

      return "APARTMENT";

    }

    if (
      value === "villa" ||
      value === "villas"
    ) {

      return "VILLA";

    }

    if (
      value === "house" ||
      value === "houses"
    ) {

      return "HOUSE";

    }

    if (
      value === "plot" ||
      value === "plots"
    ) {

      return "PLOT";

    }

    if (
      value === "commercial" ||
      value === "commercial property" ||
      value === "commercial properties"
    ) {

      return "COMMERCIAL";

    }

    return value.toUpperCase();

  };

  // =========================================================
  // GET PROPERTY TYPE
  // =========================================================

  const getPropertyType = (property) => {

    if (!property) {
      return "";
    }

    // -------------------------------------------------------
    // 1. propertyTypeName
    // -------------------------------------------------------

    if (
      typeof property.propertyTypeName === "string" &&
      property.propertyTypeName.trim() !== ""
    ) {

      return normalizePropertyType(
        property.propertyTypeName
      );

    }

    // -------------------------------------------------------
    // 2. propertyType string
    // -------------------------------------------------------

    if (
      typeof property.propertyType === "string" &&
      property.propertyType.trim() !== ""
    ) {

      return normalizePropertyType(
        property.propertyType
      );

    }

    // -------------------------------------------------------
    // 3. type
    // -------------------------------------------------------

    if (
      typeof property.type === "string" &&
      property.type.trim() !== ""
    ) {

      return normalizePropertyType(
        property.type
      );

    }

    // -------------------------------------------------------
    // 4. propertyType object
    // -------------------------------------------------------

    if (
      property.propertyType &&
      typeof property.propertyType === "object"
    ) {

      const typeObject =
        property.propertyType;

      const typeName =
        typeObject.propertyTypeName ||
        typeObject.name ||
        typeObject.typeName ||
        typeObject.title ||
        typeObject.label ||
        "";

      if (typeName) {

        return normalizePropertyType(
          typeName
        );

      }

    }

    // -------------------------------------------------------
    // 5. PROPERTY TYPE ID
    // -------------------------------------------------------

    const backendTypeId =
      String(
        property?.propertyTypeId ||
        ""
      )
        .trim()
        .toLowerCase();

    if (
      backendTypeId !== ""
    ) {

      if (
        backendTypeId ===
        String(
          PROPERTY_TYPE_IDS.APARTMENT
        ).toLowerCase()
      ) {

        return "APARTMENT";

      }

      if (
        backendTypeId ===
        String(
          PROPERTY_TYPE_IDS.VILLA
        ).toLowerCase()
      ) {

        return "VILLA";

      }

    }

    // -------------------------------------------------------
    // 6. TITLE FALLBACK
    // -------------------------------------------------------

    const title =
      getPropertyTitle(property)
        .toLowerCase();

    if (title.includes("apartment")) {
      return "APARTMENT";
    }

    if (title.includes("villa")) {
      return "VILLA";
    }

    if (title.includes("house")) {
      return "HOUSE";
    }

    if (title.includes("plot")) {
      return "PLOT";
    }

    if (title.includes("commercial")) {
      return "COMMERCIAL";
    }

    return "";

  };

  // =========================================================
  // DISPLAY PROPERTY TYPE
  // =========================================================

  const getDisplayPropertyType = (property) => {

    const type =
      getPropertyType(property);

    switch (type) {

      case "APARTMENT":
        return "Apartment";

      case "VILLA":
        return "Villa";

      case "HOUSE":
        return "House";

      case "PLOT":
        return "Plot";

      case "COMMERCIAL":
        return "Commercial";

      default:
        return "Property";

    }

  };

  // =========================================================
  // GET PROPERTY IMAGE
  // =========================================================

  const getPropertyImage = (property) => {

    if (!property) {
      return null;
    }

    if (
      !Array.isArray(property.images) ||
      property.images.length === 0
    ) {

      return null;

    }

    const activeImages =
      property.images.filter(
        (image) =>
          image &&
          typeof image === "object" &&
          image.active !== false &&
          image.imageUrl
      );

    if (activeImages.length === 0) {
      return null;
    }

    const sortedImages =
      [...activeImages].sort(
        (a, b) =>
          Number(
            a?.displayOrder ?? 0
          ) -
          Number(
            b?.displayOrder ?? 0
          )
      );

    let imageUrl =
      sortedImages[0]?.imageUrl;

    if (!imageUrl) {
      return null;
    }

    imageUrl =
      String(imageUrl).trim();

    if (!imageUrl) {
      return null;
    }

    // Full URL
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {

      return imageUrl;

    }

    // /uploads/xxx.jpg
    if (
      imageUrl.startsWith("/")
    ) {

      return `${BACKEND_URL}${imageUrl}`;

    }

    // uploads/xxx.jpg
    return `${BACKEND_URL}/${imageUrl}`;

  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {

    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {

      return "Price not available";

    }

    const numericPrice =
      Number(price);

    if (
      Number.isNaN(numericPrice)
    ) {

      return String(price);

    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      numericPrice
    );

  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  useEffect(() => {

    let result =
      [...properties];

    const searchText =
      search
        .trim()
        .toLowerCase();

    // =======================================================
    // SEARCH
    // =======================================================

    if (searchText !== "") {

      result =
        result.filter(
          (property) => {

            const title =
              getPropertyTitle(property)
                .toLowerCase();

            const description =
              getPropertyDescription(property)
                .toLowerCase();

            const address =
              getPropertyAddress(property)
                .toLowerCase();

            const city =
              getPropertyCity(property)
                .toLowerCase();

            const type =
              getPropertyType(property)
                .toLowerCase();

            const displayType =
              getDisplayPropertyType(property)
                .toLowerCase();

            const price =
              String(
                property?.price ?? ""
              ).toLowerCase();

            return (
              title.includes(searchText) ||
              description.includes(searchText) ||
              address.includes(searchText) ||
              city.includes(searchText) ||
              type.includes(searchText) ||
              displayType.includes(searchText) ||
              price.includes(searchText)
            );

          }
        );

    }

    // =======================================================
    // TYPE FILTER
    // =======================================================

    if (
      propertyType !== ""
    ) {

      result =
        result.filter(
          (property) =>
            getPropertyType(property) ===
            propertyType
        );

    }

    setFilteredProperties(result);

  }, [
    search,
    propertyType,
    properties,
  ]);

  // =========================================================
  // VIEW PROPERTY
  // =========================================================

  const handleViewProperty = (propertyId) => {

    if (!propertyId) {

      console.error(
        "Property ID missing."
      );

      return;

    }

    console.log(
      "Opening property:",
      propertyId
    );

    navigate(
      `/customer/properties/${propertyId}`
    );

  };

  // =========================================================
  // BOOK PROPERTY
  // =========================================================

  const handleBookProperty = (propertyId) => {

    if (!propertyId) {
      return;
    }

    navigate(
      `/customer/properties/${propertyId}/book`
    );

  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {

    setSearch("");
    setPropertyType("");

  };

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  const handleImageError = (
    event,
    image
  ) => {

    console.error(
      "PROPERTY IMAGE LOAD FAILED:",
      image
    );

    console.error(
      "BROWSER ATTEMPTED URL:",
      event.currentTarget.src
    );

    event.currentTarget.style.display =
      "none";

    const fallback =
      event.currentTarget.nextElementSibling;

    if (fallback) {

      fallback.style.display =
        "flex";

    }

  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div style={styles.page}>

        <h1 style={styles.title}>
          Properties
        </h1>

        <div style={styles.loadingBox}>

          <div style={styles.spinner}>
            ⏳
          </div>

          <p style={styles.centerText}>
            Loading properties...
          </p>

        </div>

      </div>

    );

  }

  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div style={styles.page}>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Browse Properties
          </h1>

          <p style={styles.subtitle}>
            Find your ideal property from
            RealEstate Pro.
          </p>

        </div>

        <button
          type="button"
          onClick={loadProperties}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>

      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>

      )}

      {/* =====================================================
          SEARCH + FILTER
          ===================================================== */}

      <div style={styles.filterBox}>

        <div style={styles.searchContainer}>

          <label style={styles.label}>
            Search Properties
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by title, city, address..."
            style={styles.searchInput}
          />

        </div>

        <div style={styles.filterContainer}>

          <label style={styles.label}>
            Property Type
          </label>

          <select
            value={propertyType}
            onChange={(event) =>
              setPropertyType(
                event.target.value
              )
            }
            style={styles.select}
          >

            <option value="">
              All Types
            </option>

            <option value="APARTMENT">
              Apartment
            </option>

            <option value="VILLA">
              Villa
            </option>

            <option value="HOUSE">
              House
            </option>

            <option value="PLOT">
              Plot
            </option>

            <option value="COMMERCIAL">
              Commercial
            </option>

          </select>

        </div>

        <button
          type="button"
          onClick={clearFilters}
          style={styles.clearButton}
        >
          Clear Filters
        </button>

      </div>

      {/* =====================================================
          ACTIVE FILTER
          ===================================================== */}

      {(search !== "" ||
        propertyType !== "") && (

        <div style={styles.activeFilterBox}>

          <strong>
            Active Filter:
          </strong>

          {search !== "" && (

            <span>
              Search = "{search}"
            </span>

          )}

          {propertyType !== "" && (

            <span>
              Type ={" "}
              {propertyType === "APARTMENT"
                ? "Apartment"
                : propertyType === "VILLA"
                ? "Villa"
                : propertyType === "HOUSE"
                ? "House"
                : propertyType === "PLOT"
                ? "Plot"
                : "Commercial"}
            </span>

          )}

          <button
            type="button"
            onClick={clearFilters}
            style={styles.smallClearButton}
          >
            Reset
          </button>

        </div>

      )}

      {/* =====================================================
          RESULTS HEADER
          ===================================================== */}

      <div style={styles.resultsHeader}>

        <h2 style={styles.resultsTitle}>
          Available Properties
        </h2>

        <span style={styles.resultsCount}>
          {filteredProperties.length} properties found
        </span>

      </div>

      {/* =====================================================
          NO RESULTS
          ===================================================== */}

      {filteredProperties.length === 0 ? (

        <div style={styles.emptyBox}>

          <div style={styles.emptyIcon}>
            🔍
          </div>

          <h3>
            No Properties Found
          </h3>

          <p>
            No properties match your
            current search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            style={styles.clearButton}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        <div style={styles.propertyGrid}>

          {filteredProperties.map(
            (property) => {

              const propertyId =
                property?.id;

              const image =
                getPropertyImage(property);

              const title =
                getPropertyTitle(property);

              const displayType =
                getDisplayPropertyType(property);

              return (

                <div
                  key={propertyId}
                  style={styles.card}
                >

                  {/* =================================================
                      IMAGE
                      ================================================= */}

                  {image ? (

                    <img
                      src={image}
                      alt={title}
                      style={
                        styles.propertyImage
                      }
                      onError={(event) =>
                        handleImageError(
                          event,
                          image
                        )
                      }
                    />

                  ) : null}

                  {/* =================================================
                      FALLBACK IMAGE
                      ================================================= */}

                  <div
                    style={{
                      ...styles.imagePlaceholder,
                      display:
                        image
                          ? "none"
                          : "flex",
                    }}
                  >
                    🏠
                  </div>

                  {/* =================================================
                      CONTENT
                      ================================================= */}

                  <div style={styles.cardContent}>

                    <div style={styles.cardTop}>

                      <h3
                        style={
                          styles.propertyTitle
                        }
                      >
                        {title}
                      </h3>

                      <span
                        style={
                          styles.typeBadge
                        }
                      >
                        {displayType}
                      </span>

                    </div>

                    {/* PRICE */}

                    <p style={styles.price}>
                      {formatPrice(
                        property.price
                      )}
                    </p>

                    {/* ADDRESS */}

                    <p style={styles.address}>

                      📍{" "}

                      {getPropertyAddress(
                        property
                      ) ||
                        getPropertyCity(
                          property
                        ) ||
                        "Address not available"}

                    </p>

                    {/* DESCRIPTION */}

                    {property.description && (

                      <p
                        style={
                          styles.description
                        }
                      >
                        {property.description}
                      </p>

                    )}

                    {/* FEATURES */}

                    <div style={styles.features}>

                      {property.bedrooms !==
                        undefined &&
                        property.bedrooms !==
                          null && (

                        <span>
                          🛏️{" "}
                          {property.bedrooms}
                          {" "}Bedrooms
                        </span>

                      )}

                      {property.bathrooms !==
                        undefined &&
                        property.bathrooms !==
                          null && (

                        <span>
                          🛁{" "}
                          {property.bathrooms}
                          {" "}Bathrooms
                        </span>

                      )}

                      {property.area !==
                        undefined &&
                        property.area !==
                          null && (

                        <span>
                          📐{" "}
                          {property.area}
                          {" "}sq.ft
                        </span>

                      )}

                    </div>

                    {/* ACTIONS */}

                    <div
                      style={
                        styles.actionContainer
                      }
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleViewProperty(
                            propertyId
                          )
                        }
                        style={
                          styles.viewButton
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleBookProperty(
                            propertyId
                          )
                        }
                        style={
                          styles.bookButton
                        }
                      >
                        Book Property
                      </button>

                    </div>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

}

// =========================================================
// STYLES
// =========================================================

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
  },

  loadingBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "60px 20px",
    textAlign: "center",
    marginTop: "30px",
  },

  spinner: {
    fontSize: "40px",
  },

  filterBox: {
    display: "flex",
    alignItems: "flex-end",
    gap: "15px",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "15px",
  },

  searchContainer: {
    flex: 1,
    minWidth: "280px",
  },

  filterContainer: {
    minWidth: "220px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#222",
  },

  select: {
    width: "100%",
    padding: "11px 13px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#fff",
    color: "#222",
    cursor: "pointer",
  },

  clearButton: {
    padding: "11px 18px",
    border: "1px solid #6c757d",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#495057",
    cursor: "pointer",
    fontSize: "14px",
  },

  activeFilterBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    backgroundColor: "#eef4ff",
    border: "1px solid #c7d7fe",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "20px",
    color: "#333",
    fontSize: "14px",
  },

  smallClearButton: {
    padding: "5px 12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },

  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  resultsTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#222",
  },

  resultsCount: {
    color: "#666",
    fontSize: "14px",
  },

  propertyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  propertyImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
    backgroundColor: "#e9ecef",
  },

  imagePlaceholder: {
    width: "100%",
    height: "220px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
    fontSize: "55px",
  },

  cardContent: {
    padding: "20px",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  propertyTitle: {
    margin: 0,
    fontSize: "19px",
    color: "#222",
    lineHeight: "1.4",
    flex: 1,
  },

  typeBadge: {
    backgroundColor: "#e7f1ff",
    color: "#2563eb",
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  price: {
    marginTop: "12px",
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#198754",
  },

  address: {
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "10px",
  },

  description: {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "10px",
  },

  features: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #eee",
    fontSize: "13px",
    color: "#555",
  },

  actionContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  viewButton: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #6c757d",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#495057",
    cursor: "pointer",
    fontSize: "14px",
  },

  bookButton: {
    flex: 1,
    padding: "10px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
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
    padding: "50px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  centerText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
  },

};

export default CustomerProperties;