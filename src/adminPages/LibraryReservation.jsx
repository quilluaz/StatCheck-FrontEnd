import React, { useEffect, useState } from "react";
import { api } from "../services/LibraryReservationAPI";
import LibraryRoomReservationForm from "./LibraryReservationForms";
import {
  Container,
  Typography,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function LibraryReservation() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const loadReservations = () => {
    api
      .get("/reservations")
      .then((response) => {
        setReservations(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setError("Failed to load reservations. Please try again later.");
      });
  };

  const handleDeleteReservation = (reservationID) => {
    api
      .delete(`/reservations/${reservationID}`)
      .then(() => loadReservations())
      .catch((error) => {
        console.error("Error deleting reservation:", error);
        setError("Failed to delete reservation. Please try again.");
      });
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Library Room Reservations
      </Typography>
      <LibraryRoomReservationForm onReservationAdded={loadReservations} />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
      <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Current Reservations
      </Typography>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Room</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.libraryReservationID}>
                <td>{reservation.user?.name || "Unknown User"}</td>
                <td>{reservation.libraryRoom?.roomName || "Unknown Room"}</td>
                <td>{reservation.startTime}</td>
                <td>{reservation.endTime}</td>
                <td>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleDeleteReservation(reservation.libraryReservationID)
                    }>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>Edit Reservation</DialogTitle>
        <DialogContent>
          <LibraryRoomReservationForm onReservationAdded={loadReservations} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LibraryReservation;
