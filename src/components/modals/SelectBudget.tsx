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
import {selectBudget} from "../../recoil/modalStatusAtoms";
import {budgets, currentBudgetAndMonth} from "../../recoil/tableAtoms"
import dayjs from "dayjs";
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function SelectBudget() {
    const [open, setOpen] = useRecoilState(selectBudget)
    const budgetsArray = useRecoilValue(budgets)
    const [currentBudgetDetails, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const handleListItemClick = (newBudgetID: string) => {
        setCurrentBudget({
            budgetID: newBudgetID,
            year: dayjs().format('YYYY'),
            month: dayjs().format('MMMM'),
        })
        setOpen(false)
    }
    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>Select Budget</DialogTitle>
            <List sx={{ pt: 0 }}>
                {budgetsArray.map((row) => (
                    <ListItem button onClick={() => handleListItemClick(row.recordID)} key={row.recordID}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary', color: 'primary.light' }}>
                                <DashboardIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={row.budgetName} />
                    </ListItem>
                ))}
                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <ListItemAvatar>
                        <Avatar>
                            <AddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add Budget" />
                </ListItem>
            </List>
        </Dialog>
    )
}