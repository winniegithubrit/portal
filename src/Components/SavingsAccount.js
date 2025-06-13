import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
// CREATES a custom styled version of MUI
import { styled } from '@mui/material/styles';
// icons
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Styled container with custom css
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #faf0ff 100%)',
  padding: '3rem 1rem',
  marginLeft: '260px'
}));
// styles the table container
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiTableCell-head': {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));
// adds consistent styling to status indicators
const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  minWidth: '80px'
}));
// enlarges action btns on hover
const ActionButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.2s ease-in-out'
  }
}));

function SavingsAccount() {
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetches data from the db.json file
  useEffect(() => {
    const fetchSavingsAccounts = async () => {
      try {
        const response = await fetch('http://localhost:3001/savingsAccounts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        let accounts = [];
        if (Array.isArray(data)) {
          accounts = data;
          // If the response is an object and it has a property named savingsAccounts that is an array
        } else if (data.savingsAccounts && Array.isArray(data.savingsAccounts)) {
          accounts = data.savingsAccounts;
        } else if (data.accounts && Array.isArray(data.accounts)) {
          accounts = data.accounts;
        } else {
          console.warn('No valid savings accounts array found in response');
          accounts = [];
        }
        // updates the react state with the final accounts array
        setSavingsAccounts(accounts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSavingsAccounts();
  }, []);
// function for money values
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'KES 0.00';
    // its an Api (Intl.NumberFormat) that returnd ksh in localized currency format
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };
// returns N/A if no date is provided
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // converts the date into a format
    return new Date(dateString).toLocaleDateString('en-GB');
  };
// handles null and undefined statuses
// and maps the statuses into their MUI colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };
// for the edit btn
  const handleEditClick = (account) => {
    // stores the account in state ro refer back
    setSelectedAccount(account);
    // Preloads the edit form with the account's current info
    setEditFormData({ ...account });
    // opens the edit dialog
    setEditDialogOpen(true);
  };
// the eye to view the dialog box
  const handleViewClick = (account) => {
    setSelectedAccount(account);
    setViewDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/savingsAccounts/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        // Update the local state to get the edited values
        setSavingsAccounts(prev => 
          prev.map(account => 
            account.id === editFormData.id ? editFormData : account
          )
        );
        setEditDialogOpen(false);
        setSelectedAccount(null);
        setEditFormData({});
      } else {
        console.error('Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
// closes the dialog box
  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setViewDialogOpen(false);
    setSelectedAccount(null);
    setEditFormData({});
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading savings accounts...
            </Typography>
          </Box>
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        {/* MUI alert showing an error message */}
        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="h6">Error: {error}</Typography>
        </Alert>
      </StyledContainer>
    );
  }

  if (!Array.isArray(savingsAccounts) || savingsAccounts.length === 0) {
    return (
      // displays the title with syling
      <StyledContainer>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          <AccountBalanceIcon sx={{ mr: 2, fontSize: 'inherit', color: 'primary.main' }} />
          Savings Account Management
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" color="textSecondary">
            No savings accounts found
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        <AccountBalanceIcon sx={{ mr: 2, fontSize: 'inherit', color: 'primary.main' }} />
        Savings Account Management
      </Typography>
      
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/*column headers  */}
              <TableCell>Account Number</TableCell>
              <TableCell>Account Holder</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Current Balance</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Opened</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savingsAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {account.accountNumber || 'N/A'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    {account.fullName || 'N/A'}
                  </Box>
                </TableCell>
                <TableCell>{account.phoneNumber || 'N/A'}</TableCell>
                <TableCell>{account.accountType || 'N/A'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {formatCurrency(account.currentBalance)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${account.interestRate || 0}%`} 
                    color="info" 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <StatusChip 
                    label={account.accountStatus || 'Unknown'}
                    color={getStatusColor(account.accountStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(account.dateOpened)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    {/* buttons to perform the operation */}
                    <ActionButton 
                      color="info" 
                      onClick={() => handleViewClick(account)}
                    >
                      <VisibilityIcon />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Edit Account">
                    <ActionButton 
                      color="primary" 
                      onClick={() => handleEditClick(account)}
                    >
                      <EditIcon />
                    </ActionButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Edit Dialog  box*/}
      <Dialog open={editDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Edit Savings Account
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={editFormData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editFormData.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Type"
                value={editFormData.accountType || ''}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Balance"
                type="number"
                value={editFormData.currentBalance || ''}
                onChange={(e) => handleInputChange('currentBalance', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interest Rate (%)"
                type="number"
                value={editFormData.interestRate || ''}
                onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Account Status</InputLabel>
                <Select
                  value={editFormData.accountStatus || ''}
                  label="Account Status"
                  onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Balance"
                type="number"
                value={editFormData.minimumBalance || ''}
                onChange={(e) => handleInputChange('minimumBalance', parseFloat(e.target.value) || 0)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            <VisibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Account Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Account Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedAccount.accountNumber || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography variant="body1">{selectedAccount.fullName || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">National ID</Typography>
                <Typography variant="body1">{selectedAccount.nationalId || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1">{selectedAccount.phoneNumber || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedAccount.email || 'N/A'}</Typography>
              </Grid>
              {/* responsiveness 12 columns 6 columns half the width */}
              <Grid item xs={12} md={6}>
                {/* style text style and text color */}
                <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                <Typography variant="body1">{selectedAccount.accountType || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Current Balance</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {formatCurrency(selectedAccount.currentBalance)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Interest Rate</Typography>
                <Typography variant="body1">{selectedAccount.interestRate || 0}%</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Minimum Balance</Typography>
                <Typography variant="body1">{formatCurrency(selectedAccount.minimumBalance)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Account Status</Typography>
                <StatusChip 
                  label={selectedAccount.accountStatus || 'Unknown'}
                  color={getStatusColor(selectedAccount.accountStatus)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Date Opened</Typography>
                <Typography variant="body1">{formatDate(selectedAccount.dateOpened)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Last Deposit</Typography>
                <Typography variant="body1" sx={{ color: 'success.main' }}>
                  {formatCurrency(selectedAccount.lastDepositAmount)} 
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(selectedAccount.lastDepositDate)}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}

export default SavingsAccount;