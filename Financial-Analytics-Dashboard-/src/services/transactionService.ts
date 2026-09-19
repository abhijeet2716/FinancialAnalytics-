import api from './api';
import { Transaction, TransactionFilterParams, ApiResponse, Pagination } from '../types';

export const transactionService = {
  async getTransactions(params: TransactionFilterParams): Promise<{ data: Transaction[]; pagination: Pagination }> {
    const cleanParams: Record<string, any> = {};

    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'All') {
        cleanParams[key] = val;
      }
    });

    const response = await api.get<ApiResponse<Transaction[]>>('/transactions', {
      params: cleanParams,
    });

    return {
      data: response.data.data || [],
      pagination: response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  },

  async getTransactionById(id: number): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data;
  },

  async downloadCsv(params: TransactionFilterParams, selectedColumns: string[]): Promise<void> {
    const cleanParams: Record<string, any> = {};

    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'All' && key !== 'page' && key !== 'limit') {
        cleanParams[key] = val;
      }
    });

    if (selectedColumns.length > 0) {
      cleanParams.columns = selectedColumns.join(',');
    }

    const response = await api.get('/transactions/export', {
      params: cleanParams,
      responseType: 'blob',
    });

    // Create a Blob URL and trigger direct browser download
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
