import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabManager.css';
import SideBar from './SideBar';

function TabManager({ children }) {
  const [tabs, setTabs] = useState([
    // each tab has an id title and the tab path and an active status
    { id: 'dashboard', title: 'Dashboard', path: '/', active: true }
  ]);
  // keeps track of the current active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current route
  useEffect(() => {
    // finds the current tab that matches that pathname and if its not active its set to active
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab && currentTab.id !== activeTab) {
      setActiveTab(currentTab.id);
      // .map updates the tab active state (rendering the correct tab content)
      setTabs(tabs.map(tab => ({
        ...tab,
        active: tab.id === currentTab.id
      })));
    }
  }, [location.pathname, tabs, activeTab]);

  // Function to add new tab (to be passed to SideBar)
  const addTab = (tabId, tabTitle, tabPath) => {
    const existingTab = tabs.find(tab => tab.id === tabId);
    // checks if the tab id already exits and activate it and navigates to its path if its doesnt exit its added to the list
    if (existingTab) {
      // Tab exists - just activate it
      setActiveTab(tabId);
      setTabs(tabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      })));
      navigate(tabPath);
    } else {
      // Add new tab if it doesnt exist
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
    
    // If we're closing the active tab, switch to dashboard its default tab doesnt close
    if (activeTab === tabId) {
      setActiveTab('dashboard');
      setTabs(updatedTabs.map(tab => ({
        ...tab,
        active: tab.id === 'dashboard'
      })));
      navigate('/');
    }
  };
// switching to the tab with that tab id and switches it to among the active tabs and goes to that path of the tab
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
      {/* allowing adding new tabs at the side bar */}
      <SideBar addTab={addTab} />
      <div className='main-content'>
        <div className='tabbed-interface'>
          <div className='tab-container'>
            {/* creating a container for each tab and uniquely identifing it */}
            {tabs.map(tab => (
              <div
                key={tab.id}
                // check if tab is active
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
          {/* clones the children(nested components) elements allows the components(children) to use the functions */}
          {React.cloneElement(children, { addTab, tabs, switchTab, closeTab })}
        </div>
      </div>
    </div>
  )
}

export default TabManager;