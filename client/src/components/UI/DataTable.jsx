import React, { useState, useMemo } from 'react';
import './DataTable.css';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = true,
  pageSize = 10,
  searchable = false,
  sortable = true,
  selectable = false,
  onRowClick,
  onSelectionChange,
  emptyMessage = '暂无数据',
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());

  // 搜索过滤
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      columns.some(column => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // 排序
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 分页
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // 处理排序
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 处理行选择
  const handleRowSelect = (rowId, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    onSelectionChange && onSelectionChange(Array.from(newSelected));
  };

  // 处理全选
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = paginatedData.map((_, index) => index);
      setSelectedRows(new Set(allIds));
      onSelectionChange && onSelectionChange(allIds);
    } else {
      setSelectedRows(new Set());
      onSelectionChange && onSelectionChange([]);
    }
  };

  // 渲染单元格内容
  const renderCellContent = (value, column) => {
    if (column.render) {
      return column.render(value);
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 0
      }).format(value || 0);
    }
    
    if (column.type === 'number') {
      return new Intl.NumberFormat('zh-CN').format(value || 0);
    }
    
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString('zh-CN') : '-';
    }
    
    if (column.type === 'datetime') {
      return value ? new Date(value).toLocaleString('zh-CN') : '-';
    }
    
    if (column.type === 'percentage') {
      return `${(value || 0).toFixed(2)}%`;
    }
    
    return value || '-';
  };

  if (loading) {
    return (
      <div className={`data-table loading ${className}`}>
        <div className="loading-spinner"></div>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      {/* 搜索栏 */}
      {searchable && (
        <div className="table-search">
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* 表格 */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {selectable && (
                <th className="select-column">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={sortable ? 'sortable' : ''}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="th-content">
                    <span>{column.title}</span>
                    {sortable && sortConfig.key === column.key && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="empty-cell">
                  <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-title">{emptyMessage}</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={selectedRows.has(index) ? 'selected' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {selectable && (
                    <td className="select-column">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(index, e.target.checked);
                        }}
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className={column.className || ''}>
                      {renderCellContent(row[column.key], column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            显示 {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, sortedData.length)} 
            条，共 {sortedData.length} 条
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              上一页
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
