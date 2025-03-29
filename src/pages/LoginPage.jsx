import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: 'eve.holt@reqres.in', // Verified correct email
    password: 'cityslicka' // Verified correct password
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. First verify the API endpoint is reachable
      const response = await axios.post('https://reqres.in/api/login', {
        email: formData.email.trim(),
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 2. Verify token is received
      if (!response.data.token) {
        throw new Error('No authentication token received');
      }

      // 3. Store token and redirect
      localStorage.setItem('authToken', response.data.token);
      navigate('/colors');
      
    } catch (err) {
      // Enhanced error handling
      let errorMessage = 'Login failed';
      
      if (err.response) {
        // API returned an error
        errorMessage = err.response.data.error || 'Invalid credentials';
      } else if (err.request) {
        // Request was made but no response
        errorMessage = 'Network error - please check your connection';
      } else {
        // Other errors
        errorMessage = err.message || 'Login process failed';
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleLogin}
      sx={{ 
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        p: 3,
        border: '1px solid #ddd',
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Login
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Test Credentials:</strong><br />
        Email: eve.holt@reqres.in<br />
        Password: cityslicka
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        margin="normal"
        required
        inputProps={{
          pattern: "^[a-zA-Z0-9._%+-]+@reqres\\.in$",
          title: "Must be a @reqres.in email"
        }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        margin="normal"
        required
        sx={{ mt: 2 }}
        inputProps={{
          autocomplete: "off" // Prevents password manager interference
        }}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} /> : 'LOGIN'}
      </Button>
    </Box>
  );
};

export default LoginPage;