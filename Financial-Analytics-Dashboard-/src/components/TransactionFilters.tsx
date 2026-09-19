import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CheckIcon from '@mui/icons-material/Check';
import { TransactionFilterParams } from '../types';

interface TransactionFiltersProps {
  currentFilters: TransactionFilterParams;
  onApplyFilters: (filters: Partial<TransactionFilterParams>) => void;
  onClearFilters: () => void;
  onInvalidInput?: (msg: string) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  currentFilters,
  onApplyFilters,
  onClearFilters,
  onInvalidInput,
}) => {
  const [startDate, setStartDate] = useState(currentFilters.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters.endDate || '');
  const [minAmount, setMinAmount] = useState(
    currentFilters.minAmount !== undefined ? String(currentFilters.minAmount) : ''
  );
  const [maxAmount, setMaxAmount] = useState(
    currentFilters.maxAmount !== undefined ? String(currentFilters.maxAmount) : ''
  );
  const [category, setCategory] = useState(currentFilters.category || 'All');
  const [status, setStatus] = useState(currentFilters.status || 'All');
  const [userId, setUserId] = useState(currentFilters.user_id || 'All');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate min and max amount
    if (minAmount && maxAmount && Number(minAmount) > Number(maxAmount)) {
      if (onInvalidInput) {
        onInvalidInput('Minimum amount cannot be greater than maximum amount.');
      }
      return;
    }

    // Validate start and end dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      if (onInvalidInput) {
        onInvalidInput('Start date cannot be after end date.');
      }
      return;
    }

    onApplyFilters({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minAmount: minAmount !== '' ? Number(minAmount) : undefined,
      maxAmount: maxAmount !== '' ? Number(maxAmount) : undefined,
      category: category !== 'All' ? category : undefined,
      status: status !== 'All' ? status : undefined,
      user_id: userId !== 'All' ? userId : undefined,
    });
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setCategory('All');
    setStatus('All');
    setUserId('All');
    onClearFilters();
  };

  return (
    <Card
      id="transaction-filters-panel"
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterAltIcon sx={{ color: '#2563eb', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Advanced Transaction Filters
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleApply}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {/* Start Date */}
            <Box>
              <TextField
                id="filter-start-date"
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            {/* End Date */}
            <Box>
              <TextField
                id="filter-end-date"
                label="End Date"
                type="date"
                size="small"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            {/* Min Amount */}
            <Box>
              <TextField
                id="filter-min-amount"
                label="Min Amount ($)"
                type="number"
                size="small"
                fullWidth
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              />
            </Box>

            {/* Max Amount */}
            <Box>
              <TextField
                id="filter-max-amount"
                label="Max Amount ($)"
                type="number"
                size="small"
                fullWidth
                placeholder="10000.00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              />
            </Box>

            {/* Category Dropdown */}
            <Box>
              <TextField
                id="filter-category-select"
                select
                label="Category"
                size="small"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Revenue">Revenue</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>
            </Box>

            {/* Status Dropdown */}
            <Box>
              <TextField
                id="filter-status-select"
                select
                label="Status"
                size="small"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            </Box>

            {/* User Dropdown */}
            <Box>
              <TextField
                id="filter-user-select"
                select
                label="User"
                size="small"
                fullWidth
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <MenuItem value="All">All Users</MenuItem>
                <MenuItem value="user_001">user_001</MenuItem>
                <MenuItem value="user_002">user_002</MenuItem>
                <MenuItem value="user_003">user_003</MenuItem>
                <MenuItem value="user_004">user_004</MenuItem>
              </TextField>
            </Box>

            {/* Actions: Apply and Clear */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                id="apply-filters-btn"
                type="submit"
                variant="contained"
                size="medium"
                startIcon={<CheckIcon />}
                sx={{
                  flexGrow: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#2563eb',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                  borderRadius: 2,
                }}
              >
                Apply
              </Button>
              <Button
                id="clear-filters-btn"
                type="button"
                variant="outlined"
                size="medium"
                onClick={handleClear}
                startIcon={<FilterAltOffIcon />}
                sx={{
                  flexGrow: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
