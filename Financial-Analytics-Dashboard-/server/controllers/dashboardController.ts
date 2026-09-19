import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getDashboardSummary,
  getDashboardTrends,
  getDashboardCategories,
} from '../services/transactionService.js';

export const getSummary = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const summary = await getDashboardSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve dashboard summary.',
    });
  }
};

export const getTrends = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const trends = await getDashboardTrends();
    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve financial trends.',
    });
  }
};

export const getCategories = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const categories = await getDashboardCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve category analytics.',
    });
  }
};
