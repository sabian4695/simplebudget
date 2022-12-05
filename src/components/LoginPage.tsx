import React from 'react';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box";
import {useSetRecoilState, useRecoilValue} from "recoil";
import {useNavigate} from "react-router-dom";
import {authAtom, snackBarOpen, snackBarSeverity, snackBarText, themeAtom, themes} from "../recoil/globalItems";
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Grid from '@mui/material/Unstable_Grid2';
import Dialog from "@mui/material/Dialog";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const setAuth = useSetRecoilState(authAtom);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')

    function validateForm() {
        return (username.length > 0 && password.length > 0)
    }

    function validatePassword() {
        if (username.length > 0 && password.length > 0) {
            setErrorText('Incorrect password.')
            return true
        } else {
            return false
        }
    }

    const currentTheme = useRecoilValue(themeAtom);
    const handleRedirectSignIn = (event: any) => {
        event.preventDefault();
        navigate("/signup", {replace: true});
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validatePassword()) {
            localStorage.setItem('currentUser', username)
            localStorage.setItem("auth", 'true')
            setAuth('true')
            navigate("/budget", {replace: true});
            setSnackSev('success')
            setSnackText('Login Successful')
            setSnackOpen(true)
        }
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
                <Dialog open={true}>
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
                                <Typography color='error' variant='subtitle2'>{errorText}</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="username"
                                    type="username"
                                    autoFocus
                                    label="Username"
                                    value-={username}
                                    onChange={(e) => setUserName(e.target.value)}
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
                                <Button fullWidth variant='contained' disabled={!validateForm()} type='submit' sx={{mt: 1}}>Log in</Button>
                            </Grid>
                            <Grid xs={12}>
                                <Typography display='inline' variant='body2'>Don't have an account? </Typography>
                                <Button size='small' onClick={handleRedirectSignIn}>Sign Up</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
            </ThemeProvider>
        </>
    );
}