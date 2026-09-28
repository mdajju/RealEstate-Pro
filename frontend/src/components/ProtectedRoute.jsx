import { Navigate, Outlet } from "react-router-dom";

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ allowedRoles }) {

  // ===================================================
  // GET JWT TOKEN
  // ===================================================

  const token = localStorage.getItem("token");

  // ---------------------------------------------------
  // NO TOKEN
  // ---------------------------------------------------

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ===================================================
  // GET USER
  // ===================================================

  const storedUser =
    localStorage.getItem("user");

  let user = null;


  // ===================================================
  // PARSE USER
  // ===================================================

  try {

    user = storedUser
      ? JSON.parse(storedUser)
      : null;

  } catch (error) {

    console.error(
      "Invalid user data:",
      error
    );

    user = null;
  }


  // ===================================================
  // USER NOT FOUND
  // ===================================================

  if (!user) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ===================================================
  // GET USER ROLE
  // ===================================================

  let userRole = "";


  // ---------------------------------------------------
  // CASE 1
  // roleName
  // ---------------------------------------------------

  if (
    typeof user.roleName === "string"
  ) {

    userRole =
      user.roleName;

  }


  // ---------------------------------------------------
  // CASE 2
  // role
  // ---------------------------------------------------

  else if (
    typeof user.role === "string"
  ) {

    userRole =
      user.role;

  }


  // ---------------------------------------------------
  // CASE 3
  // role.roleName
  // ---------------------------------------------------

  else if (
    user.role &&
    typeof user.role.roleName === "string"
  ) {

    userRole =
      user.role.roleName;

  }


  // ---------------------------------------------------
  // CASE 4
  // role.name
  // ---------------------------------------------------

  else if (
    user.role &&
    typeof user.role.name === "string"
  ) {

    userRole =
      user.role.name;

  }


  // ===================================================
  // NORMALIZE ROLE
  // ===================================================

  userRole =
    userRole
      .trim()
      .toUpperCase();


  console.log(
    "ProtectedRoute - User Role:",
    userRole
  );

  console.log(
    "ProtectedRoute - Allowed Roles:",
    allowedRoles
  );


  // ===================================================
  // ROLE NOT FOUND
  // ===================================================

  if (!userRole) {

    console.error(
      "User role not found."
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ===================================================
  // CHECK ROLE PERMISSION
  // ===================================================

  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0
  ) {

    const normalizedAllowedRoles =
      allowedRoles.map(
        (role) =>
          String(role)
            .trim()
            .toUpperCase()
      );


    const hasPermission =
      normalizedAllowedRoles.includes(
        userRole
      );


    // =================================================
    // ROLE DOES NOT HAVE ACCESS
    // =================================================

    if (!hasPermission) {

      console.warn(
        `Access denied. User role: ${userRole}. Allowed roles: ${normalizedAllowedRoles.join(", ")}`
      );


      // ------------------------------------------------
      // IMPORTANT:
      // DO NOT REDIRECT ADMIN TO ADMIN DASHBOARD
      //
      // Instead send the user to LOGIN.
      // After successful login, Login.jsx will decide
      // where the user should go based on their role.
      // ------------------------------------------------

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
  }


  // ===================================================
  // ACCESS GRANTED
  // ===================================================

  return <Outlet />;
}


export default ProtectedRoute;