import fs from 'fs';
import path from 'path';
import { Parser } from 'json2csv';
import { Transaction } from '../models/Transaction.js';
import { isDbConnected } from '../config/db.js';
import { ITransaction, ITransactionQueryFilters } from '../types.js';

// Cache transactions from transactions.json for offline/fallback mode
let cachedTransactions: ITransaction[] = [];

export const loadInitialTransactions = (): ITransaction[] => {
  if (cachedTransactions.length > 0) {
    return cachedTransactions;
  }

  try {
    const filePath = path.resolve(process.cwd(), 'transactions.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      cachedTransactions = JSON.parse(data);
      console.log(`[TransactionService] Loaded ${cachedTransactions.length} transactions from transactions.json`);
    }
  } catch (err: any) {
    console.error('[TransactionService] Failed to load transactions.json:', err.message);
  }

  return cachedTransactions;
};

// Initial load
loadInitialTransactions();

export const buildMongoQuery = (filters: ITransactionQueryFilters) => {
  const query: any = {};

  if (filters.category && filters.category !== 'All') {
    query.category = filters.category;
  }

  if (filters.status && filters.status !== 'All') {
    query.status = filters.status;
  }

  if (filters.user_id && filters.user_id !== 'All') {
    query.user_id = filters.user_id;
  }

  if (filters.minAmount !== undefined && filters.minAmount !== '') {
    const min = Number(filters.minAmount);
    if (!isNaN(min)) {
      query.amount = { ...(query.amount || {}), $gte: min };
    }
  }

  if (filters.maxAmount !== undefined && filters.maxAmount !== '') {
    const max = Number(filters.maxAmount);
    if (!isNaN(max)) {
      query.amount = { ...(query.amount || {}), $lte: max };
    }
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    if (!isNaN(start.getTime())) {
      query.date = { ...(query.date || {}), $gte: start };
    }
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    if (!isNaN(end.getTime())) {
      // Include the entire end date till 23:59:59.999
      end.setHours(23, 59, 59, 999);
      query.date = { ...(query.date || {}), $lte: end };
    }
  }

  if (filters.search && filters.search.trim() !== '') {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    const searchConditions: any[] = [
      { category: searchRegex },
      { status: searchRegex },
      { user_id: searchRegex },
    ];

    const numSearch = Number(filters.search.trim());
    if (!isNaN(numSearch)) {
      searchConditions.push({ id: numSearch });
      searchConditions.push({ amount: numSearch });
    }

    query.$or = searchConditions;
  }

  return query;
};

// Helper for filtering array in memory (mirrors MongoDB query exactly)
const filterInMemory = (items: ITransaction[], filters: ITransactionQueryFilters): ITransaction[] => {
  return items.filter((item) => {
    if (filters.category && filters.category !== 'All' && item.category !== filters.category) {
      return false;
    }

    if (filters.status && filters.status !== 'All' && item.status !== filters.status) {
      return false;
    }

    if (filters.user_id && filters.user_id !== 'All' && item.user_id !== filters.user_id) {
      return false;
    }

    if (filters.minAmount !== undefined && filters.minAmount !== '') {
      const min = Number(filters.minAmount);
      if (!isNaN(min) && item.amount < min) return false;
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== '') {
      const max = Number(filters.maxAmount);
      if (!isNaN(max) && item.amount > max) return false;
    }

    if (filters.startDate) {
      const itemDate = new Date(item.date).getTime();
      const start = new Date(filters.startDate).getTime();
      if (!isNaN(start) && itemDate < start) return false;
    }

    if (filters.endDate) {
      const itemDate = new Date(item.date).getTime();
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      if (!isNaN(end.getTime()) && itemDate > end.getTime()) return false;
    }

    if (filters.search && filters.search.trim() !== '') {
      const term = filters.search.trim().toLowerCase();
      const idMatch = String(item.id).includes(term);
      const categoryMatch = item.category.toLowerCase().includes(term);
      const statusMatch = item.status.toLowerCase().includes(term);
      const userMatch = item.user_id.toLowerCase().includes(term);
      const amountMatch = String(item.amount).includes(term);

      if (!idMatch && !categoryMatch && !statusMatch && !userMatch && !amountMatch) {
        return false;
      }
    }

    return true;
  });
};

export const getTransactions = async (filters: ITransactionQueryFilters) => {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Number(filters.limit) || 10);
  const skip = (page - 1) * limit;

  const sortBy = filters.sortBy || 'date';
  const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

  if (isDbConnected()) {
    const query = buildMongoQuery(filters);
    const total = await Transaction.countDocuments(query);
    const data = await Transaction.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // In-memory fallback
  let items = loadInitialTransactions();
  items = filterInMemory(items, filters);

  // Sorting
  items.sort((a: any, b: any) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'date') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return sortOrder === 1 ? -1 : 1;
    if (valA > valB) return sortOrder === 1 ? 1 : -1;
    return 0;
  });

  const total = items.length;
  const paginatedData = items.slice(skip, skip + limit);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getTransactionById = async (id: number) => {
  if (isDbConnected()) {
    return await Transaction.findOne({ id }).lean();
  }

  const items = loadInitialTransactions();
  return items.find((item) => item.id === id) || null;
};

export const getDashboardSummary = async () => {
  let allItems: ITransaction[] = [];

  if (isDbConnected()) {
    const mongoData = await Transaction.find({}).lean();
    allItems = mongoData as any;
  } else {
    allItems = loadInitialTransactions();
  }

  let totalRevenue = 0;
  let totalExpenses = 0;

  for (const item of allItems) {
    if (item.category === 'Revenue') {
      totalRevenue += item.amount;
    } else if (item.category === 'Expense') {
      totalExpenses += item.amount;
    }
  }

  const netBalance = totalRevenue - totalExpenses;
  const totalTransactions = allItems.length;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalTransactions,
    netBalance: Math.round(netBalance * 100) / 100,
  };
};

export const getDashboardTrends = async () => {
  let allItems: ITransaction[] = [];

  if (isDbConnected()) {
    const mongoData = await Transaction.find({}).lean();
    allItems = mongoData as any;
  } else {
    allItems = loadInitialTransactions();
  }

  // Month-by-month aggregation (Jan 2024 - Dec 2024)
  const monthOrder = [
    '2024-01', '2024-02', '2024-03', '2024-04',
    '2024-05', '2024-06', '2024-07', '2024-08',
    '2024-09', '2024-10', '2024-11', '2024-12'
  ];

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const trendsMap: { [key: string]: { revenue: number; expense: number; count: number } } = {};

  monthOrder.forEach((key) => {
    trendsMap[key] = { revenue: 0, expense: 0, count: 0 };
  });

  allItems.forEach((item) => {
    const dateObj = new Date(item.date);
    const yearMonth = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}`;
    if (trendsMap[yearMonth]) {
      if (item.category === 'Revenue') {
        trendsMap[yearMonth].revenue += item.amount;
      } else if (item.category === 'Expense') {
        trendsMap[yearMonth].expense += item.amount;
      }
      trendsMap[yearMonth].count += 1;
    }
  });

  const trends = monthOrder.map((key, index) => {
    const revenue = Math.round(trendsMap[key].revenue * 100) / 100;
    const expense = Math.round(trendsMap[key].expense * 100) / 100;
    const net = Math.round((revenue - expense) * 100) / 100;

    return {
      period: key,
      month: monthNames[index],
      revenue,
      expense,
      net,
      count: trendsMap[key].count,
    };
  });

  return trends;
};

export const getDashboardCategories = async () => {
  let allItems: ITransaction[] = [];

  if (isDbConnected()) {
    const mongoData = await Transaction.find({}).lean();
    allItems = mongoData as any;
  } else {
    allItems = loadInitialTransactions();
  }

  const categoryMap: { [cat: string]: { totalAmount: number; count: number } } = {};
  let totalOverallAmount = 0;

  allItems.forEach((item) => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { totalAmount: 0, count: 0 };
    }
    categoryMap[item.category].totalAmount += item.amount;
    categoryMap[item.category].count += 1;
    totalOverallAmount += item.amount;
  });

  const categories = Object.keys(categoryMap).map((name) => {
    const amount = Math.round(categoryMap[name].totalAmount * 100) / 100;
    const percentage = totalOverallAmount > 0 ? Math.round((amount / totalOverallAmount) * 1000) / 10 : 0;
    return {
      category: name,
      amount,
      count: categoryMap[name].count,
      percentage,
    };
  });

  return categories;
};

export const exportTransactionsCsv = async (filters: ITransactionQueryFilters, selectedColumns?: string[]): Promise<string> => {
  let items: ITransaction[] = [];

  if (isDbConnected()) {
    const query = buildMongoQuery(filters);
    const sortBy = filters.sortBy || 'id';
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
    items = (await Transaction.find(query).sort({ [sortBy]: sortOrder }).lean()) as any;
  } else {
    items = loadInitialTransactions();
    items = filterInMemory(items, filters);
    const sortBy = filters.sortBy || 'id';
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
    items.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === 1 ? -1 : 1;
      if (valA > valB) return sortOrder === 1 ? 1 : -1;
      return 0;
    });
  }

  // Define column mappings
  const allFieldDefinitions: { [key: string]: { label: string; value: string } } = {
    id: { label: 'ID', value: 'id' },
    date: { label: 'Date', value: 'date' },
    amount: { label: 'Amount', value: 'amount' },
    category: { label: 'Category', value: 'category' },
    status: { label: 'Status', value: 'status' },
    user_id: { label: 'User ID', value: 'user_id' },
    user_profile: { label: 'User Profile', value: 'user_profile' },
  };

  // Determine which fields to export
  let fieldsToExport: { label: string; value: string }[] = [];

  if (selectedColumns && selectedColumns.length > 0) {
    fieldsToExport = selectedColumns
      .map((col) => {
        const lowerKey = col.toLowerCase().trim().replace(/[\s-]/g, '_');
        return allFieldDefinitions[lowerKey] || allFieldDefinitions[col];
      })
      .filter(Boolean);
  }

  // Default to all fields if none selected
  if (fieldsToExport.length === 0) {
    fieldsToExport = Object.values(allFieldDefinitions);
  }

  const parser = new Parser({
    fields: fieldsToExport,
    quote: '"',
    escapedQuote: '""',
  });

  const csv = parser.parse(items);
  return csv;
};
