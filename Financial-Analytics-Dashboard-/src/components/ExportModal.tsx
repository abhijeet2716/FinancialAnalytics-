import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TransactionFilterParams } from '../types';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedColumns: string[]) => Promise<void>;
  currentFilters: TransactionFilterParams;
  totalMatchingRecords: number;
}

const AVAILABLE_COLUMNS = [
  { id: 'id', label: 'Transaction ID (ID)', defaultChecked: true },
  { id: 'date', label: 'Date & Time (Date)', defaultChecked: true },
  { id: 'amount', label: 'Amount (Amount)', defaultChecked: true },
  { id: 'category', label: 'Category (Revenue/Expense)', defaultChecked: true },
  { id: 'status', label: 'Status (Paid/Pending)', defaultChecked: true },
  { id: 'user_id', label: 'User ID (user_id)', defaultChecked: true },
  { id: 'user_profile', label: 'User Profile URL (user_profile)', defaultChecked: true },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onClose,
  onExport,
  currentFilters,
  totalMatchingRecords,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((col) => col.id)
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleToggleColumn = (id: string) => {
    setSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(AVAILABLE_COLUMNS.map((col) => col.id));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleConfirmExport = async () => {
    if (selectedColumns.length === 0) return;
    setIsExporting(true);
    try {
      await onExport(selectedColumns);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  // Determine active filter description
  const activeFilterDescriptions: string[] = [];
  if (currentFilters.search) activeFilterDescriptions.push(`Search: "${currentFilters.search}"`);
  if (currentFilters.category && currentFilters.category !== 'All') activeFilterDescriptions.push(`Category: ${currentFilters.category}`);
  if (currentFilters.status && currentFilters.status !== 'All') activeFilterDescriptions.push(`Status: ${currentFilters.status}`);
  if (currentFilters.user_id && currentFilters.user_id !== 'All') activeFilterDescriptions.push(`User: ${currentFilters.user_id}`);
  if (currentFilters.minAmount !== undefined) activeFilterDescriptions.push(`Min: $${currentFilters.minAmount}`);
  if (currentFilters.maxAmount !== undefined) activeFilterDescriptions.push(`Max: $${currentFilters.maxAmount}`);
  if (currentFilters.startDate) activeFilterDescriptions.push(`From: ${currentFilters.startDate}`);
  if (currentFilters.endDate) activeFilterDescriptions.push(`To: ${currentFilters.endDate}`);

  return (
    <Dialog
      id="csv-export-dialog"
      open={open}
      onClose={isExporting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileDownloadIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
            Configure CSV Export
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Select fields to include in the generated CSV report
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Filter awareness alert chip */}
        <Box
          sx={{
            p: 1.5,
            mb: 2.5,
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <FilterListIcon sx={{ color: '#2563eb', fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Export Scope: {totalMatchingRecords} transaction{totalMatchingRecords === 1 ? '' : 's'}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
            {activeFilterDescriptions.length > 0 ? (
              <span>Filtered by: {activeFilterDescriptions.join(' • ')}</span>
            ) : (
              'All transactions in dataset will be included.'
            )}
          </Typography>
        </Box>

        {/* Column Select Toggles */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
            Select Export Columns ({selectedColumns.length}/{AVAILABLE_COLUMNS.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={handleSelectAll}
              startIcon={<CheckBoxOutlinedIcon />}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Select All
            </Button>
            <Button
              size="small"
              onClick={handleDeselectAll}
              startIcon={<CheckBoxOutlineBlankOutlinedIcon />}
              sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#64748b' }}
            >
              Deselect All
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Checkbox list */}
        <FormGroup sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0.5 }}>
          {AVAILABLE_COLUMNS.map((col) => {
            const isChecked = selectedColumns.includes(col.id);
            return (
              <Box
                key={col.id}
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  border: isChecked ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                  backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`checkbox-export-${col.id}`}
                      size="small"
                      checked={isChecked}
                      onChange={() => handleToggleColumn(col.id)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: isChecked ? 600 : 400, color: '#1e293b' }}>
                      {col.label}
                    </Typography>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Box>
            );
          })}
        </FormGroup>

        {selectedColumns.length === 0 && (
          <Chip
            label="Please select at least one column to export."
            color="error"
            size="small"
            variant="outlined"
            sx={{ mt: 2, fontWeight: 600 }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button
          id="export-modal-cancel-btn"
          onClick={onClose}
          disabled={isExporting}
          sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}
        >
          Cancel
        </Button>
        <Button
          id="export-modal-download-btn"
          variant="contained"
          onClick={handleConfirmExport}
          disabled={selectedColumns.length === 0 || isExporting}
          startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <FileDownloadIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#0f172a',
            '&:hover': { backgroundColor: '#1e293b' },
            borderRadius: 2,
            px: 3,
          }}
        >
          {isExporting ? 'Generating CSV...' : 'Download CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
