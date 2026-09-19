export interface ITransaction {
  id: number;
  date: string | Date;
  amount: number;
  category: 'Revenue' | 'Expense' | string;
  status: 'Paid' | 'Pending' | string;
  user_id: string;
  user_profile: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export interface ITransactionQueryFilters {
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
  page?: string | number;
  limit?: string | number;
}
