import axios from "axios";

// =====================================================
// AXIOS INSTANCE
// ====================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://realestate-pro-backend.onrender.com/api",
  timeout: 15000,
});



// =====================================================
// JWT REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    // -------------------------------------------------
    // ADD JWT TOKEN
    // -------------------------------------------------

    if (
      token &&
      config.url &&
      !config.url.includes("/auth/login")
    ) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }


    // -------------------------------------------------
    // CONTENT TYPE
    // -------------------------------------------------

    /*
     * IMPORTANT:
     *
     * For FormData:
     * Do NOT manually set Content-Type.
     *
     * Axios/browser automatically creates:
     *
     * multipart/form-data;
     * boundary=-------------------------
     *
     * This is required for file uploads.
     */

    if (
      config.data instanceof FormData
    ) {

      if (config.headers) {

        delete config.headers["Content-Type"];

        delete config.headers["content-type"];
      }

    } else {

      config.headers =
        config.headers || {};

      config.headers["Content-Type"] =
        "application/json";
    }


    return config;
  },

  (error) => {

    return Promise.reject(error);

  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    console.error(
      "API ERROR:",
      {
        url:
          error?.config?.url,

        method:
          error?.config?.method,

        status:
          error?.response?.status,

        message:
          error?.response?.data?.message ||
          error?.message,
      }
    );


    /*
     * Do NOT automatically logout.
     */

    return Promise.reject(error);

  }

);


// =====================================================
// AUTH APIs
// =====================================================

export const loginUser =
  async (loginData) => {

    const response =
      await api.post(
        "/auth/login",
        loginData
      );

    return response.data;
  };


  // =====================================================
// REGISTER USER
// =====================================================

export const registerUser =
  async (userData) => {

    const response =
      await api.post(
        "/users/register",
        userData
      );

    return response.data;
  };


// =====================================================
// USER APIs
// =====================================================

export const getUsers =
  async () => {

    const response =
      await api.get("/users");

    return response.data;
  };


export const getUserById =
  async (id) => {

    const response =
      await api.get(
        `/users/${id}`
      );

    return response.data;
  };


export const updateUser =
  async (
    id,
    userData
  ) => {

    const response =
      await api.put(
        `/users/${id}`,
        userData
      );

    return response.data;
  };


export const deleteUser =
  async (id) => {

    const response =
      await api.delete(
        `/users/${id}`
      );

    return response.data;
  };


// =====================================================
// LOGGED-IN USER PROFILE APIs
// =====================================================

export const getCustomerProfile =
  async () => {

    const response =
      await api.get(
        "/users/me"
      );

    return response.data;
  };


export const updateCustomerProfile =
  async (profileData) => {

    const response =
      await api.put(
        "/users/me",
        profileData
      );

    return response.data;
  };


// =====================================================
// DASHBOARD APIs
// =====================================================

export const getAdminDashboard =
  async () => {

    const response =
      await api.get(
        "/dashboard/admin"
      );

    return response.data;
  };


export const getCustomerDashboard =
  async (customerId) => {

    const response =
      await api.get(
        `/dashboard/customer/${customerId}`
      );

    return response.data;
  };


export const getOwnerDashboard =
  async (ownerId) => {

    const response =
      await api.get(
        `/dashboard/owner/${ownerId}`
      );

    return response.data;
  };


// =====================================================
// PROPERTY APIs
// =====================================================

export const getProperties =
  async () => {

    const response =
      await api.get(
        "/properties"
      );

    return response.data;
  };


export const getPropertyById =
  async (id) => {

    const response =
      await api.get(
        `/properties/${id}`
      );

    return response.data;
  };


export const createProperty =
  async (propertyData) => {

    const response =
      await api.post(
        "/properties",
        propertyData
      );

    return response.data;
  };


export const updateProperty =
  async (
    id,
    propertyData
  ) => {

    const response =
      await api.put(
        `/properties/${id}`,
        propertyData
      );

    return response.data;
  };


export const deleteProperty =
  async (id) => {

    const response =
      await api.delete(
        `/properties/${id}`
      );

    return response.data;
  };


// =====================================================
// PROPERTY TYPE APIs
// =====================================================

export const getPropertyTypes =
  async () => {

    const response =
      await api.get(
        "/property-types"
      );

    return response.data;
  };


export const getPropertyTypeById =
  async (id) => {

    const response =
      await api.get(
        `/property-types/${id}`
      );

    return response.data;
  };


// =====================================================
// STATE APIs
// =====================================================

export const getStates =
  async () => {

    const response =
      await api.get(
        "/states"
      );

    return response.data;
  };


export const getStateById =
  async (id) => {

    const response =
      await api.get(
        `/states/${id}`
      );

    return response.data;
  };


export const getAllStates =
  async () => {

    const response =
      await api.get(
        "/states"
      );

    return response.data;
  };


export const createState =
  async (data) => {

    const response =
      await api.post(
        "/states",
        data
      );

    return response.data;
  };


export const updateState =
  async (
    id,
    data
  ) => {

    const response =
      await api.put(
        `/states/${id}`,
        data
      );

    return response.data;
  };


export const deleteState =
  async (id) => {

    const response =
      await api.delete(
        `/states/${id}`
      );

    return response.data;
  };


// =====================================================
// CITY APIs
// =====================================================

export const getCities =
  async () => {

    const response =
      await api.get(
        "/cities"
      );

    return response.data;
  };


export const getCityById =
  async (id) => {

    const response =
      await api.get(
        `/cities/${id}`
      );

    return response.data;
  };


export const getCitiesByState =
  async (stateId) => {

    const response =
      await api.get(
        `/cities/state/${stateId}`
      );

    return response.data;
  };


export const getAllCities =
  async () => {

    const response =
      await api.get(
        "/cities"
      );

    return response.data;
  };


export const createCity =
  async (data) => {

    const response =
      await api.post(
        "/cities",
        data
      );

    return response.data;
  };


export const updateCity =
  async (
    id,
    data
  ) => {

    const response =
      await api.put(
        `/cities/${id}`,
        data
      );

    return response.data;
  };


export const deleteCity =
  async (id) => {

    const response =
      await api.delete(
        `/cities/${id}`
      );

    return response.data;
  };


// =====================================================
// BOOKING APIs
// =====================================================

export const createBooking =
  async (bookingData) => {

    const response =
      await api.post(
        "/property-bookings",
        bookingData
      );

    return response.data;
  };


export const getBookingById =
  async (bookingId) => {

    const response =
      await api.get(
        `/property-bookings/${bookingId}`
      );

    return response.data;
  };


export const getCustomerBookings =
  async (customerId) => {

    const response =
      await api.get(
        `/property-bookings/customer/${customerId}`
      );

    return response.data;
  };


export const getOwnerBookings =
  async (ownerId) => {

    const response =
      await api.get(
        `/property-bookings/owner/${ownerId}`
      );

    return response.data;
  };


export const getPropertyBookings =
  async (propertyId) => {

    const response =
      await api.get(
        `/property-bookings/property/${propertyId}`
      );

    return response.data;
  };


export const getAllBookings =
  async () => {

    const response =
      await api.get(
        "/property-bookings/all"
      );

    return response.data;
  };


export const acceptBooking =
  async (bookingId) => {

    const response =
      await api.put(
        `/property-bookings/${bookingId}/accept`
      );

    return response.data;
  };


export const rejectBooking =
  async (bookingId) => {

    const response =
      await api.put(
        `/property-bookings/${bookingId}/reject`
      );

    return response.data;
  };


export const cancelBooking =
  async (bookingId) => {

    const response =
      await api.put(
        `/property-bookings/${bookingId}/cancel`
      );

    return response.data;
  };


export const completeBooking =
  async (bookingId) => {

    const response =
      await api.put(
        `/property-bookings/${bookingId}/complete`
      );

    return response.data;
  };


// =====================================================
// PAYMENT APIs
// =====================================================

// -----------------------------------------------------
// CREATE PAYMENT
// -----------------------------------------------------

export const createPayment =
  async (paymentData) => {

    const response =
      await api.post(
        "/payments",
        paymentData
      );

    return response.data;
  };


// -----------------------------------------------------
// GET PAYMENT BY ID
// -----------------------------------------------------

export const getPaymentById =
  async (paymentId) => {

    const response =
      await api.get(
        `/payments/${paymentId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// GET ALL PAYMENTS
// -----------------------------------------------------

export const getAllPayments =
  async () => {

    const response =
      await api.get(
        "/payments/all"
      );

    return response.data;
  };


// -----------------------------------------------------
// GET CUSTOMER PAYMENTS
// -----------------------------------------------------

export const getCustomerPayments =
  async (customerId) => {

    const response =
      await api.get(
        `/payments/customer/${customerId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// GET OWNER PAYMENTS
// -----------------------------------------------------

export const getOwnerPayments =
  async (ownerId) => {

    const response =
      await api.get(
        `/payments/owner/${ownerId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// GET BOOKING PAYMENTS
// -----------------------------------------------------

export const getBookingPayments =
  async (bookingId) => {

    const response =
      await api.get(
        `/payments/booking/${bookingId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// MARK PAYMENT SUCCESSFUL
// -----------------------------------------------------

export const markPaymentSuccessful =
  async (paymentId) => {

    const response =
      await api.put(
        `/payments/${paymentId}/success`
      );

    return response.data;
  };


// -----------------------------------------------------
// ALIAS: successPayment
// -----------------------------------------------------
// This is provided because some frontend components
// may import successPayment.

export const successPayment =
  async (paymentId) => {

    return markPaymentSuccessful(
      paymentId
    );
  };


// -----------------------------------------------------
// MARK PAYMENT FAILED
// -----------------------------------------------------

export const markPaymentFailed =
  async (paymentId) => {

    const response =
      await api.put(
        `/payments/${paymentId}/failed`
      );

    return response.data;
  };


// -----------------------------------------------------
// ALIAS: failedPayment
// -----------------------------------------------------
// This fixes:
// "does not provide an export named 'failedPayment'"

export const failedPayment =
  async (paymentId) => {

    return markPaymentFailed(
      paymentId
    );
  };


// -----------------------------------------------------
// CANCEL PAYMENT
// -----------------------------------------------------

export const cancelPayment =
  async (paymentId) => {

    const response =
      await api.put(
        `/payments/${paymentId}/cancel`
      );

    return response.data;
  };


// -----------------------------------------------------
// REFUND PAYMENT
// -----------------------------------------------------

export const refundPayment =
  async (paymentId) => {

    const response =
      await api.put(
        `/payments/${paymentId}/refund`
      );

    return response.data;
  };


// -----------------------------------------------------
// DELETE PAYMENT
// -----------------------------------------------------

export const deletePayment =
  async (paymentId) => {

    const response =
      await api.delete(
        `/payments/${paymentId}`
      );

    return response.data;
  };


// =====================================================
// COMPLAINT APIs
// =====================================================

export const getAllComplaints =
  async () => {

    const response =
      await api.get(
        "/complaints"
      );

    return response.data;
  };


export const getComplaintById =
  async (id) => {

    const response =
      await api.get(
        `/complaints/${id}`
      );

    return response.data;
  };


export const updateComplaintStatus =
  async (
    id,
    status,
    adminRemark
  ) => {

    const response =
      await api.put(
        `/complaints/${id}`,
        null,
        {
          params: {
            status,
            adminRemark,
          },
        }
      );

    return response.data;
  };


// =====================================================
// CUSTOMER COMPLAINT APIs
// =====================================================

export const createComplaint =
  async (complaintData) => {

    const response =
      await api.post(
        "/complaints",
        complaintData
      );

    return response.data;
  };


export const getCustomerComplaints =
  async (userId) => {

    const response =
      await api.get(
        `/complaints/user/${userId}`
      );

    return response.data;
  };


export const getCustomerComplaintById =
  async (complaintId) => {

    const response =
      await api.get(
        `/complaints/${complaintId}`
      );

    return response.data;
  };


// =====================================================
// NOTIFICATION APIs
// =====================================================

export const getAllNotifications =
  async () => {

    const response =
      await api.get(
        "/notifications"
      );

    return response.data;
  };


export const getUserNotifications =
  async (userId) => {

    const response =
      await api.get(
        `/notifications/user/${userId}`
      );

    return response.data;
  };


export const getUnreadNotifications =
  async (userId) => {

    const response =
      await api.get(
        `/notifications/user/${userId}/unread`
      );

    return response.data;
  };


export const getUnreadNotificationCount =
  async (userId) => {

    const response =
      await api.get(
        `/notifications/user/${userId}/count`
      );

    return response.data;
  };


export const markNotificationAsRead =
  async (notificationId) => {

    const response =
      await api.put(
        `/notifications/${notificationId}/read`
      );

    return response.data;
  };


export const deleteNotification =
  async (notificationId) => {

    const response =
      await api.delete(
        `/notifications/${notificationId}`
      );

    return response.data;
  };


// =====================================================
// FAVOURITE APIs
// =====================================================

export const addFavourite =
  async (favouriteData) => {

    const response =
      await api.post(
        "/favourites",
        favouriteData
      );

    return response.data;
  };


export const getCustomerFavourites =
  async (userId) => {

    const response =
      await api.get(
        `/favourites/${userId}`
      );

    return response.data;
  };


export const removeFavourite =
  async (
    userId,
    propertyId
  ) => {

    const response =
      await api.delete(
        `/favourites/${userId}/${propertyId}`
      );

    return response.data;
  };


// =====================================================
// REVIEW APIs
// =====================================================

export const createReview =
  async (reviewData) => {

    const response =
      await api.post(
        "/reviews",
        reviewData
      );

    return response.data;
  };


export const getReviewById =
  async (reviewId) => {

    const response =
      await api.get(
        `/reviews/${reviewId}`
      );

    return response.data;
  };


export const getPropertyReviews =
  async (propertyId) => {

    const response =
      await api.get(
        `/reviews/property/${propertyId}`
      );

    return response.data;
  };


export const getCustomerReviews =
  async (customerId) => {

    const response =
      await api.get(
        `/reviews/user/${customerId}`
      );

    return response.data;
  };


export const deleteReview =
  async (reviewId) => {

    const response =
      await api.delete(
        `/reviews/${reviewId}`
      );

    return response.data;
  };


// =====================================================
// PROPERTY IMAGE APIs
// =====================================================

// -----------------------------------------------------
// UPLOAD PROPERTY IMAGE
// -----------------------------------------------------

export const uploadPropertyImage =
  async (
    propertyId,
    file,
    displayOrder = 0
  ) => {

    const formData =
      new FormData();


    formData.append(
      "propertyId",
      propertyId
    );


    formData.append(
      "file",
      file
    );


    formData.append(
      "displayOrder",
      String(displayOrder)
    );


    /*
     * IMPORTANT:
     *
     * Do NOT manually set:
     *
     * Content-Type:
     * multipart/form-data
     *
     * Axios/browser will automatically
     * generate the multipart boundary.
     */

    const response =
      await api.post(
        "/property-images",
        formData
      );


    return response.data;
  };


// -----------------------------------------------------
// GET PROPERTY IMAGES
// -----------------------------------------------------

export const getPropertyImages =
  async (propertyId) => {

    const response =
      await api.get(
        `/property-images/property/${propertyId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// DELETE PROPERTY IMAGE
// -----------------------------------------------------

export const deletePropertyImage =
  async (imageId) => {

    const response =
      await api.delete(
        `/property-images/${imageId}`
      );

    return response.data;
  };


// =====================================================
// PROPERTY INQUIRY APIs
// =====================================================

// -----------------------------------------------------
// CREATE CUSTOMER INQUIRY
// -----------------------------------------------------

export const createInquiry =
  async (inquiryData) => {

    const response =
      await api.post(
        "/property-inquiries",
        inquiryData
      );

    return response.data;
  };


// -----------------------------------------------------
// GET CUSTOMER INQUIRIES
// -----------------------------------------------------

export const getCustomerInquiries =
  async (customerId) => {

    const response =
      await api.get(
        `/property-inquiries/customer/${customerId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// GET OWNER INQUIRIES
// -----------------------------------------------------

export const getOwnerInquiries =
  async (ownerId) => {

    const response =
      await api.get(
        `/property-inquiries/owner/${ownerId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// GET PROPERTY INQUIRIES
// -----------------------------------------------------

export const getPropertyInquiries =
  async (propertyId) => {

    const response =
      await api.get(
        `/property-inquiries/property/${propertyId}`
      );

    return response.data;
  };


// -----------------------------------------------------
// ACCEPT INQUIRY
// -----------------------------------------------------

export const acceptInquiry =
  async (inquiryId) => {

    const response =
      await api.put(
        `/property-inquiries/${inquiryId}/accept`
      );

    return response.data;
  };


// -----------------------------------------------------
// REJECT INQUIRY
// -----------------------------------------------------

export const rejectInquiry =
  async (inquiryId) => {

    const response =
      await api.put(
        `/property-inquiries/${inquiryId}/reject`
      );

    return response.data;
  };


// -----------------------------------------------------
// CLOSE INQUIRY
// -----------------------------------------------------

export const closeInquiry =
  async (inquiryId) => {

    const response =
      await api.put(
        `/property-inquiries/${inquiryId}/close`
      );

    return response.data;
  };


// -----------------------------------------------------
// DELETE INQUIRY
// -----------------------------------------------------

export const deleteInquiry =
  async (inquiryId) => {

    const response =
      await api.delete(
        `/property-inquiries/${inquiryId}`
      );

    return response.data;
  };


// =====================================================
// OWNER REVIEW APIs
// =====================================================

export const getOwnerReviews =
  async (ownerId) => {

    const response =
      await api.get(
        `/reviews/owner/${ownerId}`
      );

    return response.data;
  };

  // =====================================================
// OWNER COMPLAINT APIs
// =====================================================

export const getOwnerComplaints = async (ownerId) => {
  const response = await api.get(
    `/complaints/owner/${ownerId}`
  );

  return response.data;
};

// =====================================================
// UPLOAD PROFILE IMAGE
// =====================================================

export const uploadProfileImage = async (file) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.put(
    "/users/me/profile-image",
    formData
  );

  return response.data;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;