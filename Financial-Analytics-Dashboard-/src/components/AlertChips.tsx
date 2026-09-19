import React from 'react';
import { Box, Alert, Chip, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface AlertChipProps {
  id?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  chipLabel?: string;
  onClose?: () => void;
}

export const AlertChips: React.FC<AlertChipProps> = ({
  id = 'alert-chip-container',
  type = 'error',
  title,
  message,
  chipLabel,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningAmberIcon fontSize="small" />;
      case 'info':
        return <InfoOutlinedIcon fontSize="small" />;
      case 'success':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <ErrorIcon fontSize="small" />;
    }
  };

  const getChipColor = (): 'error' | 'warning' | 'info' | 'success' => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'error';
    }
  };

  return (
    <Box id={id} sx={{ mb: 2 }}>
      <Alert
        severity={type}
        action={
          onClose ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
              id={`${id}-close-btn`}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : undefined
        }
        sx={{
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
            flexWrap: 'wrap',
          },
        }}
      >
        <Chip
          id={`${id}-badge`}
          size="small"
          label={chipLabel || type.toUpperCase()}
          color={getChipColor()}
          variant="filled"
          icon={getIcon()}
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title && <strong>{title}: </strong>}
          {message}
        </Typography>
      </Alert>
    </Box>
  );
};
