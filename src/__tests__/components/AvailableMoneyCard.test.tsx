import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvailableMoneyCard from '../../components/current/AvailableMoneyCard';
import type { CurrentAccount, PaycheckInfo, UpcomingPayment } from '../../types/current';

// Mock data
const mockAccounts: CurrentAccount[] = [
  {
    id: 'acc1',
    name: 'Main Checking',
    type: 'checking',
    balance: 2847.50,
    availableBalance: 2847.50,
    currency: 'NOK',
    lastUpdated: '2024-01-15T14:30:00Z',
    status: 'active'
  }
];

const mockPaycheckInfo: PaycheckInfo = {
  nextPaycheckDate: '2024-01-31',
  daysUntilPaycheck: 16,
  expectedAmount: 52000,
  isEstimated: false
};

const mockUpcomingPayments: UpcomingPayment[] = [
  {
    id: 'pay1',
    description: 'Rent Payment',
    amount: -12000,
    dueDate: '2024-01-20',
    category: 'Housing',
    status: 'scheduled',
    isRecurring: true,
    accountId: 'acc1',
    priority: 'high'
  }
];

describe('AvailableMoneyCard', () => {
  const defaultProps = {
    accounts: mockAccounts,
    totalAvailable: 19017.50,
    netLeftover: -8608,
    paycheckInfo: mockPaycheckInfo,
    upcomingPayments: mockUpcomingPayments,
  };

  it('renders without crashing', () => {
    render(<AvailableMoneyCard {...defaultProps} />);
    expect(screen.getByText('Available Balance (in NOK)')).toBeInTheDocument();
  });

  it('displays the correct balance amount', () => {
    render(<AvailableMoneyCard {...defaultProps} />);
    expect(screen.getByText('10,410')).toBeInTheDocument(); // totalAvailable + upcomingPayments
  });

  it('shows days until paycheck', () => {
    render(<AvailableMoneyCard {...defaultProps} />);
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('days')).toBeInTheDocument();
  });

  it('calls onViewDetails when clicked', () => {
    const mockOnViewDetails = jest.fn();
    render(<AvailableMoneyCard {...defaultProps} onViewDetails={mockOnViewDetails} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it('shows appropriate status for different balance levels', () => {
    // Test with high balance (should show "Strong")
    const highBalanceProps = {
      ...defaultProps,
      totalAvailable: 100000,
      netLeftover: 50000,
    };
    
    const { rerender } = render(<AvailableMoneyCard {...highBalanceProps} />);
    expect(screen.getByText('💪 Strong')).toBeInTheDocument();
    
    // Test with low balance (should show "Critical")
    const lowBalanceProps = {
      ...defaultProps,
      totalAvailable: 500,
      netLeftover: -1000,
    };
    
    rerender(<AvailableMoneyCard {...lowBalanceProps} />);
    expect(screen.getByText('🚨 Critical')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<AvailableMoneyCard {...defaultProps} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});