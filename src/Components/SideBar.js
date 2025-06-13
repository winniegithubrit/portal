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
  faTable,
  faPiggyBank,
  faFileInvoiceDollar,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

function SideBar({ addTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [financeMenuOpen, setFinanceMenuOpen] = useState(false)
  // handles click event for the tab in the sidebar(receives tabid, title and e as parameters)
  const handleTabClick = (e, tabId, tabTitle, path) => {
    e.preventDefault();
    addTab(tabId, tabTitle, path);
  };
// show the submenus for the 
  const toggleUserMenu = (e) => {
    e.preventDefault();
    setUserMenuOpen(!userMenuOpen);
  };
// enables expanding and collapsing the menu
  const toggleFinanceMenu =(e) => {
    e.preventDefault()
    setFinanceMenuOpen(!financeMenuOpen)
  }

  const handleUserSubMenu = (e, tabId, tabTitle, path) => {
    e.preventDefault();
    e.stopPropagation();
    addTab(tabId, tabTitle, path);
  };
  // manages specific functions in the sub menu
  const handleFinanceSubMenu = (e, tabId, tabTitle, path) =>{
    e.preventDefault()
    e.stopPropagation()
    addTab(tabId, tabTitle,path)
  }
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
          {/* contols visiblity of the dropdown menu */}
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
            {/* only visible when the user menu is open  */}
            {!collapsed && userMenuOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to="/user-personal-info"
                    // toggles user dropdown visibility shows or hides the menu options
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
          {/* when true it opens when false it doesnt */}
          <li className={`dropdown ${financeMenuOpen ? 'open' : ''}`}>
            <Link 
              to="#" 
              onClick={toggleFinanceMenu}
              className="dropdown-toggle"
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faCartPlus} size="xl" />
              ) : (
                <>
                  <span>Finance</span>
                  <FontAwesomeIcon 
                    icon={financeMenuOpen ? faChevronDown : faChevronRight} 
                    className="dropdown-icon"
                  />
                </>
              )}
            </Link>
            
            {!collapsed && financeMenuOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to="/savings-account"
                    onClick={(e) => handleFinanceSubMenu(e, 'savings-account', 'Savings Account', '/savings-account')}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={faPiggyBank} />
                    <span>Savings Account</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/loan-application"
                    onClick={(e) => handleFinanceSubMenu(e, 'loan-application', 'Loan Application', '/loan-application')}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={faFileInvoiceDollar} />
                    <span>Loan Application</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/loan-approvals"
                    onClick={(e) => handleFinanceSubMenu(e, 'loan-approvals', 'Loan Approvals', '/loan-approvals')}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Loan Approvals</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;