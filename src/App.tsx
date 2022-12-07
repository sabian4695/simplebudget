import * as React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {useRecoilState, useRecoilValue} from "recoil";
import {themeAtom, themes, snackBarOpen, snackBarText, snackBarSeverity, authAtom} from "./recoil/globalItems";
import AppToolbar from './components/subcomponents/AppToolbar'
import Toolbar from '@mui/material/Toolbar';
import {Navigate, Outlet} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { redirect, useLocation } from "react-router-dom";
import {
  Link as RouterLink,
} from 'react-router-dom';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  let location = useLocation();
  const currentTheme = useRecoilValue(themeAtom);
  const auth = useRecoilValue(authAtom);
  const snackText = useRecoilValue(snackBarText);
  const snackSev = useRecoilValue(snackBarSeverity);
  const [snackOpen, setSnackOpen] = useRecoilState(snackBarOpen);
  const [actTheme, setTheme] = React.useState(themes.darkTheme);
  const [tabValue, setTabValue] = React.useState(location.pathname);
  React.useEffect(() => {
    if (currentTheme === 'dark') {
      setTheme(themes.darkTheme)
    } else if (currentTheme === 'light') {
      setTheme(themes.lightTheme)
    }
  }, [currentTheme]);
  if (auth === 'false') {
    return <Navigate to="/login"/>;
  }
  if (location.pathname === '/') {
    return <Navigate to="/budget"/>;
  }
  const snackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
  return (
      <>
        <ThemeProvider theme={actTheme}>
          <CssBaseline/>
          <Box sx={{
            display: 'flex',
            minHeight: window.innerHeight,
            bgcolor: (currentTheme === 'dark' ? 'grey.900' : 'grey.50') }}>
            <Box sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}><AppToolbar/></Box>
            <Box component="main"
                 sx={{ width:'100%', p: 2, mb:8, height:'100%'}}>
              <Toolbar/><Outlet/>
            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={5}>
              <BottomNavigation
                  showLabels
                  value={tabValue}
                  onChange={(event, newValue: string) => {
                    setTabValue(newValue);
                    redirect("/" + newValue)
                  }}
              >
                <BottomNavigationAction label="Budget" value='/budget' component={RouterLink} to="budget" icon={<DashboardIcon />} />
                <BottomNavigationAction label="Transactions" value='/transactions' component={RouterLink} to="transactions" icon={<PaidIcon />} />
                <BottomNavigationAction label="Analytics" value='/analytics' component={RouterLink} to="analytics" icon={<AssessmentIcon />} />
                <BottomNavigationAction label="Settings" value='/settings' component={RouterLink} to="settings" icon={<SettingsIcon />} />
              </BottomNavigation>
            </Paper>
          </Box>
            <Snackbar open={snackOpen} autoHideDuration={2000} onClose={snackClose} sx={{ mb: 8 }}>
              {/*@ts-ignore*/}
              <Alert onClose={snackClose} severity={snackSev} sx={{width: '100%'}}>
                {snackText}
              </Alert>
            </Snackbar>
        </ThemeProvider>
      </>
  );
}

export default App;