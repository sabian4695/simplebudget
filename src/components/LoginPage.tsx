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
                             py: 5,
                             maxWidth: '300px'
                         }}
                    >
                        <Grid container rowSpacing={2}>
                            <Grid xs={12}>
                                <Typography variant='h4'>simpleBudget</Typography>
                            </Grid>
                            <Grid xs={12}></Grid>
                            <Grid xs={12}>
                                <Typography variant='subtitle2'>Sign in to continue.</Typography>
                                <Typography color='error' variant='subtitle2'>{errorText}</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="username"
                                    type="username"
                                    autoFocus
                                    label="username"
                                    value-={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Button fullWidth variant='contained' disabled={!validateForm()} type='submit' sx={{mt: 1}}>Log in</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
            </ThemeProvider>
        </>
    );
}