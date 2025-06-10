import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Users from './Components/Users';
import Products from './Components/Products';
import TabManager from './Components/TabManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <TabManager>
            <Dashboard />
          </TabManager>
        }/>
        <Route path="/users" element={
          <TabManager>
            <Users />
          </TabManager>
        }/>
        <Route path="/products" element={
          <TabManager>
            <Products />
          </TabManager>
        }/>
      </Routes>
    </Router>
  );
}

export default App;