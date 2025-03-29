import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://reqres.in/api/users?page=${page}`);
        setUsers(res.data.data);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  // Edit User
  const handleEdit = (user) => setEditingUser(user);

  const saveEdit = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser.id}`, {
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email
      });
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  // Delete User
  const confirmDelete = async () => {
    try {
      await axios.delete(`https://reqres.in/api/users/${deleteConfirm}`);
      setUsers(users.filter(u => u.id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <img src={user.avatar} alt="avatar" width="40" />
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleEdit(user)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={() => setDeleteConfirm(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{ mt: 3 }}
          />
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={editingUser?.first_name || ''}
            onChange={(e) => setEditingUser({
              ...editingUser,
              first_name: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={editingUser?.last_name || ''}
            onChange={(e) => setEditingUser({
              ...editingUser,
              last_name: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editingUser?.email || ''}
            onChange={(e) => setEditingUser({
              ...editingUser,
              email: e.target.value
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog 
        open={!!deleteConfirm} 
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;