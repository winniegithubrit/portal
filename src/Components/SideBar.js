import React, { useState } from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCartPlus,
  faUserTie, 
  faCalendarWeek, 
  faBars, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

function SideBar({ addTab }) {
  const [collapsed, setCollapsed] = useState(false);
  
  const handleTabClick = (e, tabId, tabTitle, path) => {
    e.preventDefault();
    addTab(tabId, tabTitle, path);
  };

  return (
    <div className='major-container'>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{collapsed ? 'AP' : 'Admin Panel'}</h2>
          <button
            className='toggle-btn'
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon icon={collapsed ? faBars : faTimes} size="lg" />
          </button>
        </div>
        <ul className='sidebar-menu'>
          <li>
            <Link 
              to="/" 
              onClick={(e) => handleTabClick(e, 'dashboard', 'Dashboard', '/')}
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faCalendarWeek} size="xl" />
              ) : (
                <span>Dashboard</span>
              )}
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              onClick={(e) => handleTabClick(e, 'users', 'User Management', '/users')}
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faUserTie} size="xl" />
              ) : (
                <span>User Information</span>
              )}
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              onClick={(e) => handleTabClick(e, 'products', 'Product Management', '/products')}
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faCartPlus} size="xl" />
              ) : (
                <span>Products</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;