import axios from "axios";

const API_URL = "http://localhost:8080/api/subjects";

const createSubject = (subject) => axios.post(`${API_URL}/create`, subject);
const getAllSubjects = () => axios.get(`${API_URL}/getAll`);
const getSubjectById = (subjectId) =>
  axios.get(`${API_URL}/getById/${subjectId}`);
const updateSubject = (subjectId, subject) =>
  axios.put(`${API_URL}/update/${subjectId}`, subject);
const deleteSubject = (subjectId) =>
  axios.delete(`${API_URL}/deleteById/${subjectId}`);

export default {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
