import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";

// =====================================================
// PROTECTED ROUTE
// =====================================================

import ProtectedRoute from "../components/ProtectedRoute";

// =====================================================
// ADMIN LAYOUT
// =====================================================

import AdminLayout from "../layouts/AdminLayout";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminUsers from "../pages/admin/AdminUsers";

import AdminProperties from "../pages/admin/AdminProperties";
import CreateProperty from "../pages/admin/CreateProperty";
import AdminPropertyDetails from "../pages/admin/AdminPropertyDetails";
import EditProperty from "../pages/admin/EditProperty";

import AdminBookings from "../pages/admin/AdminBookings";
import AdminBookingDetails from "../pages/admin/AdminBookingDetails";

import AdminPayments from "../pages/admin/AdminPayments";
import AdminComplaints from "../pages/admin/AdminComplaints";

import AdminLocations from "../pages/admin/AdminLocations";
import AdminNotifications from "../pages/admin/AdminNotifications";

// =====================================================
// CUSTOMER LAYOUT
// =====================================================

import CustomerLayout from "../layouts/CustomerLayout";

// =====================================================
// CUSTOMER PAGES
// =====================================================

import CustomerDashboard from "../pages/customer/CustomerDashboard";

import CustomerProperties from "../pages/customer/CustomerProperties";
import CustomerPropertyDetails from "../pages/customer/CustomerPropertyDetails";
import CustomerCreateBooking from "../pages/customer/CustomerCreateBooking";

import CustomerBookings from "../pages/customer/CustomerBookings";
import CustomerBookingDetails from "../pages/customer/CustomerBookingDetails";

import CustomerFavourites from "../pages/customer/CustomerFavourites";
import CustomerPayments from "../pages/customer/CustomerPayments";
import CustomerNotifications from "../pages/customer/CustomerNotifications";

import CustomerReviews from "../pages/customer/CustomerReviews";
import CustomerComplaints from "../pages/customer/CustomerComplaints";
import CustomerProfile from "../pages/customer/CustomerProfile";

// =====================================================
// OWNER LAYOUT
// =====================================================

import OwnerLayout from "../layouts/OwnerLayout";

// =====================================================
// OWNER PAGES
// =====================================================

import OwnerDashboard from "../pages/owner/OwnerDashboard";

import OwnerProperties from "../pages/owner/OwnerProperties";
import OwnerPropertyDetails from "../pages/owner/OwnerPropertyDetails";
import OwnerCreateProperty from "../pages/owner/OwnerCreateProperty";
import OwnerEditProperty from "../pages/owner/OwnerEditProperty";

import OwnerBookings from "../pages/owner/OwnerBookings";
import OwnerBookingDetails from "../pages/owner/OwnerBookingDetails";

import OwnerInquiries from "../pages/owner/OwnerInquiries";
import OwnerNotifications from "../pages/owner/OwnerNotifications";
import OwnerPayments from "../pages/owner/OwnerPayments";
import OwnerReviews from "../pages/owner/OwnerReviews";
import OwnerComplaints from "../pages/owner/OwnerComplaints";

import OwnerProfile from "../pages/owner/OwnerProfile";


// =====================================================
// APP ROUTES
// =====================================================

function AppRoutes() {

  return (

    <Routes>

      {/* =====================================================
          PUBLIC HOME PAGE
      ===================================================== */}

      <Route
        path="/"
        element={<Index />}
      />


      {/* =====================================================
          LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =====================================================
          REGISTER
      ===================================================== */}

      <Route
        path="/register"
        element={<Register />}
      />



{/* Public property browsing — no login required */}
<Route
  path="/properties"
  element={<CustomerProperties />}
/>


<Route
  path="/properties/:id"
  element={<CustomerPropertyDetails />}
/>
      {/* =====================================================
          ADMIN PROTECTED ROUTES
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "SUPER_ADMIN",
            ]}
          />
        }
      >

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* ADMIN DASHBOARD */}

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

{/* ADMIN PROFILE */}

<Route
  path="profile"
  element={<AdminProfile />}
/>

          {/* ADMIN USERS */}

          <Route
            path="users"
            element={<AdminUsers />}
          />


          {/* ADMIN PROPERTIES */}

          <Route
            path="properties"
            element={<AdminProperties />}
          />

          <Route
            path="properties/create"
            element={<CreateProperty />}
          />

          <Route
            path="properties/:id/edit"
            element={<EditProperty />}
          />

          <Route
            path="properties/:id"
            element={<AdminPropertyDetails />}
          />


          {/* ADMIN BOOKINGS */}

          <Route
            path="bookings"
            element={<AdminBookings />}
          />

          <Route
            path="bookings/:id"
            element={<AdminBookingDetails />}
          />


          {/* ADMIN PAYMENTS */}

          <Route
            path="payments"
            element={<AdminPayments />}
          />


          {/* ADMIN COMPLAINTS */}

          <Route
            path="complaints"
            element={<AdminComplaints />}
          />


          {/* ADMIN LOCATIONS */}

          <Route
            path="locations"
            element={<AdminLocations />}
          />


          {/* ADMIN NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />

        </Route>

      </Route>


      {/* =====================================================
          CUSTOMER PROTECTED ROUTES
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "CUSTOMER",
            ]}
          />
        }
      >

        <Route
          path="/customer"
          element={<CustomerLayout />}
        >

          {/* CUSTOMER PROFILE */}

          <Route
            path="profile"
            element={<CustomerProfile />}
          />


          {/* CUSTOMER DASHBOARD */}

          <Route
            path="dashboard"
            element={<CustomerDashboard />}
          />


          {/* CUSTOMER PROPERTIES */}

          <Route
            path="properties"
            element={<CustomerProperties />}
          />


          {/* CUSTOMER CREATE BOOKING */}

          <Route
            path="properties/:id/book"
            element={<CustomerCreateBooking />}
          />


          {/* CUSTOMER PROPERTY DETAILS */}

          <Route
            path="properties/:id"
            element={<CustomerPropertyDetails />}
          />


          {/* CUSTOMER BOOKINGS */}

          <Route
            path="bookings"
            element={<CustomerBookings />}
          />


          {/* CUSTOMER BOOKING DETAILS */}

          <Route
            path="bookings/:id"
            element={<CustomerBookingDetails />}
          />


          {/* CUSTOMER FAVOURITES */}

          <Route
            path="favourites"
            element={<CustomerFavourites />}
          />


          {/* CUSTOMER PAYMENTS */}

          <Route
            path="payments"
            element={<CustomerPayments />}
          />


          {/* CUSTOMER NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<CustomerNotifications />}
          />


          {/* CUSTOMER REVIEWS */}

          <Route
            path="reviews"
            element={<CustomerReviews />}
          />


          {/* CUSTOMER COMPLAINTS */}

          <Route
            path="complaints"
            element={<CustomerComplaints />}
          />

        </Route>

      </Route>


      {/* =====================================================
          OWNER PROTECTED ROUTES
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "OWNER",
            ]}
          />
        }
      >

        <Route
          path="/owner"
          element={<OwnerLayout />}
        >

          {/* OWNER DASHBOARD */}

          <Route
            path="dashboard"
            element={<OwnerDashboard />}
          />


          {/* OWNER PROFILE */}

          <Route
            path="profile"
            element={<OwnerProfile />}
          />


          {/* OWNER PROPERTIES */}

          <Route
            path="properties"
            element={<OwnerProperties />}
          />


          {/* OWNER CREATE PROPERTY */}

          <Route
            path="properties/create"
            element={<OwnerCreateProperty />}
          />


          {/* OWNER PROPERTY DETAILS */}

          <Route
            path="properties/:id"
            element={<OwnerPropertyDetails />}
          />


          {/* OWNER EDIT PROPERTY */}

          <Route
            path="properties/:id/edit"
            element={<OwnerEditProperty />}
          />


          {/* OWNER BOOKINGS */}

          <Route
            path="bookings"
            element={<OwnerBookings />}
          />


          {/* OWNER BOOKING DETAILS */}

          <Route
            path="bookings/:id"
            element={<OwnerBookingDetails />}
          />


          {/* OWNER INQUIRIES */}

          <Route
            path="inquiries"
            element={<OwnerInquiries />}
          />


          {/* OWNER NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<OwnerNotifications />}
          />


          {/* OWNER PAYMENTS */}

          <Route
            path="payments"
            element={<OwnerPayments />}
          />


          {/* OWNER REVIEWS */}

          <Route
            path="reviews"
            element={<OwnerReviews />}
          />


          {/* OWNER COMPLAINTS */}

          <Route
            path="complaints"
            element={<OwnerComplaints />}
          />

        </Route>

      </Route>


      {/* =====================================================
          UNKNOWN ROUTE
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );
}

export default AppRoutes;