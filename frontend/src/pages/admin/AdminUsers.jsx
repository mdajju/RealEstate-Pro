import { useEffect, useState } from "react";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../api";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showView, setShowView] =
    useState(false);

  const [showEdit, setShowEdit] =
    useState(false);

  const [editForm, setEditForm] =
    useState({});

  const [saving, setSaving] =
    useState(false);


  // =========================================
  // LOAD USERS
  // =========================================

  useEffect(() => {

    fetchUsers();

  }, []);


  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");

      const result =
        await getUsers();

      console.log(
        "Users API response:",
        result
      );

      if (result.success) {

        setUsers(
          result.data || []
        );

      } else {

        setError(
          result.message ||
          "Failed to load users."
        );
      }

    } catch (error) {

      console.error(
        "Users API error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // SEARCH
  // =========================================

  const filteredUsers =
    users.filter((user) => {

      const searchText =
        search.toLowerCase();

      return (

        user.firstName
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.lastName
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.email
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.mobile
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.roleName
          ?.toLowerCase()
          .includes(searchText)

      );

    });


  // =========================================
  // VIEW USER
  // =========================================

  const handleView = async (id) => {

    try {

      const result =
        await getUserById(id);

      console.log(
        "User details:",
        result
      );

      if (result.success) {

        setSelectedUser(
          result.data
        );

        setShowView(true);

      }

    } catch (error) {

      console.error(
        "Get user error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to fetch user."
      );
    }
  };


  // =========================================
  // OPEN EDIT
  // =========================================

  const handleEdit = (user) => {

    setSelectedUser(user);

    setEditForm({

      firstName:
        user.firstName || "",

      lastName:
        user.lastName || "",

      email:
        user.email || "",

      mobile:
        user.mobile || "",

      password: "",

      address:
        user.address || "",

      profileImage:
        user.profileImage || "",

      roleId:
        user.roleId || "",

    });

    setShowEdit(true);
  };


  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setEditForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );
  };


  // =========================================
  // UPDATE USER
  // =========================================

  const handleUpdate =
    async (event) => {

      event.preventDefault();

      try {

        setSaving(true);

        const result =
          await updateUser(
            selectedUser.id,
            editForm
          );

        console.log(
          "Update user response:",
          result
        );

        if (result.success) {

          alert(
            "User updated successfully."
          );

          setShowEdit(false);

          setSelectedUser(null);

          await fetchUsers();

        } else {

          alert(
            result.message ||
            "Failed to update user."
          );
        }

      } catch (error) {

        console.error(
          "Update user error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to update user."
        );

      } finally {

        setSaving(false);

      }
    };


  // =========================================
  // DELETE USER
  // =========================================

  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this user?"
        );

      if (!confirmed) {
        return;
      }

      try {

        const result =
          await deleteUser(id);

        console.log(
          "Delete user response:",
          result
        );

        if (result.success) {

          alert(
            "User deleted successfully."
          );

          await fetchUsers();

        } else {

          alert(
            result.message ||
            "Failed to delete user."
          );
        }

      } catch (error) {

        console.error(
          "Delete user error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to delete user."
        );
      }
    };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="users-loading">

        <h2>
          Loading Users...
        </h2>

        <p>
          Please wait while we fetch
          the users.
        </p>

      </div>
    );
  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div className="users-error">

        <h2>
          Users Error
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={fetchUsers}
        >
          Try Again
        </button>

      </div>
    );
  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="admin-users">

      {/* HEADER */}

      <div className="users-header">

        <div>

          <h1>
            Users Management
          </h1>

          <p>
            Manage all registered
            RealEstate Pro users.
          </p>

        </div>


        <button
          type="button"
          className="refresh-button"
          onClick={fetchUsers}
        >
          Refresh
        </button>

      </div>


      {/* SEARCH */}

      <div className="users-toolbar">

        <input
          type="text"
          placeholder="Search by name, email, mobile or role..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="user-search"
        />

        <span className="user-count">

          {filteredUsers.length}

          {" "}

          user
          {filteredUsers.length !== 1
            ? "s"
            : ""}

        </span>

      </div>


      {/* TABLE */}

      <div className="users-table-container">

        <table className="users-table">

          <thead>

            <tr>

              <th>#</th>

              <th>Name</th>

              <th>Email</th>

              <th>Mobile</th>

              <th>Role</th>

              <th>Status</th>

              <th>Verified</th>

              <th>Created</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  className="no-users"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              filteredUsers.map(
                (user, index) => (

                  <tr key={user.id}>

                    <td>
                      {index + 1}
                    </td>


                    <td>

                      <div className="user-name">

                        {user.profileImage ? (

                          <img
                            src={
                              user.profileImage
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            className="user-avatar"
                          />

                        ) : (

                          <div className="user-avatar-placeholder">

                            {user.firstName
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>

                        )}

                        <span>

                          {user.firstName}

                          {" "}

                          {user.lastName}

                        </span>

                      </div>

                    </td>


                    <td>
                      {user.email}
                    </td>


                    <td>
                      {user.mobile || "-"}
                    </td>


                    <td>

                      <span className="role-badge">

                        {user.roleName || "-"}

                      </span>

                    </td>


                    <td>

                      <span
                        className={`status-badge ${
                          user.status
                            ?.toLowerCase()
                            .replace(
                              "_",
                              "-"
                            )
                        }`}
                      >

                        {user.status || "-"}

                      </span>

                    </td>


                    <td>

                      {user.verified ? (

                        <span className="verified-badge">
                          Verified
                        </span>

                      ) : (

                        <span className="not-verified-badge">
                          Not Verified
                        </span>

                      )}

                    </td>


                    <td>

                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "-"}

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="user-actions">

                        <button
                          type="button"
                          className="view-button"
                          onClick={() =>
                            handleView(
                              user.id
                            )
                          }
                        >
                          View
                        </button>


                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEdit(
                              user
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              user.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ===================================
          VIEW USER MODAL
      ==================================== */}

      {showView &&
        selectedUser && (

          <div className="modal-overlay">

            <div className="user-modal">

              <div className="modal-header">

                <h2>
                  User Details
                </h2>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() =>
                    setShowView(false)
                  }
                >
                  ×
                </button>

              </div>


              <div className="user-details">

                <p>
                  <strong>
                    Name:
                  </strong>

                  {" "}

                  {selectedUser.firstName}{" "}
                  {selectedUser.lastName}
                </p>


                <p>
                  <strong>
                    Email:
                  </strong>

                  {" "}

                  {selectedUser.email}
                </p>


                <p>
                  <strong>
                    Mobile:
                  </strong>

                  {" "}

                  {selectedUser.mobile ||
                    "-"}
                </p>


                <p>
                  <strong>
                    Address:
                  </strong>

                  {" "}

                  {selectedUser.address ||
                    "-"}
                </p>


                <p>
                  <strong>
                    Role:
                  </strong>

                  {" "}

                  {selectedUser.roleName ||
                    "-"}
                </p>


                <p>
                  <strong>
                    Status:
                  </strong>

                  {" "}

                  {selectedUser.status ||
                    "-"}
                </p>


                <p>
                  <strong>
                    Verified:
                  </strong>

                  {" "}

                  {selectedUser.verified
                    ? "Yes"
                    : "No"}
                </p>


                <p>
                  <strong>
                    Created:
                  </strong>

                  {" "}

                  {selectedUser.createdAt
                    ? new Date(
                        selectedUser.createdAt
                      ).toLocaleString()
                    : "-"}

                </p>


                <p>
                  <strong>
                    Updated:
                  </strong>

                  {" "}

                  {selectedUser.updatedAt
                    ? new Date(
                        selectedUser.updatedAt
                      ).toLocaleString()
                    : "-"}

                </p>

              </div>

            </div>

          </div>

        )}


      {/* ===================================
          EDIT USER MODAL
      ==================================== */}

      {showEdit &&
        selectedUser && (

          <div className="modal-overlay">

            <div className="user-modal edit-modal">

              <div className="modal-header">

                <h2>
                  Edit User
                </h2>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() =>
                    setShowEdit(false)
                  }
                >
                  ×
                </button>

              </div>


              <form
                onSubmit={
                  handleUpdate
                }
                className="edit-user-form"
              >

                <div className="edit-form-grid">


                  <div className="form-group">

                    <label>
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={
                        editForm.firstName ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        editForm.lastName ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        editForm.email ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Mobile
                    </label>

                    <input
                      type="text"
                      name="mobile"
                      value={
                        editForm.mobile ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      maxLength="10"
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={
                        editForm.password ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter password"
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Role ID
                    </label>

                    <input
                      type="text"
                      name="roleId"
                      value={
                        editForm.roleId ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="form-group full-width">

                    <label>
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={
                        editForm.address ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>


                  <div className="form-group full-width">

                    <label>
                      Profile Image URL
                    </label>

                    <input
                      type="text"
                      name="profileImage"
                      value={
                        editForm.profileImage ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>


                <div className="edit-form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      setShowEdit(false)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="save-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

    </div>
  );
}

export default AdminUsers;