import React, { useState } from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCartPlus,
  faUserTie, 
  faCalendarWeek, 
  faBars, 
  faTimes,
  faChevronDown,
  faChevronRight,
  faUser,
  faTable
} from '@fortawesome/free-solid-svg-icons';

function SideBar({ addTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleTabClick = (e, tabId, tabTitle, path) => {
    e.preventDefault();
    addTab(tabId, tabTitle, path);
  };

  const toggleUserMenu = (e) => {
    e.preventDefault();
    setUserMenuOpen(!userMenuOpen);
  };

  const handleUserSubMenu = (e, tabId, tabTitle, path) => {
    e.preventDefault();
    e.stopPropagation();
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
          
          {/* User Information with Dropdown */}
          <li className={`dropdown ${userMenuOpen ? 'open' : ''}`}>
            <Link 
              to="#" 
              onClick={toggleUserMenu}
              className="dropdown-toggle"
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faUserTie} size="xl" />
              ) : (
                <>
                  <span>User Information</span>
                  <FontAwesomeIcon 
                    icon={userMenuOpen ? faChevronDown : faChevronRight} 
                    className="dropdown-icon"
                  />
                </>
              )}
            </Link>
            
            {!collapsed && userMenuOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to="/user-personal-info"
                    onClick={(e) => handleUserSubMenu(e, 'user-personal-info', 'User Personal Info', '/user-personal-info')}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>User Personal Info</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/user-data"
                    onClick={(e) => handleUserSubMenu(e, 'user-data', 'User Data', '/user-data')}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={faTable} />
                    <span>User Data</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link 
              to="/finance" 
              onClick={(e) => handleTabClick(e, 'products', 'Financial Management', '/finance')}
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faCartPlus} size="xl" />
              ) : (
                <span>Finance</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;