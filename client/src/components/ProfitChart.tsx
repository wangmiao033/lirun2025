import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Spin, Empty } from 'antd';

interface ProfitChartProps {
  data?: any[];
  loading?: boolean;
  type?: 'line' | 'bar' | 'pie';
}

const ProfitChart: React.FC<ProfitChartProps> = ({ 
  data = [], 
  loading = false, 
  type = 'line' 
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description="暂无数据" />
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatTooltipValue = (value: number, name: string) => {
    const unit = name.includes('利润率') ? '%' : '¥';
    return [`${unit}${value.toLocaleString()}`, name];
  };

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="totalProfit"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltipValue} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip formatter={formatTooltipValue} />
          <Bar dataKey="totalProfit" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // 默认折线图
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip formatter={formatTooltipValue} />
        <Line
          type="monotone"
          dataKey="totalRevenue"
          stroke="#8884d8"
          strokeWidth={2}
          name="总收入"
        />
        <Line
          type="monotone"
          dataKey="totalCost"
          stroke="#82ca9d"
          strokeWidth={2}
          name="总成本"
        />
        <Line
          type="monotone"
          dataKey="totalProfit"
          stroke="#ffc658"
          strokeWidth={2}
          name="总利润"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProfitChart;
