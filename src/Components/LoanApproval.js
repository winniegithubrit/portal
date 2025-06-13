import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Assignment,
  AccountBalance,
  Assessment,
  Send
} from '@mui/icons-material';

function LoanApprovals() {
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingLoan, setProcessingLoan] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [evaluationData, setEvaluationData] = useState({
    creditScore: '',
    officerNotes: '',
    recommendedAction: '',
    approvedAmount: '',
    interestRate: '',
    conditions: ''
  });

  useEffect(() => {
    const fetchLoanApplications = async () => {
      try {
        const response = await fetch('http://localhost:3001/loanApplications');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        let applications = [];
        if (Array.isArray(data)) {
          applications = data;
        } else if (data.loanApplications && Array.isArray(data.loanApplications)) {
          applications = data.loanApplications;
        }
        
        const pendingApplications = applications.filter(app => 
          app.status === 'Pending' || app.status === 'Under Review'
        );
        
        setLoanApplications(pendingApplications);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
      }
    };

    fetchLoanApplications();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'under review': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleOpenDialog = (loan) => {
    setCurrentLoan(loan);
    setEvaluationData({
      creditScore: loan.creditScore || '',
      officerNotes: loan.officerNotes || '',
      recommendedAction: '',
      approvedAmount: loan.loanAmount || '',
      interestRate: loan.interestRate || '',
      conditions: loan.conditions || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentLoan(null);
    setEvaluationData({
      creditScore: '',
      officerNotes: '',
      recommendedAction: '',
      approvedAmount: '',
      interestRate: '',
      conditions: ''
    });
  };

  const handleInputChange = (field, value) => {
    setEvaluationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApproveLoan = async () => {
    if (!currentLoan || !evaluationData.recommendedAction) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    setProcessingLoan(currentLoan.id);
    
    try {
      const updatedLoan = {
        ...currentLoan,
        status: evaluationData.recommendedAction === 'approve' ? 'Approved' : 'Rejected',
        creditScore: evaluationData.creditScore,
        officerNotes: evaluationData.officerNotes,
        approvedAmount: evaluationData.recommendedAction === 'approve' ? evaluationData.approvedAmount : 0,
        interestRate: evaluationData.interestRate,
        conditions: evaluationData.conditions,
        processedDate: new Date().toISOString(),
        processedBy: 'Loan Officer'
      };

      const response = await fetch(`http://localhost:3001/loanApplications/${currentLoan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLoan),
      });

      if (!response.ok) {
        throw new Error('Failed to update loan application');
      }

      setLoanApplications(prev => prev.filter(loan => loan.id !== currentLoan.id));
      
      setSnackbar({
        open: true,
        message: `Loan ${evaluationData.recommendedAction === 'approve' ? 'approved' : 'rejected'} successfully!`,
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error processing loan: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setProcessingLoan(null);
    }
  };

  const calculateNetIncome = (loan) => {
    return (loan.monthlyIncome + (loan.otherIncome || 0) - loan.monthlyExpenses);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #faf0ff 100%)',
        padding: '3rem 1rem',
        marginLeft: { xs: 0, md: '270px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #faf0ff 100%)',
        padding: '3rem 1rem',
        marginLeft: { xs: 0, md: '270px' }
      }}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #faf0ff 100%)',
      padding: '3rem 1rem',
      marginLeft: { xs: 0, md: '270px' },
      transition: 'margin 0.3s ease'
    }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          <AccountBalance sx={{ mr: 2, verticalAlign: 'middle' }} />
          Loan Approval Management
        </Typography>

        {loanApplications.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No pending loan applications found
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {loanApplications.map((loan) => (
              <Grid item xs={12} key={loan.id || loan.applicationId}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2">
                        {loan.applicationId || loan.id} - {loan.applicantName}
                      </Typography>
                      <Chip 
                        label={loan.status} 
                        color={getStatusColor(loan.status)}
                        icon={<Assignment />}
                      />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                          Applicant Overview
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Loan Type"
                              value={loan.loanType}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Purpose"
                              value={loan.purpose}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Loan Amount"
                              value={formatCurrency(loan.loanAmount)}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Repayment Period"
                              value={`${loan.repaymentPeriod} months`}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                          Financial Summary
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Monthly Income"
                              value={formatCurrency(loan.monthlyIncome)}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Other Income"
                              value={formatCurrency(loan.otherIncome || 0)}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Monthly Expenses"
                              value={formatCurrency(loan.monthlyExpenses)}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Net Disposable Income"
                              value={formatCurrency(calculateNetIncome(loan))}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              size="small"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: calculateNetIncome(loan) > 0 ? 'success.main' : 'error.main',
                                  fontWeight: 'bold'
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {(loan.collateral || loan.collateralType) && (
                        <>
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                              Collateral Information
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Collateral Type"
                                  value={loan.collateralType || 'N/A'}
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Collateral Description"
                                  value={loan.collateral || 'N/A'}
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Estimated Value"
                                  value={loan.collateralValue ? formatCurrency(loan.collateralValue) : 'N/A'}
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Assessment />}
                      onClick={() => handleOpenDialog(loan)}
                      disabled={processingLoan === (loan.id || loan.applicationId)}
                    >
                      Process Application
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6">
              Loan Evaluation - {currentLoan?.applicantName}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Credit Score"
                  type="number"
                  value={evaluationData.creditScore}
                  onChange={(e) => handleInputChange('creditScore', e.target.value)}
                  fullWidth
                  inputProps={{ min: 300, max: 850 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Interest Rate (%)"
                  type="number"
                  value={evaluationData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  fullWidth
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Approved Amount"
                  type="number"
                  value={evaluationData.approvedAmount}
                  onChange={(e) => handleInputChange('approvedAmount', e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: 'KES ',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Recommended Action</InputLabel>
                  <Select
                    value={evaluationData.recommendedAction}
                    onChange={(e) => handleInputChange('recommendedAction', e.target.value)}
                    label="Recommended Action"
                  >
                    <MenuItem value="approve">Approve</MenuItem>
                    <MenuItem value="reject">Reject</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Officer Notes"
                  multiline
                  rows={3}
                  value={evaluationData.officerNotes}
                  onChange={(e) => handleInputChange('officerNotes', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Terms & Conditions"
                  multiline
                  rows={3}
                  value={evaluationData.conditions}
                  onChange={(e) => handleInputChange('conditions', e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleApproveLoan}
              disabled={!evaluationData.recommendedAction || processingLoan}
              startIcon={
                evaluationData.recommendedAction === 'approve' ? <CheckCircle /> : 
                evaluationData.recommendedAction === 'reject' ? <Cancel /> : <Send />
              }
              color={evaluationData.recommendedAction === 'approve' ? 'success' : 'primary'}
            >
              {processingLoan ? <CircularProgress size={20} /> : 
               evaluationData.recommendedAction === 'approve' ? 'Approve Loan' : 
               evaluationData.recommendedAction === 'reject' ? 'Reject Loan' : 'Process'}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Container>
    </Box>
  );
}

export default LoanApprovals;