import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import {Switch} from "@mui/material";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentUser, snackBarOpen, snackBarSeverity, snackBarText, themeAtom} from "../recoil/globalItems";
import {useNavigate} from "react-router-dom";
import Stack from '@mui/material/Stack';
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ListItemIcon from '@mui/material/ListItemIcon';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import {supabase} from "./LoginPage";
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {budgets, currentBudgetAndMonth} from "../recoil/tableAtoms";
import {selectBudget, shareBudget} from "../recoil/modalStatusAtoms";
import ShareBudget from "./modals/ShareBudget";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function SettingsPage() {
    const [slideCheck, setSlideCheck] = React.useState(false);
    const setShareBudgetOpen = useSetRecoilState(shareBudget)
    const [currentTheme, setTheme] = useRecoilState(themeAtom);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const currentBudget = useRecoilValue(currentBudgetAndMonth)
    const currentUserDetails = useRecoilValue(currentUser)
    const budgetsArray = useRecoilValue(budgets)
    const setSelectBudgetOpen = useSetRecoilState(selectBudget)
    let currentBudgetDetails = budgetsArray.find(x => x.recordID === currentBudget.budgetID)
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
    const handleListThemeClick = () => {
        if (!slideCheck) {
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
        setSlideCheck(!slideCheck);
    };
    async function supaLogOut() {
        let { error } = await supabase.auth.signOut()
    }
    React.useEffect(() => {
        if (currentTheme === 'dark') {
            setSlideCheck(true)
        } else {
            setSlideCheck(false)
        }
    }, [slideCheck,currentTheme]);
    const navigate = useNavigate();
    const fnLogout = () => {
        supaLogOut()
        navigate("/login", {replace: true});
    }
    const copyUserID = async() => {
        //navigator.clipboard.writeText(user.recordID)
        await navigator.clipboard
            .writeText(currentUserDetails.recordID)
            .then(() => {
                setSnackSev('success')
                setSnackText('User ID copied')
                setSnackOpen(true)
            })
            .catch(() => {
                setSnackSev('error')
                setSnackText('Something went wrong')
                setSnackOpen(true)
            });
    }
    return (
        <>
            <Stack spacing={2} alignItems="center">
                <Typography sx={{alignSelf:'flex-start'}} color='text.secondary' variant='h6'>Settings</Typography>
                <Paper elevation={5} sx={{width:'100%'}}>
                    <List>
                        <ListItem disablePadding>
                            <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>General</Typography>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleListThemeClick}>
                                <ListItemIcon>
                                    <DarkModeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dark Mode" />
                                <Switch sx={{ml: 1}} size='small' checked={slideCheck} onChange={handleThemeClick}/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Paper>
                <Paper elevation={5} sx={{width:'100%'}}>
                    <List>
                        <ListItem disablePadding>
                            <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>{'Budget: ' + currentBudgetDetails?.budgetName}</Typography>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setSelectBudgetOpen(true)}>
                                <ListItemIcon>
                                    <ListAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Switch Budgets" />
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon>
                                    <FileDownloadIcon />
                                </ListItemIcon>
                                <ListItemText primary="Export Data to CSV - soon" />
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setShareBudgetOpen(true)}>
                                <ListItemIcon>
                                    <ShareIcon />
                                </ListItemIcon>
                                <ListItemText primary="Share Budget" />
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete Budget - soon" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Paper>
                <Paper elevation={5} sx={{width:'100%'}}>
                    <List>
                        <ListItem disablePadding>
                            <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>Account: {currentUserDetails.fullName}</Typography>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton onClick={copyUserID}>
                                <ListItemIcon>
                                    <ContentCopyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Copy My User ID" />
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon>
                                    <LockResetIcon />
                                </ListItemIcon>
                                <ListItemText primary="Change Password - soon" />
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton onClick={fnLogout}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Paper>
            </Stack>
            <ShareBudget/>
        </>
    )
}