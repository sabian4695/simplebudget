import React from 'react';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import {
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
import logo from "../logo.png";
import Stack from "@mui/material/Stack";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = React.useState("");
    const setCurrentUser = useSetRecoilState(currentUser)
    const [emailText, setEmailText] = React.useState('')
    const [email, setEmail] = React.useState("");
    const [passwordText, setPasswordText] = React.useState('')
    const [password, setPassword] = React.useState("");
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const currentTheme = useRecoilValue(themeAtom);
    const [showPassword, setShowPassword] = React.useState(false)
    const [signedUpBool, setSignedUpBool] = React.useState(false)
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
    async function supaSignUpSingle() {
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            setErrorText(error.message)
            console.log(data)
        }
        if (!data) {
            setErrorText('User already exists')
        }
        return data
    }

    async function supaSignUpFc(event: any) {
        event.preventDefault();
        setErrorText('')
        if (validateFormFull()) {
            const userData = await supaSignUpSingle()
            if (errorText.length > 0) {return}

            await setCurrentUser({
                //@ts-ignore
                recordID: userData.user?.id,
                fullName: fullName,
                userType: 'free'
            });
            const {error} = await supabase
                .from('users')
                .insert({
                    recordID: userData.user?.id,
                    fullName: fullName,
                    userType: 'free'
                })
            if (error) {
                setErrorText(error.message)
                return
            }
            setSignedUpBool(true)
            setSnackSev('success')
            setSnackText('Signup Successful - please verify email to login')
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
                         onSubmit={supaSignUpFc}
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
                                <Stack direction='row' alignItems='center'>
                                    <img
                                        height='50'
                                        src={logo}
                                        srcSet={`${logo}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt='logo'
                                        loading="lazy"
                                    />
                                    <Typography sx={{ml:1}}>simple</Typography>
                                    <Typography variant="h6" align="left" >
                                        Budget
                                    </Typography>
                                    <Typography color='error' align="left" sx={{flexGrow: 1, ml:1}}>[beta]</Typography>
                                </Stack>
                            </Grid>
                            {signedUpBool ?
                                <>
                                    <Grid xs={12} sx={{mb: 0, pb: 1}}>
                                        <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600' }}>Congrats! You're signed up.</Typography>
                                        <Typography variant='subtitle1' sx={{ fontWeight: '800' }}>{'>>'}To log in, please verify your email first.</Typography>
                                    </Grid>
                                    <Grid xs={12} sx={{mb: 0, pb: 1}}>
                                        <Typography variant='body2'>P.S., it's OK to close this window. The email will have a link back here.</Typography>
                                    </Grid>
                                    <Grid xs={12} sx={{mb: 0, pb: 1}}>
                                        <Typography variant='body2' display='inline'>Otherwise, click <Button sx={{m:0, p:0}} size='small' onClick={handleRedirectSignUp}>HERE</Button> to go to the sign in page.</Typography>

                                    </Grid>
                                </>
                                :
                                <>
                                        <Grid xs={12} sx={{mb: 0, pb: 1}}>
                                            <Typography variant='body2'>Sign up to continue.</Typography>
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
                                        <Typography color='error' variant='subtitle2'>{errorText}</Typography>
                                        <Button color='secondary' fullWidth variant='contained' disabled={!validateForm()} type='submit' sx={{mt: 1}}>Sign Up</Button>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Typography display='inline' variant='body2'>Already have an account? </Typography>
                                            <Button size='small' onClick={handleRedirectSignUp}>Sign In</Button>
                                        </Grid>
                                </>
                            }
                        </Grid>
                    </Box>
                </Dialog>
            </ThemeProvider>
        </>
    );
}