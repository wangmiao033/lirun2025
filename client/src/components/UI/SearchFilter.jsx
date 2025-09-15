import React, { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({
  onSearch,
  onFilter,
  filters = [],
  placeholder = '搜索...',
  showAdvanced = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch && onSearch(value);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilter && onFilter(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    onFilter && onFilter({});
    onSearch && onSearch('');
  };

  const hasActiveFilters = Object.keys(activeFilters).some(key => 
    activeFilters[key] !== '' && activeFilters[key] !== null && activeFilters[key] !== undefined
  );

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="filter-select"
          >
            <option value="">{filter.placeholder || '请选择'}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="filter-input"
            placeholder={filter.placeholder}
          />
        );
      
      case 'daterange':
        return (
          <div className="date-range">
            <input
              type="date"
              value={activeFilters[`${filter.key}_start`] || ''}
              onChange={(e) => handleFilterChange(`${filter.key}_start`, e.target.value)}
              className="filter-input"
              placeholder="开始日期"
            />
            <span className="date-separator">至</span>
            <input
              type="date"
              value={activeFilters[`${filter.key}_end`] || ''}
              onChange={(e) => handleFilterChange(`${filter.key}_end`, e.target.value)}
              className="filter-input"
              placeholder="结束日期"
            />
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="filter-input"
            placeholder={filter.placeholder}
            min={filter.min}
            max={filter.max}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="filter-input"
            placeholder={filter.placeholder}
          />
        );
    }
  };

  return (
    <div className={`search-filter ${className}`}>
      {/* 主要搜索栏 */}
      <div className="search-main">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="clear-search"
              title="清除搜索"
            >
              ✕
            </button>
          )}
        </div>
        
        {showAdvanced && filters.length > 0 && (
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`advanced-toggle ${showAdvancedFilters ? 'active' : ''}`}
          >
            <span>高级筛选</span>
            <span className="toggle-icon">
              {showAdvancedFilters ? '▲' : '▼'}
            </span>
          </button>
        )}
      </div>

      {/* 高级筛选 */}
      {showAdvancedFilters && filters.length > 0 && (
        <div className="advanced-filters">
          <div className="filters-grid">
            {filters.map(filter => (
              <div key={filter.key} className="filter-item">
                <label className="filter-label">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
          
          <div className="filter-actions">
            <button
              onClick={clearFilters}
              className="btn btn-secondary clear-filters"
              disabled={!hasActiveFilters && !searchTerm}
            >
              清除所有筛选
            </button>
          </div>
        </div>
      )}

      {/* 活跃筛选标签 */}
      {hasActiveFilters && (
        <div className="active-filters">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            const filter = filters.find(f => f.key === key);
            const displayValue = filter?.options?.find(opt => opt.value === value)?.label || value;
            
            return (
              <span key={key} className="filter-tag">
                <span className="tag-label">{filter?.label || key}:</span>
                <span className="tag-value">{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="tag-remove"
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
