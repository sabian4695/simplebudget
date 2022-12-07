import React from 'react';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import {
    authAtom,
    currentUser,
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
import {supabase} from "./LoginPage";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = React.useState("");
    const [currentUserData, setCurrentUser] = useRecoilState(currentUser)
    const [emailText, setEmailText] = React.useState('')
    const [email, setEmail] = React.useState("");
    const [passwordText, setPasswordText] = React.useState('')
    const [password, setPassword] = React.useState("");
    const setAuth = useSetRecoilState(authAtom);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const currentTheme = useRecoilValue(themeAtom);
    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    function validateForm() {
        if (fullName === '') {
            return false
        }
        if (email.length < 3) {
            return false
        }
        if (password.length < 5) {
            return false
        }
        return true
    }
    function validateFormFull() {
        if ((!email.includes('@')) || (email.length < 3)) {
            setEmailText('Please enter a valid email')
            return false
        }
        if (password.length < 8) {
            setPasswordText('Password must be longer')
            return false
        }
        return true
    }
    async function supaSignUpFc() {
        let { data } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        await setCurrentUser({
            //@ts-ignore
            recordID: data.user?.id,
            fullName: fullName,
            userType: 'free'
        });
        await supabase
            .from('users')
            .insert(currentUserData)
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateFormFull()) {
            supaSignUpFc()
            localStorage.setItem("auth", 'true')
            setAuth('true')
            navigate("/budget", {replace: true});
            setSnackSev('success')
            setSnackText('Signup Successful')
            setSnackOpen(true)
        }
    }
    const handleRedirectSignUp = (event: any) => {
        event.preventDefault();
        navigate("/login", {replace: true});
    }
    const [actTheme, setTheme] = React.useState(themes.darkTheme)
    React.useEffect(() => {
        if (currentTheme === 'dark') {
            setTheme(themes.darkTheme)
        } else if (currentTheme === 'light') {
            setTheme(themes.lightTheme)
        }
    }, [currentTheme]);
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
                                <Typography variant='body2'>Sign up to continue.</Typography>
                                <Typography color='error' variant='subtitle2'>{errorText}</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="fullName"
                                    type="text"
                                    autoFocus
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    helperText={emailText}
                                    autoFocus
                                    error={emailText.length > 0}
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    helperText={passwordText}
                                    error={passwordText.length > 0}
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
                                <Button color='secondary' fullWidth variant='contained' disabled={!validateForm()} type='submit' sx={{mt: 1}}>Sign Up</Button>
                            </Grid>
                            <Grid xs={12}>
                                <Typography display='inline' variant='body2'>Already have an account? </Typography>
                                <Button size='small' onClick={handleRedirectSignUp}>Sign In</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
            </ThemeProvider>
        </>
    );
}