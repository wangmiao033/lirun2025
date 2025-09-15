import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

// 模拟测试数据
const mockProps = {
  title: '总收入',
  value: '¥1,000,000',
  description: '所有项目收入总和',
  icon: '💰',
  color: 'success'
};

describe('StatCard Component', () => {
  test('renders with required props', () => {
    render(<StatCard {...mockProps} />);
    
    expect(screen.getByText('总收入')).toBeInTheDocument();
    expect(screen.getByText('¥1,000,000')).toBeInTheDocument();
    expect(screen.getByText('所有项目收入总和')).toBeInTheDocument();
  });

  test('renders with loading state', () => {
    render(<StatCard {...mockProps} loading={true} />);
    
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  test('renders with trend information', () => {
    const propsWithTrend = {
      ...mockProps,
      trend: 'up',
      trendValue: '优秀'
    };
    
    render(<StatCard {...propsWithTrend} />);
    
    expect(screen.getByText('优秀')).toBeInTheDocument();
  });

  test('applies correct color class', () => {
    const { container } = render(<StatCard {...mockProps} />);
    const cardElement = container.firstChild;
    
    expect(cardElement).toHaveClass('stat-card');
    expect(cardElement).toHaveClass('success');
  });

  test('handles click events when onClick is provided', () => {
    const mockOnClick = jest.fn();
    const { container } = render(
      <StatCard {...mockProps} onClick={mockOnClick} />
    );
    
    const cardElement = container.firstChild;
    cardElement.click();
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
