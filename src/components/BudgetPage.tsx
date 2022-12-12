import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import BudgetSection from "./subcomponents/BudgetSection";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {useRecoilValue, useSetRecoilState, useRecoilState} from "recoil";
import {addSection, addTransaction} from "../recoil/modalStatusAtoms";
import AddSection from "./modals/AddSection";
import AddTransaction from "./modals/AddTransaction";
import {currentBudgetAndMonth, sections} from '../recoil/tableAtoms';
import Box from '@mui/material/Box';
import AddCategory from "./modals/AddCategory";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import dayjs from "dayjs";
import PostAddIcon from '@mui/icons-material/PostAdd';

const fabStyle = {
    position: 'fixed',
    bottom: 75,
    right: 16,
};

const CustomButton = styled(Button)({
    textTransform: 'none',
});

const options: string[] = [];

let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let d = dayjs().toDate();
let i
d.setMonth(d.getMonth() + 3);
for (i=0; i>-14; i--) {
    options.push(monthName[d.getMonth()] + ' ' + d.getFullYear());
    d.setMonth(d.getMonth() - 1);
}


export default function BudgetPage() {
    const setAddNewSection = useSetRecoilState(addSection)
    const setAddNewTransaction = useSetRecoilState(addTransaction)
    const sectionsArray = useRecoilValue(sections)
    const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(options.indexOf(currentBudget.month + ' ' + currentBudget.year));
    const open = Boolean(anchorEl);
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setCurrentBudget(
            {
                budgetID: currentBudget.budgetID,
                year: Number(options[index].split(' ')[1]),
                month: options[index].split(' ')[0],
            }
        );
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Stack spacing={2} alignItems="stretch">
                <Box display='flex' flexDirection='row' alignItems='center'>
                    <Typography sx={{alignSelf:'flex-start'}} display='inline' color='text.secondary' variant='h6'>Budget:</Typography>
                    <CustomButton onClick={handleClickListItem} size='small' sx={{py:0, ml:1}}><Typography variant='h6'>{options[selectedIndex]}</Typography></CustomButton>
                </Box>
                {sectionsArray.map((row) => (
                    <BudgetSection sectionID={row.recordID} key={row.recordID}/>
                    )
                )}
                <Button variant='outlined' color='secondary' startIcon={<PostAddIcon />} onClick={() => setAddNewSection(true)}>Add Section</Button>
            </Stack>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
                PaperProps={{
                    style: {
                        maxHeight: 200
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            <Fab color="secondary" sx={fabStyle} onClick={() => setAddNewTransaction(true)}>
                <AddIcon />
            </Fab>
            <AddCategory/>
            <AddSection/>
            <AddTransaction/>
        </>
    )
}