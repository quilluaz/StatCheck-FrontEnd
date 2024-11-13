import axios from "axios";

const API_URL = "http://localhost:8080/api/timeslots";
const createTimeSlot = (timeSlot) => axios.post(`${API_URL}/create`, timeSlot);
const getAllTimeSlots = () => axios.get(`${API_URL}/getAll`);
const getTimeSlotById = (timeSlotId) =>
  axios.get(`${API_URL}/getById/${timeSlotId}`);
const updateTimeSlot = (timeSlotId, timeSlot) =>
  axios.put(`${API_URL}/update/${timeSlotId}`, timeSlot);
const deleteTimeSlot = (timeSlotId) =>
  axios.delete(`${API_URL}/deleteById/${timeSlotId}`);

export default {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
};
