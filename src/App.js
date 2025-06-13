import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Dashboard from './Components/Dashboard';
import Users from './Components/Users';
import Finance from './Components/Finance';
import UserPersonalInfo from './Components/UserPersonalInfo';
import UserData from './Components/UserData';
import SavingsAccount from './Components/SavingsAccount'
import LoanApplication from './Components/LoanApplication'
import LoanApproval from './Components/LoanApproval'
import TabManager from './Components/TabManager';

function App() {
  return (
    <ThemeProvider theme={theme}>
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
        <Route path="/user-personal-info" element={
          <TabManager>
            <UserPersonalInfo />
          </TabManager>
        }/>
        <Route path="/user-data" element={
          <TabManager>
            <UserData />
          </TabManager>
        }/>
        <Route path="/finance" element={
          <TabManager>
            <Finance />
          </TabManager>
        }/>
        <Route path="/loan-application" element={
          <TabManager>
            <LoanApplication/>
          </TabManager>
        }
        />
        <Route path="/loan-approvals" element={
          <TabManager>
            <LoanApproval />
          </TabManager>
        }/>
        <Route path="/savings-account" element={
          <TabManager>
            <SavingsAccount />
          </TabManager>
        }/>
      </Routes>
    </Router>
    <CssBaseline />
  </ThemeProvider>
  );
}

export default App;