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
  IconButton,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import subjectService from "../services/SubjectsAPI";

const SubjectComponent = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    section: "",
    instructor: "",
    classCapacity: "",
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response.data);
    } catch (err) {
      setError("Failed to fetch subjects");
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editId) {
        const response = await subjectService.updateSubject(editId, newSubject);
        setSubjects(
          subjects.map((subject) =>
            subject.subjectId === editId ? response.data : subject
          )
        );
      } else {
        const response = await subjectService.createSubject(newSubject);
        setSubjects([...subjects, response.data]);
      }
      resetForm();
    } catch (err) {
      setError(
        editId ? "Failed to update subject" : "Failed to create subject"
      );
      console.error(editId ? "Update failed:" : "Create failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditId(subject.subjectId);
    setNewSubject(subject);
  };

  const handleDelete = async (subjectId) => {
    setIsLoading(true);
    setError(null);
    try {
      await subjectService.deleteSubject(subjectId);
      setSubjects(
        subjects.filter((subject) => subject.subjectId !== subjectId)
      );
    } catch (err) {
      setError("Failed to delete subject");
      console.error("Delete failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewSubject({
      subjectName: "",
      section: "",
      instructor: "",
      classCapacity: "",
    });
    setEditId(null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Subjects
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
                label="Subject Name"
                name="subjectName"
                value={newSubject.subjectName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section"
                name="section"
                value={newSubject.section}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor"
                name="instructor"
                value={newSubject.instructor}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class Capacity"
                name="classCapacity"
                type="number"
                value={newSubject.classCapacity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}>
                {editId ? "Update" : "Add"} Subject
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Class Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.subjectId}>
                <TableCell>{subject.subjectId}</TableCell>
                <TableCell>{subject.subjectName}</TableCell>
                <TableCell>{subject.section}</TableCell>
                <TableCell>{subject.instructor}</TableCell>
                <TableCell>{subject.classCapacity}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(subject)}
                    color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(subject.subjectId)}
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

export default SubjectComponent;
