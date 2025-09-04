import * as React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import AddIcon from "@mui/icons-material/Add";
import Fab from '@mui/material/Fab';
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
  supaShared,
} from "./components/extras/api_functions";
import {budgets, categories, currentBudgetAndMonth, sections, transactions} from "./recoil/tableAtoms";
import {addBudget, addTransaction, selectBudget} from "./recoil/modalStatusAtoms";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import GrabBudgetData from "./components/extras/GrabBudgetData";
import SelectBudget from "./components/modals/SelectBudget";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AddTransaction from "./components/modals/AddTransaction";
import Badge from '@mui/material/Badge';
import AreYouSure from "./components/subcomponents/AreYouSure";
import EditTransaction from "./components/modals/EditTransaction";

const fabStyle = {
  position: 'fixed',
  bottom: 75,
  right: 16,
};

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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const snackSev = useRecoilValue(snackBarSeverity);
  const [snackOpen, setSnackOpen] = useRecoilState(snackBarOpen);
  const [actTheme, setTheme] = React.useState(themes.darkTheme);
  const [tabValue, setTabValue] = React.useState(location.pathname);
  const setBudgetArray = useSetRecoilState(budgets)
  const setAddNewTransaction = useSetRecoilState(addTransaction)
  const setSelectBudget = useSetRecoilState(selectBudget)
  const setSectionArray = useSetRecoilState(sections)
  const setCategoryArray = useSetRecoilState(categories)
  const [transactionArray, setTransactionArray] = useRecoilState(transactions)
  const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
  const setCreateNewBudget = useSetRecoilState(addBudget);
  const currentUserInfo = useRecoilValue(currentUser)
  const [unCategorized, setUncategorized] = React.useState(transactionArray.filter((x: any) => x.categoryID === null).length)
  const [loadingOpen, setLoadingOpen] = useRecoilState(mainLoading)
  const [addToHomePU, setAddToHomePU] = React.useState(false)

  // Detects if device is on iOS 
  // const isIos = () => {
  //   const userAgent = window.navigator.userAgent.toLowerCase();
  //   return /iphone|ipad|ipod/.test( userAgent );
  // }
  // // Detects if device is in standalone mode
  // const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  // Checks if should display install popup notification:
  //if (isIos() && !isInStandaloneMode()) {
    //setAddToHomePU(true);
  //}

  const addToHomeClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {return}
    setAddToHomePU(false);
  };

  React.useEffect(() => {
    setUncategorized(transactionArray.filter((x: any) => x.categoryID === null).length)
  }, [transactionArray])

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

  if (localStorage.getItem('sb-psdmjjcvaxejxktqwdcm-auth-token') === null) {return <Navigate to="/login"/>}

  if (location.pathname === '/') {return <Navigate to="/budget"/>}
  
  const snackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {return}
    setSnackOpen(false);
  };

  async function grabAllBudgets() {
    let myBudgets = await supaBudgetsByCreator(currentUserInfo.recordID)
    let foundBudgets = myBudgets
    let sharedBudgetIDs = await supaShared(currentUserInfo.recordID)
    if (sharedBudgetIDs && sharedBudgetIDs.length > 0) {
      let sharedBudgets = await supaBudgetsByID(sharedBudgetIDs.map(x => x.budgetID))
      //@ts-ignore
      foundBudgets = myBudgets.concat(sharedBudgets.data)
    }
    return foundBudgets
  }

  async function setBudget(allBudgets: any[] | null) {
    if (allBudgets) {
      if (allBudgets.length > 0) {
        await setBudgetArray(allBudgets)
        if (allBudgets.length === 1) {
          let setBudget = {
            budgetID: allBudgets[0].recordID,
            year: currentBudget.year,
            month: currentBudget.month,
          }
          await setCurrentBudget(setBudget)
          localStorage.setItem('currentBudget', JSON.stringify(setBudget))
        } else if(allBudgets.length > 1) { //if there's multiple, check if localStorage budget exists in the array
          let posCurrent = localStorage.getItem('currentBudget')
          if(posCurrent !== null) {
            if(allBudgets.find(x => x.recordID === JSON.parse(posCurrent || '{}').budgetID)) {
              let setBudget = {
                budgetID: JSON.parse(localStorage.getItem('currentBudget') || '{}').budgetID,
                year: currentBudget.year,
                month: currentBudget.month,
              }
              setCurrentBudget(setBudget)
            }
          } //if there's nothing in localstorage, open the selector for the user to choose
          else {
            setSelectBudget(true)
          }
        }
        await grabBudgetData(currentBudget.budgetID, currentBudget.year, currentBudget.month)
      } else if(allBudgets.length === 0) {
        setBudgetArray([])
        setSectionArray([])
        setCategoryArray([])
        setTransactionArray([])
        //@ts-ignore
        setCurrentBudget({})
        setCreateNewBudget(true)
        localStorage.removeItem('currentBudget')
      }
    }
  }

  async function supaRefresh() {
    setLoadingOpen(true)
    let allBudgets = await grabAllBudgets()
    let curBudget = await setBudget(allBudgets)
    setLoadingOpen(false)
  }
  return (
      <>
        <ThemeProvider theme={actTheme}>
          <CssBaseline/>
          <Box sx={{
            display: 'flex',
            minHeight: window.innerHeight,
            backgroundImage: (currentTheme === 'dark' ? 'linear-gradient(to bottom right, #161616, #252525)' : 'linear-gradient(to bottom right,#eee,#fff)'),
            bgcolor: (currentTheme === 'dark' ? '#171717' : 'grey.100') }}>
            <Box sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}><AppToolbar/></Box>
            <Box component="main"
                 sx={{ width:'100%', p: 2, mb:8, height:'100%'}}>
              <Toolbar/><Outlet/>
            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                  showLabels
                  value={tabValue}
                  onChange={(event, newValue: string) => {
                    setTabValue(newValue);
                    redirect("/" + newValue)
                  }}>
                <BottomNavigationAction label="Budget" value='/budget' component={RouterLink} to="budget" icon={<DashboardIcon />} />
                <BottomNavigationAction label="Transactions" value='/transactions' component={RouterLink} to="transactions" icon={<Badge badgeContent={unCategorized} color="secondary"><PaidIcon /></Badge>} />
                {matches ? null : <Fab color='secondary' sx={{alignSelf:'center', position: 'absolute', mb:9}} size="medium"
                                       onClick={() => setAddNewTransaction(true)}><AddIcon/></Fab>}
                <BottomNavigationAction label="Analytics" value='/analytics' component={RouterLink} to="analytics" icon={<AssessmentIcon />} />
                <BottomNavigationAction label="Settings" value='/settings' component={RouterLink} to="settings" icon={<SettingsIcon />} />
              </BottomNavigation>
            </Paper>
          </Box>
          {matches ? <Fab color="secondary" variant='extended' sx={fabStyle} onClick={() => setAddNewTransaction(true)}>
            <AddIcon /> Add Transaction
          </Fab> : null}
            <Snackbar open={snackOpen} autoHideDuration={2000} onClose={snackClose} sx={{ mb: 8 }}>
              {/*@ts-ignore*/}
              <Alert onClose={snackClose} severity={snackSev} sx={{width: '100%'}}>
                {snackText}
              </Alert>
            </Snackbar>
            <Snackbar open={addToHomePU} autoHideDuration={2000} onClose={addToHomeClose} sx={{ mb: 8 }}>
              {/*@ts-ignore*/}
              <Alert onClose={addToHomeClose} severity="info" sx={{width: '100%'}}>
                "Install this webapp"
              </Alert>
            </Snackbar>
          <AddBudget/>
          <AddTransaction/>
          <EditTransaction/>
          <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 200 }}
              open={loadingOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <SelectBudget/>
          <AreYouSure/>
        </ThemeProvider>
      </>
  );
}