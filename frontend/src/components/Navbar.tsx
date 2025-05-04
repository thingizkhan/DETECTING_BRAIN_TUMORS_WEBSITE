import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '0.5rem 2rem'
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          MRI Report Analysis
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: '1rem',
          '& .MuiButton-root': {
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            }
          }
        }}>
          {isAuthenticated ? (
            <>
              <Button component={RouterLink} to="/">
                Home
              </Button>
              <Button component={RouterLink} to="/team">
                Team
              </Button>
              <Button component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/">
                Home
              </Button>
              <Button component={RouterLink} to="/team">
                Team
              </Button>
              <Button component={RouterLink} to="/login">
                Login
              </Button>
              <Button 
                component={RouterLink} 
                to="/register"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 