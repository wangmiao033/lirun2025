import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Spin, Empty } from 'antd';

interface DepartmentStatsProps {
  data?: any[];
  loading?: boolean;
  type?: 'bar' | 'pie';
}

const DepartmentStats: React.FC<DepartmentStatsProps> = ({ 
  data = [], 
  loading = false, 
  type = 'bar' 
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatTooltipValue = (value: number, name: string) => {
    const unit = name.includes('利润率') ? '%' : '¥';
    return [`${unit}${value.toLocaleString()}`, name];
  };

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
            outerRadius={60}
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

  // 默认柱状图
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="_id" type="category" width={80} />
        <Tooltip formatter={formatTooltipValue} />
        <Bar dataKey="totalProfit" fill="#1890ff" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DepartmentStats;
