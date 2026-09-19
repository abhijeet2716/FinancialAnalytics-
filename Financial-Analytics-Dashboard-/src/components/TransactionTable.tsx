import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  TablePagination,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Transaction, Pagination, TransactionFilterParams } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  pagination: Pagination;
  loading: boolean;
  filters: TransactionFilterParams;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  onSortChange: (field: string) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onOpenExportModal: () => void;
}

type SortableField = 'id' | 'date' | 'amount' | 'category' | 'status' | 'user_id';

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  pagination,
  loading,
  filters,
  searchTerm,
  onSearchChange,
  onSortChange,
  onPageChange,
  onLimitChange,
  onOpenExportModal,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoDate;
    }
  };

  const columns: { id: SortableField; label: string; align?: 'left' | 'right' | 'center' }[] = [
    { id: 'id', label: 'ID', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'category', label: 'Category', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'user_id', label: 'User & Profile', align: 'left' },
  ];

  return (
    <Card
      id="transactions-table-card"
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        backgroundColor: '#ffffff',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Top Controls: Search Bar & CSV Export Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}>
            <TextField
              id="transaction-search-input"
              size="small"
              fullWidth
              placeholder="Search by ID, Category, Status, User..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => onSearchChange('')}
                        edge="end"
                        id="clear-search-btn"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                },
              }}
            />
          </Box>

          <Button
            id="open-export-modal-btn"
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={onOpenExportModal}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#0f172a',
              '&:hover': { backgroundColor: '#1e293b' },
              borderRadius: 2,
              px: 2.5,
              py: 1,
            }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Transactions Material UI Table */}
        <TableContainer sx={{ border: '1px solid #f1f5f9', borderRadius: 2 }}>
          <Table id="transactions-data-table" size="medium">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align || 'left'}
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 1.5,
                    }}
                  >
                    <TableSortLabel
                      id={`sort-header-${col.id}`}
                      active={filters.sortBy === col.id}
                      direction={filters.sortBy === col.id ? filters.sortOrder || 'asc' : 'asc'}
                      onClick={() => onSortChange(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-row-${index}`}>
                    <TableCell><Skeleton width={40} /></TableCell>
                    <TableCell><Skeleton width={140} /></TableCell>
                    <TableCell align="right"><Skeleton width={80} /></TableCell>
                    <TableCell align="center"><Skeleton width={70} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center"><Skeleton width={70} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell><Skeleton width={120} /></TableCell>
                  </TableRow>
                ))
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
                      No transactions found.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Try clearing search criteria or modifying your active filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => {
                  const isRevenue = txn.category === 'Revenue';
                  const isPaid = txn.status === 'Paid';

                  return (
                    <TableRow
                      key={txn.id}
                      id={`txn-row-${txn.id}`}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* ID */}
                      <TableCell sx={{ fontWeight: 600, color: '#334155' }}>
                        #{txn.id}
                      </TableCell>

                      {/* Date */}
                      <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                        {formatDate(txn.date)}
                      </TableCell>

                      {/* Amount */}
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.925rem',
                          color: isRevenue ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {isRevenue ? '+' : '-'}{formatCurrency(txn.amount)}
                      </TableCell>

                      {/* Category Chip */}
                      <TableCell align="center">
                        <Chip
                          label={txn.category}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: isRevenue ? '#dcfce7' : '#fee2e2',
                            color: isRevenue ? '#15803d' : '#b91c1c',
                            border: `1px solid ${isRevenue ? '#86efac' : '#fca5a5'}`,
                          }}
                        />
                      </TableCell>

                      {/* Status Chip */}
                      <TableCell align="center">
                        <Chip
                          icon={
                            isPaid ? (
                              <CheckCircleIcon style={{ fontSize: 14, color: '#0369a1' }} />
                            ) : (
                              <HourglassEmptyIcon style={{ fontSize: 14, color: '#b45309' }} />
                            )
                          }
                          label={txn.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: isPaid ? '#e0f2fe' : '#fef3c7',
                            color: isPaid ? '#0369a1' : '#b45309',
                            border: `1px solid ${isPaid ? '#7dd3fc' : '#fde68a'}`,
                          }}
                        />
                      </TableCell>

                      {/* User Profile & ID */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={txn.user_profile}
                            alt={txn.user_id}
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: '0.75rem',
                              bgcolor: '#94a3b8',
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            {txn.user_id.slice(-3)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {txn.user_id}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          id="transactions-table-pagination"
          component="div"
          count={pagination.total}
          page={Math.max(0, pagination.page - 1)}
          rowsPerPage={pagination.limit}
          onPageChange={(_event, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(event) => onLimitChange(parseInt(event.target.value, 10))}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            borderTop: '1px solid #f1f5f9',
            mt: 1,
          }}
        />
      </CardContent>
    </Card>
  );
};
