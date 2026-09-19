import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      id="main-appbar"
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, py: 1 }}>
        {/* Left: App Identity */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            id="brand-logo-container"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <AccountBalanceWalletIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              id="app-heading-title"
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.2, color: '#0f172a' }}
            >
              Financial Analytics Dashboard
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Company Transaction Tracking & Reporting
            </Typography>
          </Box>
        </Box>

        {/* Right: User profile & Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            id="jwt-status-chip"
            icon={<SecurityIcon style={{ fontSize: 16 }} />}
            label="JWT Verified"
            size="small"
            color="success"
            variant="outlined"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 500 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              id="user-avatar-badge"
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#3b82f6',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.name ? user.name.charAt(0) : 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: '#1e293b' }}>
                {user?.name || 'Financial Analyst'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {user?.email || 'analyst@finance.com'}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Log out of system">
            <Button
              id="logout-button"
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': {
                  borderColor: '#ef4444',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                },
              }}
            >
              Logout
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
