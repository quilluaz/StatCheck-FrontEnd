import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function UserForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phoneNumber: '',
    status: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit User</h2>
      
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        className="bg-gray-50 border border-gray-300 rounded-md p-2"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        className="bg-gray-50 border border-gray-300 rounded-md p-2"
      />
      <FormControl fullWidth className="bg-gray-50 border border-gray-300 rounded-md">
        <InputLabel>Role</InputLabel>
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="bg-white"
        >
          <MenuItem value="Active">Student</MenuItem>
          <MenuItem value="Inactive">Teacher</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        fullWidth
        className="bg-gray-50 border border-gray-300 rounded-md p-2"
      />
      <FormControl fullWidth className="bg-gray-50 border border-gray-300 rounded-md">
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="bg-white"
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
      >
        Save Changes
      </Button>
    </Box>
  );
}

export default UserForm;
