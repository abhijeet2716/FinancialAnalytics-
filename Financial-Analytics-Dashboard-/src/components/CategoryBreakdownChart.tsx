import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import PieChartIcon from '@mui/icons-material/PieChart';
import { CategoryBreakdown } from '../types';

interface CategoryBreakdownChartProps {
  categories: CategoryBreakdown[];
  loading: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Revenue: '#16a34a',
  Expense: '#dc2626',
};

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categories,
  loading,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryBreakdown;
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {data.category}
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
            Total: {formatCurrency(data.amount)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {data.count} transactions ({data.percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      id="category-breakdown-chart-card"
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
            <PieChartIcon sx={{ color: '#2563eb' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
              Category Breakdown
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
            Distribution
          </Typography>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 2 }} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
            <Box sx={{ width: '100%', height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {categories.map((entry) => (
                      <Cell
                        key={`cell-${entry.category}`}
                        fill={CATEGORY_COLORS[entry.category] || '#3b82f6'}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Detailed Legend and Percentage Chips */}
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {categories.map((cat) => {
                const isRev = cat.category === 'Revenue';
                return (
                  <Box
                    key={cat.category}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: isRev ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${isRev ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: isRev ? '#16a34a' : '#dc2626',
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {cat.category}
                      </Typography>
                      <Chip
                        label={`${cat.percentage}%`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          color: isRev ? '#15803d' : '#b91c1c',
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {formatCurrency(cat.amount)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {cat.count} txns
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
