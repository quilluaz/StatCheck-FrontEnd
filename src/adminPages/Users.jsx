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
      .get("/users")
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
    api
      .put(`/users/${updatedUser.userID}`, updatedUser)
      .then(() => {
        loadUsers();
        setOpenEditDialog(false);
        setEditUser(null);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setError("Failed to update user. Please try again.");
      });
  };

  const handleDeleteUser = (userID) => {
    api
      .delete(`/users/${userID}`)
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

  // Reservation edit & delete handlers
  const handleEditReservationClick = (reservation) => {
    setEditReservation(reservation);
    setOpenReservationDialog(true);
  };

  const handleDeleteReservation = (reservationID) => {
    api
      .delete(`/reservations/${reservationID}`)
      .then(() => loadUsers())
      .catch((error) => {
        console.error("Error deleting reservation:", error);
        setError("Failed to delete reservation. Please try again.");
      });
  };

  const handleCloseReservationDialog = () => {
    setOpenReservationDialog(false);
    setEditReservation(null);
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
                Name
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                  <td className="px-6 py-4">{user.accountStatus}</td>
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

                {/* Reservations section */}
                {user.reservations && user.reservations.length > 0 && (
                  <tr>
                    <td colSpan={7} className="bg-gray-100 px-6 py-4">
                      <h3 className="text-lg font-medium">Reserved Room:</h3>
                      <table className="min-w-full mt-2 bg-white border border-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reservation ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Room Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time Slot
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.reservations.map((reservation) => (
                            <tr key={reservation.libraryReservationID}>
                              <td className="px-6 py-4">{reservation.libraryReservationID}</td>
                              <td className="px-6 py-4">{reservation.libraryRoom?.roomName}</td>
                              <td className="px-6 py-4">
                                {reservation.startTime} - {reservation.endTime}
                              </td>
                              <td className="px-6 py-4">{reservation.status}</td>
                              <td className="px-6 py-4 text-center">
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() =>
                                    handleDeleteReservation(reservation.libraryReservationID)
                                  }
                                  className="bg-red-500 text-white hover:bg-red-600 transition-all"
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
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

      {/* Edit reservation dialog */}
      <Dialog open={openReservationDialog} onClose={handleCloseReservationDialog} maxWidth="md">
        <DialogTitle>Edit Reservation</DialogTitle>
        <DialogContent>
          {/* Add your reservation edit form here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users;
