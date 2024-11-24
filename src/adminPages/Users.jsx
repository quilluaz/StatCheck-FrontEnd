import React, { useEffect, useState } from "react";
import { api } from "../services/UserAPI";
import UserForm from "./UserForms";
import { Button, Dialog, DialogContent, DialogTitle, Snackbar } from "@mui/material";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

  const loadUsers = () => {
    api
      .get("/auth")
      .then((response) => {
        const users = response.data;
        setUsers(users);
        setError(null);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
        setError("Failed to load users. Please try again later.");
      });
  };

  const handleAddUser = (userData) => {
    api
      .post("/users", userData)
      .then(() => loadUsers())
      .catch((error) => {
        console.error("Error adding user:", error);
        setError("Failed to add user. Please try again.");
      });
  };

  const handleUpdateUser = (updatedUser) => {
    const userWithID = { ...updatedUser, userID: editUser.userID };  // Ensure userID is passed
    api
      .put(`/auth/${userWithID.userID}`, userWithID) // Include the userID in the URL and payload
      .then((response) => {
        if (response.status === 200) {
          loadUsers();
          setOpenEditDialog(false);
          setEditUser(null);
        } else {
          setError("Failed to update user. Please~ try again.");
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setError("Failed to update user. Please try again.");
      });
  };

  
  const handleDeleteUser = (userID) => {
    api
      .delete(`/auth/${userID}`)
      .then(() => loadUsers())
      .catch((error) => {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      });
  };


  const handleEditClick = (user) => {
    setEditUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setEditUser(null);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />

      <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
      
      <div className="overflow-x-auto shadow-sm rounded-lg bg-white">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <React.Fragment key={user.userID}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.userID}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditClick(user)}
                        className="bg-blue-500 text-white hover:bg-blue-600 transition-all"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteUser(user.userID)}
                        className="bg-red-500 text-white hover:bg-red-600 transition-all"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit user dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <UserForm onSubmit={handleUpdateUser} user={editUser} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users;
