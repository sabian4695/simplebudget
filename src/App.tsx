import * as React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  themeAtom,
  themes,
  snackBarOpen,
  snackBarText,
  snackBarSeverity,
  currentUser,
  mainLoading
} from "./recoil/globalItems";
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
import AddBudget from "./components/modals/AddBudget";
import {
  supaBudgetsByCreator,
  supaBudgetsByID,
  supaCategories,
  supaSections,
  supaShared, supaTransactions
} from "./components/extras/api_functions";
import {budgets, categories, currentBudgetAndMonth, sections, transactions} from "./recoil/tableAtoms";
import {addBudget, selectBudget} from "./recoil/modalStatusAtoms";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import GrabBudgetData from "./components/extras/GrabBudgetData";
import SelectBudget from "./components/modals/SelectBudget";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function App() {
  let location = useLocation();
  const currentTheme = useRecoilValue(themeAtom);
  const { grabBudgetData } = GrabBudgetData();
  const snackText = useRecoilValue(snackBarText);
  const snackSev = useRecoilValue(snackBarSeverity);
  const [snackOpen, setSnackOpen] = useRecoilState(snackBarOpen);
  const [actTheme, setTheme] = React.useState(themes.darkTheme);
  const [tabValue, setTabValue] = React.useState(location.pathname);
  const [budgetsArray, setBudgetArray] = useRecoilState(budgets)
  const setSelectBudget = useSetRecoilState(selectBudget)
  const setSectionArray = useSetRecoilState(sections)
  const setCategoryArray = useSetRecoilState(categories)
  const setTransactionArray = useSetRecoilState(transactions)
  const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
  const setCreateNewBudget = useSetRecoilState(addBudget);
  const currentUserInfo = useRecoilValue(currentUser)
  const [loadingOpen, setLoadingOpen] = useRecoilState(mainLoading)
  React.useEffect(() => {
    supaRefresh()
  }, [])
  React.useEffect(() => {
    if (currentTheme === 'dark') {
      setTheme(themes.darkTheme)
    } else if (currentTheme === 'light') {
      setTheme(themes.lightTheme)
    }
  }, [currentTheme])
  if (localStorage.getItem('sb-psdmjjcvaxejxktqwdcm-auth-token') === null) {
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

  async function supaRefresh() {
    setLoadingOpen(true)
    let sharedBudgetIDs = await supaShared(currentUserInfo.recordID) //grab budgetIDs shared with me
    let myBudgets = await supaBudgetsByCreator(currentUserInfo.recordID) //grab MY budgets
    // @ts-ignore
    let sharedBudgets = await supaBudgetsByID(sharedBudgetIDs[0].budgetID) //grab budget info of ones shared with me
    let allBudgets = myBudgets?.concat(sharedBudgets.data) //combine array of budgets into one
    if (allBudgets && allBudgets.length > 0) {
      await setBudgetArray(allBudgets)
      if (allBudgets.length === 1) { //if there's one budget, set it as current
        await setCurrentBudget({
          budgetID: allBudgets[0].recordID,
          year: currentBudget.year,
          month: currentBudget.month,
        })
        localStorage.setItem('currentBudget', JSON.stringify({
          budgetID: allBudgets[0].recordID,
          year: currentBudget.year,
          month: currentBudget.month,
        }))
      } else { //if there's multiple, check if localStorage has one. If not, have user select budget
        if (localStorage.getItem('currentBudget') !== null) {
          // @ts-ignore
          setCurrentBudget(JSON.parse(localStorage.getItem('currentBudget')))
        } else {
          setSelectBudget(true)
        }
      }

      await grabBudgetData(currentBudget.budgetID)
    } else {
      setBudgetArray([])
      setSectionArray([])
      setCategoryArray([])
      setTransactionArray([])
      //@ts-ignore
      setCurrentBudget({})
      setCreateNewBudget(true)
      localStorage.removeItem('currentBudget')
    }
    setLoadingOpen(false)
  }
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
          <AddBudget/>
          <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 200 }}
              open={loadingOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <SelectBudget/>
        </ThemeProvider>
      </>
  );
}