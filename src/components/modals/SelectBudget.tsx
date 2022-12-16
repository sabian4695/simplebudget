import React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import {useRecoilState, useRecoilValue} from "recoil";
import {addBudget, selectBudget} from "../../recoil/modalStatusAtoms";
import {budgets, currentBudgetAndMonth} from "../../recoil/tableAtoms"
import DashboardIcon from '@mui/icons-material/Dashboard';
import {currentUser, dialogPaperStyles} from "../../recoil/globalItems";
import Box from "@mui/material/Box";
import ListItemButton from '@mui/material/ListItemButton';
import GrabBudgetData from "../extras/GrabBudgetData";
import {supabase} from "../LoginPage";

export default function SelectBudget() {
    const { grabBudgetData } = GrabBudgetData();
    const [open, setOpen] = useRecoilState(selectBudget)
    const [createNewBudget, setCreateNewBudget] = useRecoilState(addBudget)
    const userData = useRecoilValue(currentUser)
    const budgetsArray = useRecoilValue(budgets)
    const [userNamesArray, setUserNamesArray] = React.useState([{
        recordID: '',
        fullName: '',
        userType: ''
    }])
    const [currentBudgetDetails, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    React.useEffect(() => {
        findUserNames()
        }, [])
    async function findUserNames() {
        let userIDarray = budgetsArray.map(x => x.creatorID)
        let {data, error} = await supabase
            .from('users')
            .select()
            .eq('recordID',userIDarray)
        if (data) {
            setUserNamesArray(data)
        }
    }
    function grabUserName(creatorID: string) {
        let output
        if (creatorID === userData.recordID) {
            output = 'Me'
        } else {
            output = userNamesArray.find(x => x.recordID === creatorID)?.fullName
        }
        if (output === undefined) {
            output = 'Not Found'
        }
        return output
    }
    const handleListItemClick = async(newBudgetID: string) => {
        if (newBudgetID !== 'addBudget') {
            setCurrentBudget({
                budgetID: newBudgetID,
                year: currentBudgetDetails.year,
                month: currentBudgetDetails.month,
            })
            localStorage.setItem('currentBudget', JSON.stringify({
                budgetID: newBudgetID,
                year: currentBudgetDetails.year,
                month: currentBudgetDetails.month,
            }))
            await grabBudgetData(newBudgetID, currentBudgetDetails.year, currentBudgetDetails.month)
        } else {
            setCreateNewBudget(true)
        }
        setOpen(false)
    }
    return (
        <>
            <Dialog onClose={() => setOpen(false)} open={open} PaperProps={dialogPaperStyles}>
                <Box sx={{bgcolor: 'background.paper', minWidth: 250}}>
                    <DialogTitle>Select Budget</DialogTitle>
                    <List sx={{ pt: 0 }}>
                        {budgetsArray.map((row) => (
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleListItemClick(row.recordID)} key={row.recordID}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary', color: 'primary.light' }}>
                                            <DashboardIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={row.budgetName} secondary={grabUserName(row.creatorID)}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleListItemClick('addBudget')}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Add Budget" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Dialog>

        </>
    )
}