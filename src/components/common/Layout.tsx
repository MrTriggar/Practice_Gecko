// Убираем IconButton, так как он не используется
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../../hooks';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#2d2d2d' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1, color: '#e74c3c' }}>
            Sander
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mr: 2 }}>
            {user?.full_name || user?.email || 'Пользователь'}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{
              color: '#e74c3c',
              borderColor: '#e74c3c',
              '&:hover': { borderColor: '#c0392b' },
            }}
          >
            <Logout sx={{ mr: 0.5 }} fontSize="small" />
            Выйти
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
};