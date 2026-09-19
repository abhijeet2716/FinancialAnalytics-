import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { DashboardSummary } from '../types';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const cards = [
    {
      id: 'card-total-revenue',
      title: 'Total Revenue',
      value: summary ? formatCurrency(summary.totalRevenue) : '$0.00',
      description: 'Incoming company revenues',
      icon: <TrendingUpIcon sx={{ color: '#16a34a', fontSize: 28 }} />,
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
      textColor: '#15803d',
    },
    {
      id: 'card-total-expenses',
      title: 'Total Expenses',
      value: summary ? formatCurrency(summary.totalExpenses) : '$0.00',
      description: 'Outgoing company expenditures',
      icon: <TrendingDownIcon sx={{ color: '#dc2626', fontSize: 28 }} />,
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      textColor: '#b91c1c',
    },
    {
      id: 'card-total-transactions',
      title: 'Total Transactions',
      value: summary ? summary.totalTransactions.toLocaleString() : '0',
      description: 'Recorded transaction volume',
      icon: <ReceiptLongIcon sx={{ color: '#2563eb', fontSize: 28 }} />,
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      textColor: '#1d4ed8',
    },
    {
      id: 'card-net-balance',
      title: 'Net Balance',
      value: summary ? formatCurrency(summary.netBalance) : '$0.00',
      description: 'Revenue minus Expenses',
      icon: <AccountBalanceIcon sx={{ color: summary && summary.netBalance >= 0 ? '#0d9488' : '#e11d48', fontSize: 28 }} />,
      bgColor: summary && summary.netBalance >= 0 ? '#f0fdfa' : '#fff1f2',
      borderColor: summary && summary.netBalance >= 0 ? '#99f6e4' : '#fecdd3',
      textColor: summary && summary.netBalance >= 0 ? '#0f766e' : '#be123c',
    },
  ];

  return (
    <Box
      id="summary-cards-grid"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2.5,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          elevation={0}
          sx={{
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            backgroundColor: '#ffffff',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                {card.title}
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: card.bgColor,
                  border: `1px solid ${card.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>

            {loading ? (
              <>
                <Skeleton variant="text" width="70%" height={40} />
                <Skeleton variant="text" width="90%" height={20} />
              </>
            ) : (
              <>
                <Typography
                  id={`${card.id}-value`}
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}
                >
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {card.description}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
