import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Edit2, Trash2, ShieldAlert, CheckSquare, Square, 
  ArrowUpDown, ArrowUp, ArrowDown 
} from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  keyField = 'id',
  searchQuery = '',
  searchField = 'name',
  filters = {},
  onRowClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Apply sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Search Logic
  const filteredData = data.filter(item => {
    // 1. Search Query
    if (searchQuery && item[searchField]) {
      const fieldVal = String(item[searchField]).toLowerCase();
      if (!fieldVal.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    
    // 2. Additional Filters
    for (const key in filters) {
      if (filters[key]) {
        // e.g. status filter
        if (String(item[key]).toLowerCase() !== String(filters[key]).toLowerCase()) {
          return false;
        }
      }
    }
    return true;
  });

  // Sort logic
  const sortedData = [...filteredData];
  if (sortField) {
    sortedData.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA === undefined || valB === undefined) return 0;
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination Logic
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      const newSelected = new Set(paginatedData.map(item => item[keyField]));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ opacity: 0.4, marginLeft: '4px' }} />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={13} style={{ marginLeft: '4px', color: 'var(--color-primary)' }} />
      : <ArrowDown size={13} style={{ marginLeft: '4px', color: 'var(--color-primary)' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', padding: '0 var(--spacing-sm)' }}>
                <button 
                  onClick={handleSelectAll}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {selectedIds.size === paginatedData.length && paginatedData.length > 0
                    ? <CheckSquare size={16} className="text-primary" />
                    : <Square size={16} style={{ color: 'var(--color-text-muted)' }} />
                  }
                </button>
              </th>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => col.sortable && handleSort(col.field)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {col.header}
                    {col.sortable && getSortIcon(col.field)}
                  </div>
                </th>
              ))}
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} style={{ height: '140px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={32} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontWeight: 500 }}>No branches found</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Try adjusting your search query or status filter.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedIds.has(row[keyField]);
                return (
                  <tr key={row[keyField]} style={{ backgroundColor: isSelected ? '#f8fafc' : 'transparent' }}>
                    <td style={{ padding: '0 var(--spacing-sm)' }}>
                      <button 
                        onClick={() => handleSelectRow(row[keyField])}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      >
                        {isSelected 
                          ? <CheckSquare size={16} style={{ color: 'var(--color-primary)' }} />
                          : <Square size={16} style={{ color: 'var(--color-text-muted)' }} />
                        }
                      </button>
                    </td>
                    {columns.map((col, idx) => (
                      <td 
                        key={idx}
                        onClick={() => onRowClick && onRowClick(row)}
                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                      >
                        {col.render ? col.render(row[col.field], row) : row[col.field]}
                      </td>
                    ))}
                    <td className="col-actions">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          className="tooltip-container"
                          onClick={() => onEdit(row)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Edit2 size={15} className="text-secondary" />
                          <span className="tooltip-text">Edit</span>
                        </button>
                        <button 
                          className="tooltip-container"
                          onClick={() => onDelete(row)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={15} style={{ color: 'var(--color-error)' }} />
                          <span className="tooltip-text">Deactivate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          <div>
            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Show</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-control"
                style={{ height: '30px', padding: '0 8px', width: '70px' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-outline"
                style={{ height: '30px', padding: '0 8px' }}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  style={{ height: '30px', padding: '0 12px', minWidth: '30px' }}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
                style={{ height: '30px', padding: '0 8px' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
