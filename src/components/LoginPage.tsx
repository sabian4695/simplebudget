import React from 'react';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box";
import {useSetRecoilState, useRecoilValue, useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import {
    authAtom, currentUser,
    dialogPaperStyles,
    snackBarOpen,
    snackBarSeverity,
    snackBarText,
    themeAtom,
    themes
} from "../recoil/globalItems";
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Grid from '@mui/material/Unstable_Grid2';
import Dialog from "@mui/material/Dialog";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {createClient} from "@supabase/supabase-js";
import {supaBudgets, supaSections, supaCategories, supaTransactions} from './extras/api_functions'
import {budgets, currentBudgetAndMonth, sections, categories, transactions} from "../recoil/tableAtoms";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

const options = {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
}
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZG1qamN2YXhlanhrdHF3ZGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzMzA0ODMsImV4cCI6MTk4NTkwNjQ4M30.7Uqw2v3Ny5FvPBRBbbvtcUxJj_ReNDjRBUn6cWlal_o'

const SUPABASE_URL = "https://psdmjjcvaxejxktqwdcm.supabase.co"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, options)

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const setCurrentUser = useSetRecoilState(currentUser)
    const [budgetsArray, setBudgetArray] = useRecoilState(budgets)
    const setSectionArray = useSetRecoilState(sections)
    const setCategoryArray = useSetRecoilState(categories)
    const setTransactionArray = useSetRecoilState(transactions)
    const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const [errorText, setErrorText] = React.useState('')
    const setAuth = useSetRecoilState(authAtom);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [loadingOpen, setLoadingOpen] = React.useState(false);
    const handleLoadingClose = () => {
        setLoadingOpen(false);
    };
    async function supaSignIn() {
        setLoadingOpen(true)
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error !== null) {
            setErrorText(error.message)
            setLoadingOpen(false)
            return false
        }
        let { data: users } = await supabase
            .from('users')
            .select('fullName,userType')
            .eq('recordID', data.user!.id)
        if (users) {
            await setCurrentUser(
                {
                    recordID: data.user!.id,
                    fullName: users[0].fullName,
                    userType: users[0].userType,
                }
            )
            localStorage.setItem('fullName',users[0].fullName)
            if (errorText === '') {
                navigate("/budget", {replace: true});
                setSnackSev('success')
                setSnackText('Login Successful')
                setSnackOpen(true)
            }
            //let sharedID = await supaShared(data.user!.id)
            //console.log(sharedID)
            let allBudgets = await supaBudgets(data.user!.id)

            if (allBudgets) {
                await setBudgetArray(allBudgets)
                localStorage.setItem('budgets',JSON.stringify(allBudgets))
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
                let allSections = await supaSections(allBudgets[0].recordID, currentBudget.month, currentBudget.year)
                if (allSections) {
                    setSectionArray(allSections)
                    localStorage.setItem('sections',JSON.stringify(allSections))
                    let allCategories = await supaCategories(allSections.map(x => x.recordID))
                    if (allCategories) {
                        setCategoryArray(allCategories)
                        localStorage.setItem('categories',JSON.stringify(allCategories))
                        let allTransactions = await supaTransactions(currentBudget.budgetID)
                        if (allTransactions) {
                            setTransactionArray(allTransactions)
                            localStorage.setItem('transactions',JSON.stringify(allTransactions))
                        } else {
                            setTransactionArray([])
                            localStorage.setItem('transactions',JSON.stringify([]))
                        }
                    } else {
                        setCategoryArray([])
                        setTransactionArray([])
                        localStorage.setItem('categories',JSON.stringify([]))
                        localStorage.setItem('transactions',JSON.stringify([]))
                    }
                } else {
                    setSectionArray([])
                    setCategoryArray([])
                    setTransactionArray([])
                    localStorage.setItem('sections',JSON.stringify([]))
                    localStorage.setItem('categories',JSON.stringify([]))
                    localStorage.setItem('transactions',JSON.stringify([]))
                }
            }
            setLoadingOpen(false)
            return
        }
    }
    function validateForm() {
        return (email.length > 0 && password.length > 0)
    }
    const currentTheme = useRecoilValue(themeAtom);
    const handleRedirectSignIn = (event: any) => {
        event.preventDefault();
        navigate("/signup", {replace: true});
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setErrorText('')
        supaSignIn()
    }
    const [actTheme, setTheme] = React.useState(themes.darkTheme)
    React.useEffect(() => {
        if (currentTheme === 'dark') {
            setTheme(themes.darkTheme)
        } else if (currentTheme === 'light') {
            setTheme(themes.lightTheme)
        }
    }, [currentTheme]);
    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <>
            <ThemeProvider theme={actTheme}>
                <CssBaseline/>
                <Box sx={{
                    width: '100%',
                    height: window.innerHeight,
                    backgroundColor: 'primary.light',
                }}>
                </Box>
                <Dialog open={true}
                        PaperProps={dialogPaperStyles}>
                    <Box component='form'
                         onSubmit={handleSubmit}
                         sx={{
                             bgcolor: 'background.paper',
                             px: 3,
                             pb: 5,
                             pt: 3,
                             maxWidth: '300px'
                         }}
                    >
                        <Grid container rowSpacing={2}>
                            <Grid xs={12} sx={{my: 5}}>
                                <Typography variant='body1' display='inline' color='text.secondary'>
                                    simple
                                </Typography>
                                <Typography variant="h5" display='inline' color='text.secondary'>
                                    Budget
                                </Typography>
                            </Grid>
                            <Grid xs={12} sx={{mb:0, pb:1}}>
                                <Typography variant='body2'>Sign in to continue.</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    autoFocus
                                    label="Email"
                                    value-={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    value={password}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Typography variant='body2' color='error'>{errorText}</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <Button fullWidth variant='contained' disabled={!validateForm()} type='submit' sx={{mt: 1}}>Log in</Button>
                            </Grid>
                            <Grid xs={12}>
                                <Typography display='inline' variant='body2'>Don't have an account? </Typography>
                                <Button size='small' onClick={handleRedirectSignIn}>Sign Up</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 200 }}
                    open={loadingOpen}
                    onClick={handleLoadingClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </ThemeProvider>
        </>
    );
}