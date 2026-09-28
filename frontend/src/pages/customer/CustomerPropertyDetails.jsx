
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getPropertyById,
  addFavourite,
  getCustomerFavourites,
  removeFavourite,
} from "../../api";

function CustomerPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Selected image
  const [selectedImage, setSelectedImage] = useState(null);

  // Favourite
  const [isFavourite, setIsFavourite] = useState(false);

  const [favouriteLoading, setFavouriteLoading] = useState(false);

  // =========================================================
  // BACKEND URL
  // =========================================================

  const BACKEND_URL = "http://localhost:9090";

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (err) {
      console.error("Invalid user data:", err);
      return null;
    }
  };

  // =========================================================
  // GET USER ID
  // =========================================================

  const getLoggedInUserId = () => {
    const user = getLoggedInUser();

    if (!user) {
      return null;
    }

    return (
      user.id ||
      user.userId ||
      user._id
    );
  };

  // =========================================================
  // LOAD PROPERTY
  // =========================================================

  useEffect(() => {
    if (id) {
      loadProperty();
    } else {
      setError("Property ID not found.");
      setLoading(false);
    }
  }, [id]);

  // =========================================================
  // LOAD PROPERTY FUNCTION
  // =========================================================

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading property details:", id);

      const result = await getPropertyById(id);

      console.log(
        "Customer property details response:",
        result
      );

      if (result?.success) {
        const propertyData = result.data;

        setProperty(propertyData);

        // =====================================================
        // SET FIRST IMAGE
        // =====================================================

        if (
          propertyData &&
          Array.isArray(propertyData.images) &&
          propertyData.images.length > 0
        ) {
          setSelectedImage(propertyData.images[0]);
        } else {
          setSelectedImage(null);
        }

        // =====================================================
        // CHECK FAVOURITE
        // =====================================================

        await checkFavouriteStatus(id);
      } else {
        setError(
          result?.message ||
            "Unable to load property details."
        );
      }
    } catch (err) {
      console.error(
        "Get property details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load property details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CHECK FAVOURITE STATUS
  // =========================================================

  const checkFavouriteStatus = async (propertyId) => {
    try {
      const userId = getLoggedInUserId();

      if (!userId) {
        console.log(
          "No logged-in user found."
        );
        return;
      }

      console.log(
        "Checking favourite status for user:",
        userId
      );

      const response =
        await getCustomerFavourites(userId);

      console.log(
        "Customer favourites response:",
        response
      );

      if (
        response?.success &&
        Array.isArray(response.data)
      ) {
        const exists =
          response.data.some((favourite) => {
            const favouritePropertyId =
              favourite.propertyId ||
              favourite.property?.id ||
              favourite.property?._id;

            return (
              String(favouritePropertyId) ===
              String(propertyId)
            );
          });

        setIsFavourite(exists);

        console.log(
          "Is favourite:",
          exists
        );
      } else {
        setIsFavourite(false);
      }
    } catch (err) {
      console.error(
        "Check favourite status error:",
        err
      );

      setIsFavourite(false);
    }
  };

  // =========================================================
  // ADD / REMOVE FAVOURITE
  // =========================================================

  const handleFavourite = async () => {
    try {
      const userId = getLoggedInUserId();

      if (!userId) {
        alert(
          "Please login as a customer to use favourites."
        );

        navigate("/login");

        return;
      }

      if (!property?.id) {
        alert("Property ID not found.");
        return;
      }

      setFavouriteLoading(true);

      // =====================================================
      // REMOVE FAVOURITE
      // =====================================================

      if (isFavourite) {
        console.log(
          "Removing favourite:",
          property.id
        );

        const response =
          await removeFavourite(
            userId,
            property.id
          );

        console.log(
          "Remove favourite response:",
          response
        );

        if (response?.success) {
          setIsFavourite(false);

          alert(
            "Property removed from favourites."
          );
        } else {
          alert(
            response?.message ||
              "Unable to remove favourite."
          );
        }

        return;
      }

      // =====================================================
      // ADD FAVOURITE
      // =====================================================

      console.log(
        "Adding favourite:",
        property.id
      );

      const favouriteData = {
        userId: userId,
        propertyId: property.id,
      };

      const response =
        await addFavourite(
          favouriteData
        );

      console.log(
        "Add favourite response:",
        response
      );

      if (response?.success) {
        setIsFavourite(true);

        alert(
          "Property added to favourites."
        );
      } else {
        alert(
          response?.message ||
            "Unable to add favourite."
        );
      }
    } catch (err) {
      console.error(
        "Favourite operation error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Favourite operation failed."
      );
    } finally {
      setFavouriteLoading(false);
    }
  };

  // =========================================================
  // GET IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // If image is an object
    if (typeof image === "object") {
      image =
        image.imageUrl ||
        image.url ||
        image.image ||
        image.path ||
        image.fileName ||
        null;
    }

    if (!image) {
      return null;
    }

    const imageValue =
      String(image).trim();

    if (imageValue === "") {
      return null;
    }

    // =======================================================
    // COMPLETE HTTP URL
    // =======================================================

    if (
      imageValue.startsWith("http://") ||
      imageValue.startsWith("https://")
    ) {
      return imageValue;
    }

    // =======================================================
    // DATA URL
    // =======================================================

    if (
      imageValue.startsWith("data:image")
    ) {
      return imageValue;
    }

    // =======================================================
    // ABSOLUTE BACKEND PATH
    // =======================================================

    if (imageValue.startsWith("/")) {
      return `${BACKEND_URL}${imageValue}`;
    }

    // =======================================================
    // BACKEND UPLOADS FOLDER
    // =======================================================

    return `${BACKEND_URL}/uploads/${imageValue}`;
  };

  // =========================================================
  // GET ALL PROPERTY IMAGES
  // =========================================================

  const getPropertyImages = () => {
    if (!property) {
      return [];
    }

    // =======================================================
    // images[]
    // =======================================================

    if (
      Array.isArray(property.images) &&
      property.images.length > 0
    ) {
      return property.images;
    }

    // =======================================================
    // SINGLE IMAGE FIELDS
    // =======================================================

    const singleImage =
      property.imageUrl ||
      property.image ||
      property.propertyImage ||
      property.thumbnail;

    if (singleImage) {
      return [singleImage];
    }

    return [];
  };

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "₹0";
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
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

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    try {
      return new Date(
        dateValue
      ).toLocaleString();
    } catch {
      return String(dateValue);
    }
  };

  // =========================================================
  // GET PROPERTY TYPE
  // =========================================================

  const getPropertyType = () => {
    if (!property) {
      return "Property";
    }

    // Direct property type
    if (
      typeof property.propertyType === "string" &&
      property.propertyType.trim() !== ""
    ) {
      return property.propertyType;
    }

    // propertyTypeName
    if (
      typeof property.propertyTypeName === "string" &&
      property.propertyTypeName.trim() !== ""
    ) {
      return property.propertyTypeName;
    }

    // type
    if (
      typeof property.type === "string" &&
      property.type.trim() !== ""
    ) {
      return property.type;
    }

    // Object
    if (
      property.propertyType &&
      typeof property.propertyType === "object"
    ) {
      return (
        property.propertyType.propertyTypeName ||
        property.propertyType.name ||
        property.propertyType.typeName ||
        "Property"
      );
    }

    // =======================================================
    // FALLBACK TO TITLE
    // =======================================================

    const title = String(
      property.title || ""
    ).toLowerCase();

    if (title.includes("apartment")) {
      return "Apartment";
    }

    if (title.includes("villa")) {
      return "Villa";
    }

    if (title.includes("house")) {
      return "House";
    }

    if (title.includes("plot")) {
      return "Plot";
    }

    if (title.includes("commercial")) {
      return "Commercial";
    }

    return "Property";
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    const normalizedStatus =
      String(status || "").toUpperCase();

    switch (normalizedStatus) {
      case "AVAILABLE":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
        };

      case "SOLD":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
        };

      case "BOOKED":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
        };

      case "INACTIVE":
        return {
          backgroundColor: "#e2e3e5",
          color: "#383d41",
        };

      default:
        return {
          backgroundColor: "#eeeeee",
          color: "#333333",
        };
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>
            🏠
          </div>

          <h2>
            Property Details
          </h2>

          <p>
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PROPERTY NOT FOUND
  // =========================================================

  if (!property) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <h2>
            Property Details
          </h2>

          <p>
            {error ||
              "Property not found."}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customer/properties"
            )
          }
          style={styles.backButton}
        >
          ← Back to Properties
        </button>
      </div>
    );
  }

  // =========================================================
  // PROPERTY DATA
  // =========================================================

  const propertyStatus =
    String(
      property.status || ""
    ).toUpperCase();

  /*
   * Some backend responses may not contain active.
   * If active is undefined, consider the property active
   * unless the status itself is INACTIVE.
   */

  const isActive =
    property.active === undefined ||
    property.active === null
      ? propertyStatus !== "INACTIVE"
      : property.active === true;

  const isAvailable =
    propertyStatus === "AVAILABLE" &&
    isActive;

  const images =
    getPropertyImages();

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
            Property Details
          </h1>

          <p style={styles.subtitle}>
            View complete information
            about this property.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customer/properties"
            )
          }
          style={styles.backButton}
        >
          ← Back to Properties
        </button>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* =====================================================
          MAIN CARD
          ===================================================== */}

      <div style={styles.card}>

        {/* ===================================================
            IMAGE SECTION
            =================================================== */}

        <div style={styles.imageSection}>

          {/* =================================================
              MAIN IMAGE
              ================================================= */}

          {images.length > 0 &&
          selectedImage ? (
            <div
              style={
                styles.mainImageContainer
              }
            >
              <img
                src={getImageUrl(
                  selectedImage
                )}
                alt={
                  property.title ||
                  "Property"
                }
                style={styles.mainImage}
                onError={(event) => {
                  console.error(
                    "Property image failed to load:",
                    getImageUrl(
                      selectedImage
                    )
                  );

                  event.currentTarget.style.display =
                    "none";

                  const parent =
                    event.currentTarget
                      .parentElement;

                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        flex-direction:column;
                        background:#e9ecef;
                        color:#666;
                        font-size:18px;
                      ">
                        <div style="font-size:70px;">
                          🏠
                        </div>
                        <div>
                          Property image unavailable
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div
              style={
                styles.mainImagePlaceholder
              }
            >
              <div
                style={
                  styles.placeholderIcon
                }
              >
                🏠
              </div>

              <p>
                No property image available
              </p>
            </div>
          )}

          {/* =================================================
              IMAGE THUMBNAILS
              ================================================= */}

          {images.length > 1 && (
            <div
              style={
                styles.thumbnailContainer
              }
            >
              {images.map(
                (image, index) => {
                  const imageUrl =
                    getImageUrl(
                      image
                    );

                  const isSelected =
                    selectedImage ===
                    image;

                  return (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image
                        )
                      }
                      style={{
                        ...styles.thumbnailButton,
                        ...(isSelected
                          ? styles.selectedThumbnail
                          : {}),
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Property ${
                            index + 1
                          }`}
                          style={
                            styles.thumbnailImage
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              "none";

                            const parent =
                              event
                                .currentTarget
                                .parentElement;

                            if (parent) {
                              parent.innerHTML =
                                "🏠";
                            }
                          }}
                        />
                      ) : (
                        "🏠"
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            PROPERTY HEADER
            =================================================== */}

        <div style={styles.propertyHeader}>
          <div>
            <h2
              style={
                styles.propertyTitle
              }
            >
              {property.title ||
                "Property"}
            </h2>

            <p
              style={
                styles.propertyId
              }
            >
              Property ID:{" "}
              {property.id || "-"}
            </p>
          </div>

          <span
            style={{
              ...styles.status,
              ...getStatusStyle(
                property.status
              ),
            }}
          >
            {property.status || "-"}
          </span>
        </div>

        {/* ===================================================
            DESCRIPTION
            =================================================== */}

        <div style={styles.section}>
          <h3
            style={
              styles.sectionTitle
            }
          >
            Description
          </h3>

          <p
            style={
              styles.description
            }
          >
            {property.description ||
              "No description available."}
          </p>
        </div>

        {/* ===================================================
            PROPERTY INFORMATION
            =================================================== */}

        <div style={styles.section}>
          <h3
            style={
              styles.sectionTitle
            }
          >
            Property Information
          </h3>

          <div
            style={
              styles.detailsGrid
            }
          >
            {/* PRICE */}

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
                Price
              </span>

              <span
                style={styles.price}
              >
                {formatAmount(
                  property.price
                )}
              </span>
            </div>

            {/* AREA */}

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
                Area
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {property.area !==
                  undefined &&
                property.area !==
                  null
                  ? `${property.area} sq.ft`
                  : "-"}
              </span>
            </div>

            {/* PROPERTY TYPE */}

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
                Property Type
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {getPropertyType()}
              </span>
            </div>

            {/* BEDROOMS */}

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
                Bedrooms
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {property.bedrooms !==
                  undefined &&
                property.bedrooms !==
                  null
                  ? `🛏️ ${property.bedrooms}`
                  : "-"}
              </span>
            </div>

            {/* BATHROOMS */}

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
                Bathrooms
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {property.bathrooms !==
                  undefined &&
                property.bathrooms !==
                  null
                  ? `🛁 ${property.bathrooms}`
                  : "-"}
              </span>
            </div>

            {/* FACING */}

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
                Facing
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {property.facing ||
                  "-"}
              </span>
            </div>

            {/* STATUS */}

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
                Status
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {property.status ||
                  "-"}
              </span>
            </div>

            {/* ACTIVE */}

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
                Active
              </span>

              <span
                style={
                  styles.detailValue
                }
              >
                {isActive
                  ? "Yes"
                  : "No"}
              </span>
            </div>

            {/* CREATED */}

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
                  property.createdAt
                )}
              </span>
            </div>

            {/* UPDATED */}

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
                  property.updatedAt
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            AMENITIES
            =================================================== */}

        {Array.isArray(
          property.amenities
        ) &&
        property.amenities.length >
          0 && (
          <div
            style={
              styles.section
            }
          >
            <h3
              style={
                styles.sectionTitle
              }
            >
              Amenities
            </h3>

            <div
              style={
                styles.amenitiesContainer
              }
            >
              {property.amenities.map(
                (
                  amenity,
                  index
                ) => (
                  <span
                    key={`${amenity}-${index}`}
                    style={
                      styles.amenity
                    }
                  >
                    ✓ {amenity}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* ===================================================
            LOCATION
            =================================================== */}

        <div style={styles.section}>
          <h3
            style={
              styles.sectionTitle
            }
          >
            Location
          </h3>

          <div
            style={
              styles.locationBox
            }
          >
            <p>
              <strong>
                Address:
              </strong>{" "}
              {property.address ||
                "-"}
            </p>

            {property.cityName && (
              <p>
                <strong>
                  City:
                </strong>{" "}
                {property.cityName}
              </p>
            )}

            {property.stateName && (
              <p>
                <strong>
                  State:
                </strong>{" "}
                {property.stateName}
              </p>
            )}

            {property.latitude !==
              undefined &&
              property.latitude !==
                null && (
                <p>
                  <strong>
                    Latitude:
                  </strong>{" "}
                  {property.latitude}
                </p>
              )}

            {property.longitude !==
              undefined &&
              property.longitude !==
                null && (
                <p>
                  <strong>
                    Longitude:
                  </strong>{" "}
                  {property.longitude}
                </p>
              )}
          </div>
        </div>

        {/* ===================================================
            OWNER INFORMATION
            =================================================== */}

        {(property.ownerId ||
          property.ownerName) && (
          <div
            style={
              styles.section
            }
          >
            <h3
              style={
                styles.sectionTitle
              }
            >
              Owner Information
            </h3>

            {property.ownerId && (
              <p>
                <strong>
                  Owner ID:
                </strong>{" "}
                {property.ownerId}
              </p>
            )}

            {property.ownerName && (
              <p>
                <strong>
                  Owner Name:
                </strong>{" "}
                {property.ownerName}
              </p>
            )}
          </div>
        )}

        {/* ===================================================
            ACTIONS
            =================================================== */}

        <div
          style={
            styles.actionContainer
          }
        >
          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/customer/properties"
              )
            }
            style={
              styles.secondaryButton
            }
          >
            ← Back
          </button>

          {/* FAVOURITE */}

          <button
            type="button"
            onClick={
              handleFavourite
            }
            disabled={
              favouriteLoading
            }
            style={{
              ...styles.favouriteButton,
              ...(isFavourite
                ? styles.favouriteActive
                : {}),
              ...(favouriteLoading
                ? styles.disabledButton
                : {}),
            }}
          >
            {favouriteLoading
              ? "Processing..."
              : isFavourite
              ? "❤️ Remove Favourite"
              : "♡ Add to Favourite"}
          </button>

          {/* BOOK */}

          {isAvailable && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/customer/properties/${property.id}/book`
                )
              }
              style={
                styles.bookButton
              }
            >
              📅 Book Property
            </button>
          )}
        </div>
      </div>
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
    flexWrap: "wrap",
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

  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },

  // =======================================================
  // IMAGE
  // =======================================================

  imageSection: {
    marginBottom: "30px",
  },

  mainImageContainer: {
    width: "100%",
    height: "450px",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#e9ecef",
  },

  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  mainImagePlaceholder: {
    width: "100%",
    height: "450px",
    borderRadius: "12px",
    backgroundColor: "#e9ecef",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
  },

  placeholderIcon: {
    fontSize: "90px",
    marginBottom: "15px",
  },

  thumbnailContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "15px",
    flexWrap: "wrap",
  },

  thumbnailButton: {
    width: "100px",
    height: "75px",
    padding: 0,
    border: "2px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },

  selectedThumbnail: {
    border: "3px solid #2563eb",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  // =======================================================
  // PROPERTY HEADER
  // =======================================================

  propertyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    paddingBottom: "20px",
    borderBottom:
      "1px solid #eee",
  },

  propertyTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#222",
  },

  propertyId: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#777",
    wordBreak: "break-word",
  },

  status: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },

  // =======================================================
  // SECTIONS
  // =======================================================

  section: {
    marginTop: "28px",
    paddingBottom: "25px",
    borderBottom:
      "1px solid #eee",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "20px",
    color: "#333",
  },

  description: {
    color: "#555",
    lineHeight: "1.7",
    fontSize: "15px",
  },

  // =======================================================
  // DETAILS
  // =======================================================

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "22px 30px",
  },

  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  detailLabel: {
    fontSize: "13px",
    color: "#777",
    fontWeight: "600",
  },

  detailValue: {
    fontSize: "15px",
    color: "#333",
  },

  price: {
    fontSize: "21px",
    fontWeight: "700",
    color: "#198754",
  },

  // =======================================================
  // AMENITIES
  // =======================================================

  amenitiesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  amenity: {
    backgroundColor: "#eef4ff",
    color: "#2563eb",
    border:
      "1px solid #c7d7fe",
    padding: "8px 13px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  // =======================================================
  // LOCATION
  // =======================================================

  locationBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "15px 20px",
    color: "#444",
    lineHeight: "1.6",
  },

  // =======================================================
  // ACTIONS
  // =======================================================

  actionContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  backButton: {
    padding: "10px 18px",
    border:
      "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
  },

  secondaryButton: {
    padding: "11px 22px",
    border:
      "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
  },

  favouriteButton: {
    padding: "11px 22px",
    border:
      "1px solid #dc3545",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#dc3545",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  favouriteActive: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  bookButton: {
    padding: "11px 25px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  // =======================================================
  // LOADING
  // =======================================================

  loadingBox: {
    backgroundColor: "#fff",
    border:
      "1px solid #ddd",
    borderRadius: "10px",
    padding: "50px",
    textAlign: "center",
    maxWidth: "600px",
    margin: "50px auto",
  },

  loadingIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  // =======================================================
  // ERROR
  // =======================================================

  errorBox: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border:
      "1px solid #f5c6cb",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "20px",
  },
};

export default CustomerPropertyDetails;