import React from 'react';
import SideBar from './SideBar';
// lets the user component add a new tab (create a new tab)
function Users({ addTab }) {
  return (
      <div className='users-container'>
        <h1>User Management</h1>
      </div>
  );
}
export default Users;