import axios from "axios";

const API_URL = "http://localhost:8080/api/schedules";

const createSchedule = (schedule) => axios.post(`${API_URL}/create`, schedule);
const getAllSchedules = () => axios.get(`${API_URL}/getAll`);
const getScheduleById = (scheduleId) =>
  axios.get(`${API_URL}/getById/${scheduleId}`);
const updateSchedule = (scheduleId, schedule) =>
  axios.put(`${API_URL}/update/${scheduleId}`, schedule);
const deleteSchedule = (scheduleId) =>
  axios.delete(`${API_URL}/deleteById/${scheduleId}`);

export default {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
