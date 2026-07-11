import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../hooks';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login({ email, password });
      navigate('/workspace');
    } catch (err) {
      // Ошибка уже обработана в хуке
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            bgcolor: '#2d2d2d',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#e74c3c', fontWeight: 'bold' }}
          >
            Sander
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: '#999', mb: 3 }}
          >
            Вход в систему разметки
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#9b59b6' },
                  '&.Mui-focused fieldset': { borderColor: '#e74c3c' },
                },
                '& .MuiInputLabel-root': {
                  color: '#999',
                },
              }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#9b59b6' },
                  '&.Mui-focused fieldset': { borderColor: '#e74c3c' },
                },
                '& .MuiInputLabel-root': {
                  color: '#999',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                bgcolor: '#e74c3c',
                '&:hover': { bgcolor: '#c0392b' },
                '&:disabled': { bgcolor: '#666' },
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </Button>
          </form>

          <Typography
            variant="caption"
            align="center"
            sx={{ display: 'block', mt: 2, color: '#666' }}
          >
            Демо-данные: admin@mail.ru / 123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};