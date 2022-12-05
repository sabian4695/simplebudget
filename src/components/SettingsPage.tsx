import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Switch} from "@mui/material";
import {useRecoilState, useSetRecoilState} from "recoil";
import {snackBarOpen, snackBarSeverity, snackBarText, themeAtom} from "../recoil/globalItems";
import {useNavigate} from "react-router-dom";
import Stack from '@mui/material/Stack';


export default function SettingsPage() {
    const [slideCheck, setSlideCheck] = React.useState(false);
    const [currentTheme, setTheme] = useRecoilState(themeAtom);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const handleThemeClick = (event: any) => {
        setSlideCheck(event.target.checked);
        if (event.target.checked) {
            setTheme('dark');
            localStorage.setItem('userTheme', 'dark')
            setSnackSev('success')
            setSnackText('Dark mode activated!')
            setSnackOpen(true)
        } else {
            setTheme('light');
            localStorage.setItem('userTheme', 'light')
            setSnackSev('success')
            setSnackText('Set to light mode.')
            setSnackOpen(true)
        }
    };
    React.useEffect(() => {
        if (currentTheme === 'dark') {
            setSlideCheck(true)
        } else {
            setSlideCheck(false)
        }
    });
    const navigate = useNavigate();
    const fnLogout = () => {
        localStorage.setItem('currentUser', 'null')
        localStorage.setItem('auth', 'false')
        navigate("/login", {replace: true});
    }
    return (
        <>
            <Stack spacing={2} alignItems="center">
                <Paper elevation={5} sx={{maxWidth:400}}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Dark Mode" />
                                <Switch sx={{ml: 1}} checked={slideCheck} onChange={handleThemeClick}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={fnLogout}>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Paper>
            </Stack>
        </>
    )
}