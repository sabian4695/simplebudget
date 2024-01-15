import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import {Switch} from "@mui/material";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentUser, 
    snackBarOpen, 
    snackBarSeverity, 
    snackBarText, 
    themeAtom,
    areYouSureAccept,
    areYouSureDetails,
    areYouSureTitle,
    mainLoading
} from "../recoil/globalItems";
import {supaALLsections, supaCategories} from './extras/api_functions'
import {useNavigate} from "react-router-dom";
import Box from '@mui/material/Box';
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
import {budgets, currentBudgetAndMonth, sections} from "../recoil/tableAtoms";
import {openChangePassword, selectBudget, shareBudget, areYouSure} from "../recoil/modalStatusAtoms";
import ShareBudget from "./modals/ShareBudget";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChangePassword from './modals/ChangePassword'

export default function SettingsPage() {
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const sectionsArray = useRecoilValue(sections);
    const [slideCheck, setSlideCheck] = React.useState(false);
    const [areYouSureOpen, setAreYouSureOpen] = useRecoilState(areYouSure);
    const setCheckTitle = useSetRecoilState(areYouSureTitle);
    const setCheckDetails = useSetRecoilState(areYouSureDetails);
    const [checkAccept, setCheckAccept] = useRecoilState(areYouSureAccept);
    const [budgetDelete, setBudgetDelete] = React.useState(false)
    const setShareBudgetOpen = useSetRecoilState(shareBudget)
    const [currentTheme, setTheme] = useRecoilState(themeAtom);
    const setOpenChangePassword = useSetRecoilState(openChangePassword);
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
        if(!areYouSureOpen) {
            if(checkAccept) {
                handleDelete()
            }
            setBudgetDelete(false)
        }
    }, [areYouSureOpen])
    async function handleDoubleCheck() {
        setBudgetDelete(true)
        setCheckTitle('Are you sure you want to delete this budget?')
        setCheckDetails('WARNING: This will delete all sections, categories, and transactions assigned to this budget. THIS CANNOT BE UNDONE')
        setAreYouSureOpen(true)
    }
    async function handleDelete() {
        if (!budgetDelete) {
            return
        }
        setLoadingOpen(true)
        await supabase
            .from('transactions')
            .delete()
            .eq('budgetID', currentBudget.budgetID)

        let allSections = await supaALLsections(currentBudget.budgetID)
        
        await supabase
            .from('categories')
            .delete()
            //@ts-ignore
            .in('sectionID', allSections?.map(x => x.recordID))

        let { data } = await supabase
            .from('sections')
            .delete()
            .eq('budgetID', currentBudget.budgetID)

        await supabase
            .from('shared')
            .delete()
            .eq('budgetID', currentBudget.budgetID)

        let { error } = await supabase
            .from('budgets')
            .delete()
            .eq('recordID', currentBudget.budgetID)

        if (error) {
            console.log(error)
            setLoadingOpen(false)
            setSnackSev('error')
            setSnackText('Something went wrong')
            setSnackOpen(true)
            return
        }
        //window.location.reload();
        setLoadingOpen(false)
        setSnackSev('success')
        setSnackText('Budget deleted')
        setSnackOpen(true)
        setCheckAccept(false)
        setBudgetDelete(false)
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
    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Stack spacing={2} alignItems="stretch" sx={{maxWidth:400, width:'100%'}}>
                    <Typography sx={{alignSelf:'flex-start'}} color='text.secondary' variant='h6'>Settings</Typography>
                    <Paper elevation={5} sx={{width:'100%', borderRadius: 3}}>
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
                    <Paper elevation={5} sx={{width:'100%', borderRadius: 3}}>
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
                                <ListItemButton onClick={handleDoubleCheck}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete Budget" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                    <Paper elevation={5} sx={{width:'100%', borderRadius: 3}}>
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
                                <ListItemButton onClick={() => setOpenChangePassword(true)}>
                                    <ListItemIcon>
                                        <LockResetIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Change Password" />
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
            </Box>
            <ShareBudget/>
            <ChangePassword/>
        </>
    )
}