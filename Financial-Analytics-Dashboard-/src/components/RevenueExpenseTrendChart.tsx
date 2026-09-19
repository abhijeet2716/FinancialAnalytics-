import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { DashboardTrend } from '../types';

interface RevenueExpenseTrendChartProps {
  trends: DashboardTrend[];
  loading: boolean;
}

export const RevenueExpenseTrendChart: React.FC<RevenueExpenseTrendChartProps> = ({
  trends,
  loading,
}) => {
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `$${(tickItem / 1000).toFixed(0)}k`;
    }
    return `$${tickItem}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenue = payload.find((p: any) => p.dataKey === 'revenue')?.value || 0;
      const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
      const net = revenue - expense;

      return (
        <Box
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
            {label} 2024
          </Typography>
          <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
            Revenue: ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600 }}>
            Expense: ${expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
          <Box sx={{ mt: 0.5, pt: 0.5, borderTop: '1px solid #f1f5f9' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: net >= 0 ? '#0d9488' : '#be123c',
              }}
            >
              Net: {net >= 0 ? '+' : ''}${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      id="revenue-expense-trend-chart-card"
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChartIcon sx={{ color: '#2563eb' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
              Revenue vs Expenses Trend
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
            Fiscal Year 2024 (Monthly Overview)
          </Typography>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 2 }} />
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
