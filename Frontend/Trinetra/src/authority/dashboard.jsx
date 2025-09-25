import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Badge,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Traffic as TrafficIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  TrendingUp,
  Warning,
  CheckCircle,
  Info,
  ChevronRight
} from '@mui/icons-material';
import CameraSearch from './components/Camera';  
import DensityDashboard from './components/DensityDashboard'; 
import Traffic from './components/Traffic'; 
import PalmDetectionComponent from './components/PalmDetectionComponent';
import BookingList from "./components/QueueManagement";

// --- Extracted original dashboard view ---
const DashboardOverview = () => {
  const theme = useTheme();

  const StatsCard = ({ title, value, trend, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{
            backgroundColor: `${color}15`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center'
          }}>
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main, mr: 0.5 }} />
            <Typography variant="body2" color="success.main">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, status, icon }) => (
    <Card sx={{ cursor: 'pointer', transition: 'all 0.2s' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            backgroundColor: theme.palette.primary.main + '15',
            borderRadius: 2,
            p: 1,
            mr: 2
          }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <ChevronRight sx={{ color: 'text.secondary' }} />
        </Box>
        <Chip
          label={status}
          size="small"
          color={status === 'Active' ? 'success' : status === 'Warning' ? 'warning' : 'default'}
          variant="outlined"
        />
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, Administrator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with Somnath Temple today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Participants"
            value="2.1M"
            trend="+12% from last update"
            icon={<PeopleIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />}
            color={theme.palette.primary.main}
            subtitle="Registered attendees"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Security Alerts"
            value="23"
            trend="+5% today"
            icon={<SecurityIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />}
            color={theme.palette.warning.main}
            subtitle="Active monitoring"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Traffic Flow"
            value="87%"
            trend="+3% efficiency"
            icon={<TrafficIcon sx={{ color: theme.palette.success.main, fontSize: 28 }} />}
            color={theme.palette.success.main}
            subtitle="Optimal routing"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="System Health"
            value="99.2%"
            trend="All systems operational"
            icon={<CheckCircle sx={{ color: theme.palette.success.main, fontSize: 28 }} />}
            color={theme.palette.success.main}
            subtitle="Uptime status"
          />
        </Grid>
      </Grid>

      {/* Quick Actions & Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <QuickActionCard
                  title="Feature 1 Console"
                  description="Manage and monitor primary operations"
                  status="Active"
                  icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickActionCard
                  title="Feature 2 Control"
                  description="Security and access management"
                  status="Active"
                  icon={<SecurityIcon sx={{ color: theme.palette.primary.main }} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickActionCard
                  title="Feature 3 Analytics"
                  description="Real-time data and insights"
                  status="Warning"
                  icon={<AssessmentIcon sx={{ color: theme.palette.primary.main }} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickActionCard
                  title="Feature 4 Reports"
                  description="Generate comprehensive reports"
                  status="Inactive"
                  icon={<TrendingUp sx={{ color: theme.palette.primary.main }} />}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              System Status
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Server Load</Typography>
                <Typography variant="body2" fontWeight="600">68%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={68} sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Database Usage</Typography>
                <Typography variant="body2" fontWeight="600">45%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={45}
                sx={{ height: 6, borderRadius: 3 }}
                color="success"
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Network Traffic</Typography>
                <Typography variant="body2" fontWeight="600">82%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={82}
                sx={{ height: 6, borderRadius: 3 }}
                color="warning"
              />
            </Box>
          </Paper>

          {/* Recent Alerts */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Recent Alerts
            </Typography>
            <Box>
              {[
                { type: 'info', message: 'System backup completed successfully', time: '2 min ago' },
                { type: 'warning', message: 'High traffic detected in Zone A', time: '15 min ago' },
                { type: 'success', message: 'All security checkpoints operational', time: '1 hour ago' }
              ].map((alert, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: index < 2 ? `1px solid ${theme.palette.grey[200]}` : 'none' }}>
                  <Box sx={{ mr: 2 }}>
                    {alert.type === 'info' && <Info sx={{ color: theme.palette.info.main, fontSize: 20 }} />}
                    {alert.type === 'warning' && <Warning sx={{ color: theme.palette.warning.main, fontSize: 20 }} />}
                    {alert.type === 'success' && <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 20 }} />}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

const dashboardTheme = createTheme({
  palette: {
    primary: { main: '#2F80ED' },        // Blue shade instead of orange
    secondary: { main: '#0288D1' },      // Keeping secondary blue
    background: {
      default: '#121212',                 // Dark black background
      paper: '#1E1E1E'                    // Slightly lighter dark for cards/papers
    },
    success: { main: '#2A9D8F' },        // Keep as is (teal)
    warning: { main: '#F2C94C' },        // Soft yellow for warnings replacing original orange-ish
    error: { main: '#EB5757' },          // Slightly softer red for errors
    text: {
      primary: '#E1E1E1',                // Light gray text on dark background
      secondary: '#A0A0A0',              // Medium gray secondary text
      light: '#FFFFFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#2A2A2A',
      200: '#3A3A3A',
      300: '#4A4A4A'
    }
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.75rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 500, fontSize: '1.25rem' },
    h5: { fontWeight: 500, fontSize: '1.1rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body1: { fontFamily: `'Roboto', sans-serif`, fontWeight: 400 },
    body2: { fontFamily: `'Roboto', sans-serif`, fontWeight: 400, fontSize: '0.875rem' },
    button: { fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(47, 128, 237, 0.4)',  // subtle blue glow on hover
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.9), 0 1px 2px rgba(47, 128, 237, 0.4)',
          border: '1px solid rgba(47, 128, 237, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(47, 128, 237, 0.7)',
            transform: 'translateY(-2px)'
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 16px 16px 0',
          border: 'none',
          backgroundColor: '#121212',
          boxShadow: '0 0 20px rgba(47, 128, 237, 0.6)'
        },
      },
    },
  },
});


const drawerWidth = 280;

const menuItems = [
  { id: 'dashboard', text: 'Dashboard Overview', icon: <DashboardIcon /> },
  { id: 'cameraSearch', text: 'Camera Search', icon: <PeopleIcon /> },
  { id: 'DensityDashboard', text: 'Density Analyser', icon: <AssessmentIcon /> },
  { id: 'feature3Analytics', text: 'Route Control', icon: <TrafficIcon /> },
  { id: 'feature4SOS', text: 'SOS Alerts', icon: <Warning /> },
  { id: 'booking', text: 'Queue Management', icon: <Warning /> },
];

const viewComponents = {
  dashboard: <DashboardOverview />,
  cameraSearch: <CameraSearch />,
  DensityDashboard: <DensityDashboard />,
  feature3Analytics: <Traffic />,
  feature4SOS: <PalmDetectionComponent />,
  booking: <BookingList/>
};


const MahakumbhDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (id) => {
    setActiveView(id);
    setMobileOpen(false); // Close drawer on mobile after clicking
  };

  const currentViewTitle = menuItems.find(item => item.id === activeView)?.text;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
        <Typography variant="h3" fontWeight="bold" color="primary.main">
          Sarthi Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Event Management Portal
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <List sx={{ '& .MuiListItemButton-root': { borderRadius: 2, mb: 1 } }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                sx={{
                  backgroundColor: item.id === activeView ? theme.palette.primary.main + '15' : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '10'
                  }
                }}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <ListItemIcon sx={{ color: item.id === activeView ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: item.id === activeView ? 600 : 400,
                      color: item.id === activeView ? 'primary.main' : 'text.primary'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: 2, borderTop: `1px solid white` }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon style={{color:"white"}}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon style={{color:"white"}}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={dashboardTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              {currentViewTitle}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" sx={{ color: 'text.primary' }}>
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box style={{border: "2px dotted white",display: "flex", alignItems:"center", borderRadius: 50,padding:6 }}>
              <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main' ,mr:1}}>
                A
              </Avatar>
              Administrator
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content (now dynamic) */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: 'background.default',
            minHeight: '100vh'
          }}
        >
          <Toolbar />
          {viewComponents[activeView]}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MahakumbhDashboard;
