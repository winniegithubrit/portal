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
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  styled
} from '@mui/material';
import { Close, Edit, Delete, Add, Visibility } from '@mui/icons-material';

const PageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #faf0ff 100%)',
  padding: '3rem 1rem',
  marginLeft: '270px',
  width: 'calc(100% - 270px - 2rem)',
  maxWidth: 'none !important'
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase'
}));

const FormDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    minWidth: '600px'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold'
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

function LoanApplication() {
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOptions] = useState({
    loanTypes: ['Personal Loan', 'Business Loan', 'Mortgage', 'Auto Loan'],
    employmentStatuses: ['Employed', 'Self-Employed', 'Unemployed', 'Retired'],
    collateralTypes: ['Property', 'Vehicle', 'Equipment', 'Savings']
  });
  
  const [formData, setFormData] = useState({
    loanType: '',
    loanAmount: '',
    purpose: '',
    repaymentPeriod: '',
    employmentStatus: '',
    monthlyIncome: '',
    collateralType: '',
    applicantName: '',
    otherIncome: '',
    monthlyExpenses: '',
    collateral: '',
    collateralValue: ''
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchLoanApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/loanApplications');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLoanApplications(Array.isArray(data) ? data : data.loanApplications || []);
      } catch (err) {
        setError(err.message);
        setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchLoanApplications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const submissionData = {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        repaymentPeriod: Number(formData.repaymentPeriod),
        monthlyIncome: Number(formData.monthlyIncome),
        otherIncome: Number(formData.otherIncome || 0),
        monthlyExpenses: Number(formData.monthlyExpenses || 0),
        collateralValue: Number(formData.collateralValue || 0),
        status: 'Pending',
        applicationDate: new Date().toISOString()
      };

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:3001/loanApplications/${editingId}`
        : 'http://localhost:3001/loanApplications';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(editingId ? 'Failed to update application' : 'Failed to submit application');
      }

      const result = await response.json();
      
      if (editingId) {
        setLoanApplications(prev => prev.map(app => app.id === editingId ? result : app));
        setSnackbar({ open: true, message: 'Application updated successfully!', severity: 'success' });
      } else {
        setLoanApplications(prev => [...prev, result]);
        setSnackbar({ open: true, message: 'Application submitted successfully!', severity: 'success' });
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/loanApplications/${deletingId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      setLoanApplications(prev => prev.filter(app => app.id !== deletingId));
      setSnackbar({ open: true, message: 'Application deleted successfully!', severity: 'success' });
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    } finally {
      setLoading(false);
      setDeletingId(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleEdit = (application) => {
    setFormData({
      loanType: application.loanType,
      loanAmount: application.loanAmount.toString(),
      purpose: application.purpose,
      repaymentPeriod: application.repaymentPeriod.toString(),
      employmentStatus: application.employmentStatus,
      monthlyIncome: application.monthlyIncome.toString(),
      collateralType: application.collateralType || '',
      applicantName: application.applicantName || '',
      otherIncome: application.otherIncome?.toString() || '',
      monthlyExpenses: application.monthlyExpenses?.toString() || '',
      collateral: application.collateral || '',
      collateralValue: application.collateralValue?.toString() || ''
    });
    setEditingId(application.id);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      loanType: '',
      loanAmount: '',
      purpose: '',
      repaymentPeriod: '',
      employmentStatus: '',
      monthlyIncome: '',
      collateralType: '',
      applicantName: '',
      otherIncome: '',
      monthlyExpenses: '',
      collateral: '',
      collateralValue: ''
    });
    setEditingId(null);
    setOpenDialog(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'under review': return 'info';
      default: return 'default';
    }
  };

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Loan Applications
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          New Application
        </Button>
      </Box>

      {/* Application Form Dialog */}
      <FormDialog open={openDialog} onClose={resetForm}>
        <DialogTitle>
          {editingId ? 'Edit Loan Application' : 'New Loan Application'}
          <IconButton
            aria-label="close"
            onClick={resetForm}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Applicant Name"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Loan Type</InputLabel>
                  <Select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    label="Loan Type"
                  >
                    {dropdownOptions.loanTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loan Amount"
                  name="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Repayment Period (months)"
                  name="repaymentPeriod"
                  type="number"
                  value={formData.repaymentPeriod}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    label="Employment Status"
                  >
                    {dropdownOptions.employmentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Income"
                  name="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Other Income"
                  name="otherIncome"
                  type="number"
                  value={formData.otherIncome}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Expenses"
                  name="monthlyExpenses"
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Collateral Type</InputLabel>
                  <Select
                    name="collateralType"
                    value={formData.collateralType}
                    onChange={handleInputChange}
                    label="Collateral Type"
                  >
                    <MenuItem value="">None</MenuItem>
                    {dropdownOptions.collateralTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Collateral Description"
                  name="collateral"
                  value={formData.collateral}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Collateral Value"
                  name="collateralValue"
                  type="number"
                  value={formData.collateralValue}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (editingId ? 'Update' : 'Submit')}
            </Button>
          </DialogActions>
        </form>
      </FormDialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this loan application? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loan Applications Table */}
      {loading && !loanApplications.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : loanApplications.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" color="textSecondary">
            No loan applications found
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => setOpenDialog(true)}
          >
            Create New Application
          </Button>
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Application Date</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>Loan Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Repayment Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanApplications.map((application) => (
                <TableRow key={application.id || application.applicationId}>
                  <TableCell>{formatDate(application.applicationDate)}</TableCell>
                  <TableCell>{application.applicantName}</TableCell>
                  <TableCell>{application.loanType}</TableCell>
                  <TableCell>{formatCurrency(application.loanAmount)}</TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Typography variant="body2" noWrap>
                      {application.purpose}
                    </Typography>
                  </TableCell>
                  <TableCell>{application.repaymentPeriod} months</TableCell>
                  <TableCell>
                    <StatusChip 
                      label={application.status}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(application)}
                      color="primary"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setDeletingId(application.id || application.applicationId);
                        setOpenDeleteDialog(true);
                      }}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}

export default LoanApplication;