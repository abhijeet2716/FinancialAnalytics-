import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyIcon from '@mui/icons-material/Key';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { AlertChips } from '../components/AlertChips';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid login credentials.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('analyst@finance.com');
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <Box
      id="login-page-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        p: 2,
      }}
    >
      <Card
        id="login-card"
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Brand Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <AccountBalanceWalletIcon fontSize="large" />
            </Box>
            <Typography
              id="login-heading"
              variant="h5"
              sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}
            >
              Financial Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Sign in with JWT credentials to access your dashboard
            </Typography>
          </Box>

          {/* Error message with required Alert Chip pattern */}
          {errorMessage && (
            <AlertChips
              id="login-error-alert-chip"
              type="error"
              title="Authentication Failed"
              message={errorMessage}
              chipLabel="LOGIN ERROR"
              onClose={() => setErrorMessage(null)}
            />
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="login-email-input"
              label="Email Address"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@finance.com"
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
            />

            <TextField
              id="login-password-input"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="toggle-password-visibility-btn"
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />

            <Button
              id="login-submit-button"
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOutlinedIcon />}
              sx={{
                py: 1.25,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: '#2563eb',
                '&:hover': { backgroundColor: '#1d4ed8' },
                borderRadius: 2,
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Demo User Helper Box */}
          <Box
            id="demo-credentials-box"
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <KeyIcon sx={{ color: '#2563eb', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                Seeded Demo Credentials
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mb: 1.5 }}>
              Email: <strong>analyst@finance.com</strong> &bull; Password: <strong>password123</strong>
            </Typography>
            <Chip
              id="fill-demo-credentials-chip"
              label="Click to Auto-Fill Demo Credentials"
              onClick={fillDemoCredentials}
              color="primary"
              variant="outlined"
              size="small"
              clickable
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
