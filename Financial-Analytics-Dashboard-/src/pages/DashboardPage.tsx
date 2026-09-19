import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header } from '../components/Header';
import { SummaryCards } from '../components/SummaryCards';
import { RevenueExpenseTrendChart } from '../components/RevenueExpenseTrendChart';
import { CategoryBreakdownChart } from '../components/CategoryBreakdownChart';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionTable } from '../components/TransactionTable';
import { ExportModal } from '../components/ExportModal';
import { AlertChips } from '../components/AlertChips';
import { dashboardService } from '../services/dashboardService';
import { transactionService } from '../services/transactionService';
import {
  DashboardSummary,
  DashboardTrend,
  CategoryBreakdown,
  Transaction,
  Pagination,
  TransactionFilterParams,
} from '../types';

export const DashboardPage: React.FC = () => {
  // Dashboard Analytics State
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<DashboardTrend[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TransactionFilterParams>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Modal & Error Handling States
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; text: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load Dashboard Analytics (Summary, Trends, Categories)
  const fetchDashboardAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const [summaryData, trendsData, categoriesData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getTrends(),
        dashboardService.getCategories(),
      ]);
      setSummary(summaryData);
      setTrends(trendsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setErrorMessage({
        title: 'Dashboard Analytics Error',
        text: err.response?.data?.message || err.message || 'Failed to load dashboard metrics.',
      });
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Load Transactions with active filters & sorting
  const fetchTransactions = useCallback(async (currentFilters: TransactionFilterParams) => {
    setTransactionsLoading(true);
    try {
      const result = await transactionService.getTransactions(currentFilters);
      setTransactions(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setErrorMessage({
        title: 'Transaction Listing Error',
        text: err.response?.data?.message || err.message || 'Failed to load transactions.',
      });
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchDashboardAnalytics();
  }, [fetchDashboardAnalytics]);

  useEffect(() => {
    fetchTransactions(filters);
  }, [fetchTransactions, filters]);

  // Debounced search handling
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm.trim() || undefined,
        page: 1, // Reset to page 1 on new search
      }));
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle Multi-Field Filter Application
  const handleApplyFilters = (newFilterValues: Partial<TransactionFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilterValues,
      page: 1, // Reset pagination to page 1 on filter change
    }));
  };

  // Handle Clear Filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  // Handle Sorting Column Change
  const handleSortChange = (field: string) => {
    setFilters((prev) => {
      const isAsc = prev.sortBy === field && prev.sortOrder === 'asc';
      return {
        ...prev,
        sortBy: field,
        sortOrder: isAsc ? 'desc' : 'asc',
      };
    });
  };

  // Handle Pagination Page Change
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Handle Rows Per Page Limit Change
  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  };

  // Handle CSV Export
  const handleExportCsv = async (selectedColumns: string[]) => {
    try {
      await transactionService.downloadCsv(filters, selectedColumns);
      setSuccessMessage('CSV report generated and downloaded successfully.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage({
        title: 'CSV Export Failed',
        text: err.response?.data?.message || err.message || 'Unable to download CSV report.',
      });
    }
  };

  return (
    <Box id="dashboard-layout" sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 3.5, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Error Alert Chip notification */}
        {errorMessage && (
          <AlertChips
            id="dashboard-error-alert-chip"
            type="error"
            title={errorMessage.title}
            message={errorMessage.text}
            chipLabel="ERROR"
            onClose={() => setErrorMessage(null)}
          />
        )}

        {/* Success Alert Chip notification */}
        {successMessage && (
          <AlertChips
            id="dashboard-success-alert-chip"
            type="success"
            title="Success"
            message={successMessage}
            chipLabel="EXPORTED"
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {/* Section 1: Financial Summary Cards */}
        <SummaryCards summary={summary} loading={analyticsLoading} />

        {/* Section 2: Visualizations (Trends & Category Breakdown) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          <Box>
            <RevenueExpenseTrendChart trends={trends} loading={analyticsLoading} />
          </Box>
          <Box>
            <CategoryBreakdownChart categories={categories} loading={analyticsLoading} />
          </Box>
        </Box>

        {/* Section 3: Advanced Filtering Panel */}
        <TransactionFilters
          currentFilters={filters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          onInvalidInput={(msg) =>
            setErrorMessage({ title: 'Invalid Filter Input', text: msg })
          }
        />

        {/* Section 4: Transactions Table with Search, Sort & Pagination */}
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          loading={transactionsLoading}
          filters={filters}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onOpenExportModal={() => setExportModalOpen(true)}
        />

        {/* CSV Export Configuration Modal */}
        <ExportModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onExport={handleExportCsv}
          currentFilters={filters}
          totalMatchingRecords={pagination.total}
        />
      </Container>
    </Box>
  );
};
