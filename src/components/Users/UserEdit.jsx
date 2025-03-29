import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const UserEdit = ({ user, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });

  const handleSubmit = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${user.id}`, formData);
      onSave();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6">Edit User</Typography>
      <TextField
        fullWidth
        label="First Name"
        value={formData.first_name}
        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Last Name"
        value={formData.last_name}
        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        margin="normal"
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>
          Save
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UserEdit;