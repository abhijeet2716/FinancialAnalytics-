import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getTransactions,
  getTransactionById,
  exportTransactionsCsv,
} from '../services/transactionService.js';

export const listTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      category,
      status,
      user_id,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const result = await getTransactions({
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
      minAmount: minAmount as string,
      maxAmount: maxAmount as string,
      category: category as string,
      status: status as string,
      user_id: user_id as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: page as string,
      limit: limit as string,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to fetch transactions.',
    });
  }
};

export const getSingleTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid transaction ID provided.',
      });
      return;
    }

    const transaction = await getTransactionById(id);
    if (!transaction) {
      res.status(404).json({
        success: false,
        message: `Transaction with ID ${id} was not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to retrieve transaction.',
    });
  }
};

export const exportCsv = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      category,
      status,
      user_id,
      sortBy,
      sortOrder,
      columns,
    } = req.query;

    let selectedColumns: string[] | undefined;
    if (columns) {
      if (Array.isArray(columns)) {
        selectedColumns = columns.map(String);
      } else if (typeof columns === 'string') {
        selectedColumns = columns.split(',').map((c) => c.trim());
      }
    }

    const csvData = await exportTransactionsCsv(
      {
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        minAmount: minAmount as string,
        maxAmount: maxAmount as string,
        category: category as string,
        status: status as string,
        user_id: user_id as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      },
      selectedColumns
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.status(200).send(csvData);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to generate CSV export.',
    });
  }
};
