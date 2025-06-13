import React, { useState, useEffect, useMemo } from 'react';
import './UserData.css';

function UserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageInputValue, setPageInputValue] = useState('1');

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    // ensures that when the component reloads it is reset to one
    setCurrentPage(1);
    setPageInputValue('1');
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
// sorts according to that column (sorting orders in both directions by clicking on the column headers )
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
    setPageInputValue('1');
  };
  const processedUsers = useMemo(() => {
    const filtered = users.filter(user =>
      // checking if its a case-insesitive match
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // using sort method to organise filtered results
    return [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      // if strings convert to lowercase
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      // determining the sort order (if true returns 1)
      if (sortOrder === 'asc') {
        // if a value is greater that b value 1 is returned swapping them and vice versa
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [users, searchTerm, sortBy, sortOrder]);
  const totalItems = processedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // finds where the current page starts in the array
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // creates a new array from processed users to appaer on the current page
  const currentUsers = processedUsers.slice(startIndex, endIndex);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };
// changing the current page when clicked
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInputValue(page.toString());
    }
  };
// updates the page input value state when the user eneters the number manually in the input box
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };
// submits input page number
  const handlePageInputSubmit = (e) => {
    // Prevents default form submission behavior
    e.preventDefault();
    // checks the validity of the number inpited and sets it as the current page
    const page = parseInt(pageInputValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };
// changes items displayed per page(5,10,20)
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setPageInputValue('1');
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      // removes the user from the list
      setUsers(users.filter(user => user.id !== userId));
      // calculates the new total number of users after deletion
      const newTotalItems = totalItems - 1;
      // no of pages
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
        setPageInputValue(newTotalPages.toString());
      }
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  // if (loading) return <div className="loading">Loading users...</div>;
  // if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-data">
      <div className="user-data-header">
        <h2>User Data</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <div className="pagination-controls top">
        <div className="pagination-info">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} users
          </span>
        </div>
        <div className="items-per-page">
          <label>
            Show:
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            per page
          </label>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                No {sortBy === 'id' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortBy === 'name' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortBy === 'email' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
               <th onClick={() => handleSort('phone')} className="sortable">
                Phone Number {sortBy === 'phone' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
               <th onClick={() => handleSort('dateOfBirth')} className="sortable">
                DOB {sortBy === 'dateOfBirth' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
               <th onClick={() => handleSort('gender')} className="sortable">
                Gender {sortBy === 'gender' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
               <th onClick={() => handleSort('city')} className="sortable">
                City {sortBy === 'city' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
               <th onClick={() => handleSort('department')} className="sortable">
                Department {sortBy === 'department' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortBy === 'status' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.dateOfBirth}</td>
                  <td>{user.gender}</td>
                  <td>{user.city}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`status ${user.status?.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="delete-btn" 
                        title="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-navigation">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              <i className="fas fa-angle-left"></i>
            </button>
            <div className="page-numbers">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              <i className="fas fa-angle-right"></i>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </div>
          <div className="quick-jump">
            <form onSubmit={handlePageInputSubmit}>
              <label>
                Go to page:
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  className="page-input"
                />
              </label>
              <button type="submit" className="jump-btn">Go</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-footer">
        <p>Total Users: {totalItems} | Page {currentPage} of {totalPages}</p>
      </div>
    </div>
  );
}

export default UserData;