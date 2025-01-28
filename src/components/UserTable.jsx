import React from 'react';
import './UserTable.css';

const UserTable = ({
  users,
  onEdit,
  onDelete,
  currentPage,
  totalUsers,
  itemsPerPage,
  onPageChange,
  loading
}) => {
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      if (currentPage <= 4) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    } else {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <div className="user-info">
                  <div className="avatar">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}${user.lastName}`}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  </div>
                  <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
                </div>
              </td>
              <td className="user-email">{user.email}</td>
              <td>
                <span className="department-badge">{user.department}</span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onEdit(user)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            <p>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalUsers)} to{' '}
              {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} results
            </p>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                disabled={page === '...'}
                className={`pagination-button ${
                  page === currentPage ? 'active' : ''
                } ${page === '...' ? 'ellipsis' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;