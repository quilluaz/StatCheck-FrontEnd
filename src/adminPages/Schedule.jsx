import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Paper,
  Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import scheduleService from '../services/ScheduleAPI';

const ScheduleComponent = () => {
  const [schedules, setSchedules] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    roomID: '',
    dayOfWeek: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await scheduleService.getAllSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editId) {
        response = await scheduleService.updateSchedule(editId, scheduleData);
        setSchedules((prevSchedules) =>
          prevSchedules.map((s) =>
            s.scheduleId === editId ? response.data : s
          )
        );
      } else {
        response = await scheduleService.createSchedule(scheduleData);
        setSchedules((prevSchedules) => [...prevSchedules, response.data]);
      }
      setScheduleData({ roomID: '', dayOfWeek: '' });
      setEditId(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleEdit = (schedule) => {
    setEditId(schedule.scheduleId);
    setScheduleData({
      roomID: schedule.roomID,
      dayOfWeek: schedule.dayOfWeek,
    });
  };

  const handleDelete = async (scheduleId) => {
    try {
      await scheduleService.deleteSchedule(scheduleId);
      loadSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Day and Room
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room ID"
                name="roomID"
                value={scheduleData.roomID}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Day of the Week"
                name="dayOfWeek"
                value={scheduleData.dayOfWeek}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editId ? 'Update' : 'Add'} Schedule
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <List>
        {schedules
          .filter((schedule) => schedule.roomID && schedule.dayOfWeek)
          .map((schedule) => (
            <ListItem key={schedule.scheduleId} divider>
              <ListItemText
                primary={`ID: ${schedule.scheduleId} | Room: ${schedule.roomID}`}
                secondary={`Day: ${schedule.dayOfWeek}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(schedule)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(schedule.scheduleId)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default ScheduleComponent;