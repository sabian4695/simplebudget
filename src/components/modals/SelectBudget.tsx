import React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addBudget, selectBudget} from "../../recoil/modalStatusAtoms";
import {budgets, currentBudgetAndMonth} from "../../recoil/tableAtoms"
import dayjs from "dayjs";
import DashboardIcon from '@mui/icons-material/Dashboard';
import {dialogPaperStyles} from "../../recoil/globalItems";
import AddBudget from '../modals/AddBudget'
import Box from "@mui/material/Box";
import ListItemButton from '@mui/material/ListItemButton';
import GrabBudgetData from "../extras/GrabBudgetData";

export default function SelectBudget() {
    const { grabBudgetData } = GrabBudgetData();
    const [open, setOpen] = useRecoilState(selectBudget)
    const [createNewBudget, setCreateNewBudget] = useRecoilState(addBudget)
    const budgetsArray = useRecoilValue(budgets)
    const [currentBudgetDetails, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
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
            await grabBudgetData(newBudgetID)
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
                                    <ListItemText primary={row.budgetName} />
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