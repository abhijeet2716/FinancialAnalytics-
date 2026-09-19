import api from './api';
import { DashboardSummary, DashboardTrend, CategoryBreakdown, ApiResponse } from '../types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data.data;
  },

  async getTrends(): Promise<DashboardTrend[]> {
    const response = await api.get<ApiResponse<DashboardTrend[]>>('/dashboard/trends');
    return response.data.data || [];
  },

  async getCategories(): Promise<CategoryBreakdown[]> {
    const response = await api.get<ApiResponse<CategoryBreakdown[]>>('/dashboard/categories');
    return response.data.data || [];
  },
};
