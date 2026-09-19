export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalTransactions: number;
  netBalance: number;
}

export interface DashboardTrend {
  period: string;
  month: string;
  revenue: number;
  expense: number;
  net: number;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface TransactionFilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string | number;
  maxAmount?: string | number;
  category?: string;
  status?: string;
  user_id?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}
