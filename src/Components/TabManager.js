// TabManager.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabManager.css';
import SideBar from './SideBar';

function TabManager({ children }) {
  const [tabs, setTabs] = useState([
    { id: 'dashboard', title: 'Dashboard', path: '/', active: true }
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current route
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab && currentTab.id !== activeTab) {
      setActiveTab(currentTab.id);
      setTabs(tabs.map(tab => ({
        ...tab,
        active: tab.id === currentTab.id
      })));
    }
  }, [location.pathname, tabs, activeTab]);

  // Function to add new tab (will be passed to SideBar)
  const addTab = (tabId, tabTitle, tabPath) => {
    const existingTab = tabs.find(tab => tab.id === tabId);
    
    if (existingTab) {
      // Tab exists - just activate it
      setActiveTab(tabId);
      setTabs(tabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      })));
      navigate(tabPath);
    } else {
      // Add new tab
      const newTabs = tabs.map(tab => ({ ...tab, active: false }));
      newTabs.push({
        id: tabId,
        title: tabTitle,
        path: tabPath,
        active: true
      });
      setTabs(newTabs);
      setActiveTab(tabId);
      navigate(tabPath);
    }
  };
// Preventing  triggering the tab switch
  const closeTab = (tabId, e) => {
    e.stopPropagation(); 
    // Don't allow closing dashboard tab
    if (tabId === 'dashboard') return; 
    
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    
    // If we're closing the active tab, switch to dashboard
    if (activeTab === tabId) {
      setActiveTab('dashboard');
      setTabs(updatedTabs.map(tab => ({
        ...tab,
        active: tab.id === 'dashboard'
      })));
      navigate('/');
    }
  };

  const switchTab = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      setTabs(tabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      })));
      navigate(tab.path);
    }
  };

    return (
    <div className='admin-container'>
      <SideBar addTab={addTab} />
      <div className='main-content'>
        <div className='tabbed-interface'>
          <div className='tab-container'>
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`tab ${tab.active ? 'active' : ''}`}
                onClick={() => switchTab(tab.id)}
              >
                <span className='tab-title'>{tab.title}</span>
                {tab.id !== 'dashboard' && (
                  <span
                    className='tab-close'
                    onClick={(e) => closeTab(tab.id, e)}
                  >
                    ×
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='content-container'>
          {React.cloneElement(children, { addTab, tabs, switchTab, closeTab })}
        </div>
      </div>
    </div>
  )
}

export default TabManager;