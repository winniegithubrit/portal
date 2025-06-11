import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Person,
  Inventory,
  ShoppingCart,
  EmojiEvents,
  DirectionsRun,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  height: '100%',
}));

const GradientCard = styled(Card)(({ theme, gradient }) => ({
  borderRadius: 16,
  background: gradient,
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  minHeight: 200,
}));

const MetricCard = styled(Paper)(({ theme, darkMode }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  backgroundColor: darkMode ? '#2a2d3a' : '#ffffff',
  color: darkMode ? '#ffffff' : '#000000',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StatsContainer = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 16,
  padding: 24,
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
});

const MiniChart = ({ color, trend = 'up' }) => (
  <Box sx={{ width: 60, height: 20, mt: 1 }}>
    <svg width="60" height="20" viewBox="0 0 60 20">
      <path
        d={trend === 'up' ? "M0,15 Q15,10 30,12 T60,5" : "M0,5 Q15,8 30,6 T60,15"}
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </Box>
);

function Dashboard({ addTab, tabs, switchTab, closeTab }) {
  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      marginLeft: '250px', // Keep your sidebar logic
    }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
        Dashboard
      </Typography>

      {/* Top Hero Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Congratulations Card */}
        <Grid item xs={12} md={8}>
          <GradientCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <CardContent sx={{ p: 3 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={8}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Congratulations
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Fabiana Capmany !
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                    Best seller of the month You have done 57.6% more sales today.
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    Go now
                  </Button>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <EmojiEvents sx={{ fontSize: 60, opacity: 0.8 }} />
                  {/* Mini Chart */}
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {[8, 12, 6, 10, 14].map((height, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 4,
                            height: height,
                            backgroundColor: 'rgba(255,255,255,0.6)',
                            borderRadius: 1
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </GradientCard>
        </Grid>

        {/* Product Showcase Card */}
        <Grid item xs={12} md={4}>
          <GradientCard gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)">
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Chip 
                label="NEW" 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white'
                }} 
              />
              <Box sx={{ mt: 2 }}>
                <DirectionsRun sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Pegasus Running Shoes
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Buy now
                </Button>
              </Box>
            </CardContent>
          </GradientCard>
        </Grid>
      </Grid>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Product sold
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">8.2% last week</Typography>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              9,990
            </Typography>
            <MiniChart color="#4caf50" trend="up" />
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total balance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">86.6% last week</Typography>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              10,989
            </Typography>
            <MiniChart color="#ff9800" trend="down" />
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MetricCard darkMode>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Sales profit
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">73.9% last week</Typography>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
              11,988
            </Typography>
            <MiniChart color="#f44336" trend="up" />
          </MetricCard>
        </Grid>
      </Grid>

      {/* Bottom Row - Your Original Logic */}
      <Grid container spacing={3}>
        {/* Overview Card - Keeping your original structure */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4} textAlign="center">
                  <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mx: 'auto', mb: 1 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    980
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Users
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', mx: 'auto', mb: 1 }}>
                    <Inventory />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                    876
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Avatar sx={{ bgcolor: '#e8f5e8', color: '#388e3c', mx: 'auto', mb: 1 }}>
                    <ShoppingCart />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                    7865
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Activities Card - Keeping your original structure */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Activities
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1">Order no: 234</Typography>
                </Paper>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1">User name: Winnie Jomo</Typography>
                </Paper>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1">Product: Handbag</Typography>
                </Paper>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Statistics Card - Keeping your original structure */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Revenue this month:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>234,890 ksh</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">New Customers:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>49</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Pending Orders:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>9</Typography>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Performance Metrics - Keeping your original structure */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Performance Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Sales Target</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>75%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Customer Satisfaction</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>92%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={92} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Order Fulfillment</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>88%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={88} 
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;