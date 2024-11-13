import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:8080/api/timeslots";

const TimeSlotComponent = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "",
    endTime: "",
    subject: { subjectId: "" },
    schedule: { scheduleId: "" },
  });
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [scheduleResponse, subjectResponse, timeSlotResponse] =
        await Promise.all([
          axios.get("http://localhost:8080/api/schedules/getAll"),
          axios.get("http://localhost:8080/api/subjects/getAll"),
          axios.get(`${API_URL}/getAll`),
        ]);

      setSchedules(scheduleResponse.data);
      setSubjects(subjectResponse.data);
      setTimeSlots(timeSlotResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subjectId") {
      setNewTimeSlot((prev) => ({
        ...prev,
        subject: { subjectId: value },
      }));
    } else if (name === "scheduleId") {
      setNewTimeSlot((prev) => ({
        ...prev,
        schedule: { scheduleId: value },
      }));
    } else {
      setNewTimeSlot((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const timeSlotData = {
        startTime: newTimeSlot.startTime,
        endTime: newTimeSlot.endTime,
        subject: { subjectId: parseInt(newTimeSlot.subject.subjectId) },
        schedule: { scheduleId: parseInt(newTimeSlot.schedule.scheduleId) },
      };

      let response;
      if (editId) {
        response = await axios.put(`${API_URL}/update/${editId}`, timeSlotData);
      } else {
        response = await axios.post(`${API_URL}/create`, timeSlotData);
      }

      const updatedTimeSlot = await axios.get(
        `${API_URL}/getById/${editId || response.data.timeSlotId}`
      );

      if (editId) {
        setTimeSlots(
          timeSlots.map((timeSlot) =>
            timeSlot.timeSlotId === editId ? updatedTimeSlot.data : timeSlot
          )
        );
      } else {
        setTimeSlots([...timeSlots, updatedTimeSlot.data]);
      }
      resetForm();
    } catch (error) {
      setError(
        editId
          ? `Failed to update time slot: ${
              error.response?.data?.message || error.message
            }`
          : `Failed to create time slot: ${
              error.response?.data?.message || error.message
            }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (timeSlot) => {
    setEditId(timeSlot.timeSlotId);
    setNewTimeSlot({
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      subject: { subjectId: timeSlot.subject?.subjectId?.toString() || "" },
      schedule: { scheduleId: timeSlot.schedule?.scheduleId?.toString() || "" },
    });
  };

  const handleDelete = async (timeSlotId) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/deleteById/${timeSlotId}`);
      setTimeSlots(
        timeSlots.filter((timeSlot) => timeSlot.timeSlotId !== timeSlotId)
      );
    } catch (error) {
      setError(
        `Failed to delete time slot: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewTimeSlot({
      startTime: "",
      endTime: "",
      subject: { subjectId: "" },
      schedule: { scheduleId: "" },
    });
    setEditId(null);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Time Slots
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                value={newTimeSlot.startTime}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                value={newTimeSlot.endTime}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Schedule"
                name="scheduleId"
                value={newTimeSlot.schedule.scheduleId}
                onChange={handleChange}
                required>
                {schedules.map((schedule) => (
                  <MenuItem
                    key={schedule.scheduleId}
                    value={schedule.scheduleId?.toString() || ""}>
                    {schedule.dayOfWeek} - {schedule.roomID}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Subject"
                name="subjectId"
                value={newTimeSlot.subject.subjectId}
                onChange={handleChange}
                required>
                {subjects.map((subject) => (
                  <MenuItem
                    key={subject.subjectId}
                    value={subject.subjectId?.toString() || ""}>
                    {subject.subjectName} - {subject.section}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth>
                {editId ? "Update Time Slot" : "Add Time Slot"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot) => (
              <TableRow key={timeSlot.timeSlotId}>
                <TableCell>{timeSlot.startTime || "N/A"}</TableCell>
                <TableCell>{timeSlot.endTime || "N/A"}</TableCell>
                <TableCell>
                  {timeSlot.schedule
                    ? `${timeSlot.schedule.dayOfWeek} - ${timeSlot.schedule.roomID}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {timeSlot.subject
                    ? `${timeSlot.subject.subjectName} - ${timeSlot.subject.section}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(timeSlot)}
                    color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(timeSlot.timeSlotId)}
                    color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeSlotComponent;
