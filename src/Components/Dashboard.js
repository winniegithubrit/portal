import React from 'react'
import './Dashboard.css'
import SideBar from './SideBar'

function Dashboard({addTab,tabs, switchTab, closeTab}) {
  return (
    <div className='dashboard-container'>
        <h1 className='dashboard-title'>Dashboard</h1>
        <div className='dashboard-grid'>
          <div className='row'>
            <div className='card card-1'>
                <h3>Overview</h3>
                <div className='overview-grid'>
                    <div>
                    <div className='overview-number'>
                        980
                    </div>
                    <div>Users</div>
                    </div>
                    <div>
                        <div className='overview-number'>876</div>
                        <div>Products</div>
                    </div>
                    <div>
                        <div className='overview-number'>7865</div>
                        <div>Orders</div>
                    </div>
                </div>
            </div>
            <div className='card card-2'>
                <h3>Activities</h3>
                <div className='activity-list'>
                    <div className='activity-item'>
                        <span>Order no: 234</span>
                    </div>
                    <div className='activity-item'>
                        <span>User name: Winnie Jomo</span>
                    </div>
                    <div className='activity-item'>
                        <span>Product: Handbag</span>
                    </div>
                </div>
            </div>
            </div>
            <div className='row'>
            <div className='card card-3'>
                <h3>Statistics</h3>
                <div className='stats-list'>
                    <div>
                        <span>Revenue this month:</span>
                        <strong>234,890 ksh</strong>
                    </div>
                    <div>
                        <span>New Customers:</span>
                        <strong>49</strong>
                    </div>
                    <div>
                        <span>Pending Orders</span>
                        <strong>9</strong>
                    </div>
                </div>
            </div>
              <div className="card card-4">
                <h3>Performance Metrics</h3>
                <div className="metric">
                  <div className="metric-label">
                    <span>Sales Target</span><span>75%</span>
                  </div>
                  <div className="progress-bar bg-blue" style={{ width: '75%' }}></div>
                </div>
                <div className="metric">
                  <div className="metric-label">
                    <span>Customer Satisfaction</span><span>92%</span>
                  </div>
                  <div className="progress-bar bg-green" style={{ width: '92%' }}></div>
                </div>
                <div className="metric">
                  <div className="metric-label">
                    <span>Order Fulfillment</span><span>88%</span>
                  </div>
                  <div className="progress-bar bg-yellow" style={{ width: '88%' }}></div>
                </div>
              </div>
          </div>
        </div>
    </div>
  )
}

export default Dashboard