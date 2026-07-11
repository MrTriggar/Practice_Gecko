// Убираем import React, так как он не используется
import { Box, Typography, Paper } from '@mui/material';

export const Workspace: React.FC = () => {
  return (
    <Box sx={{ 
      height: '100%', 
      bgcolor: '#1a1a1a', 
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper sx={{ 
        bgcolor: '#2d2d2d', 
        p: 5, 
        borderRadius: 2,
        textAlign: 'center',
      }}>
        <Typography variant="h4" sx={{ color: '#e74c3c', mb: 2 }}>
          Добро пожаловать в Sander! 🎉
        </Typography>
        <Typography variant="body1" sx={{ color: '#999' }}>
          Здесь будет рабочее пространство разметчика
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 2 }}>
          Скоро здесь появится waveform, сегменты и редактор текста
        </Typography>
      </Paper>
    </Box>
  );
};