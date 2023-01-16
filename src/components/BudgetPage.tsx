import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import BudgetSection from "./subcomponents/BudgetSection";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {useRecoilValue, useSetRecoilState, useRecoilState} from "recoil";
import {addSection, addTransaction} from "../recoil/modalStatusAtoms";
import AddSection from "./modals/AddSection";
import {categories, currentBudgetAndMonth, sections} from '../recoil/tableAtoms';
import Box from '@mui/material/Box';
import AddCategory from "./modals/AddCategory";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import dayjs from "dayjs";
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditCategory from "./modals/EditCategory";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Paper from "@mui/material/Paper";
import GrabBudgetData from "./extras/GrabBudgetData";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditSection from "./modals/EditSection";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 15,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 700],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
    },
}));

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
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function BudgetPage() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const setAddNewSection = useSetRecoilState(addSection)
    const setAddNewTransaction = useSetRecoilState(addTransaction)
    const sectionsArray = useRecoilValue(sections)
    const { grabBudgetData } = GrabBudgetData();
    const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const categoryArray = useRecoilValue(categories)
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
        localStorage.setItem('currentBudget',JSON.stringify(
            {
                budgetID: currentBudget.budgetID,
                year: Number(options[index].split(' ')[1]),
                month: options[index].split(' ')[0],
            }
        ))
        grabBudgetData(currentBudget.budgetID, Number(options[index].split(' ')[1]), options[index].split(' ')[0])
        setAnchorEl(null);
    };
    let totalIncomeStart = categoryArray.reduce((accumulator, object) => {
        let section = sectionsArray.find(x => x.recordID === object.sectionID)
        if (section?.sectionType === 'income') {
            return accumulator + object.amount;
        }
        return accumulator
    }, 0)
    let totalExpensesStart = categoryArray.reduce((accumulator, object) => {
        let section = sectionsArray.find(x => x.recordID === object.sectionID)
        if (section?.sectionType === 'expense') {
            return accumulator + object.amount;
        }
        return accumulator
    }, 0)
    const [totalIncome, setTotalIncome] = React.useState(totalIncomeStart)
    const [totalExpenses, setTotalExpenses] = React.useState(totalExpensesStart)
    React.useEffect(() => {
        setTotalIncome(
            categoryArray.reduce((accumulator, object) => {
                let section = sectionsArray.find(x => x.recordID === object.sectionID)
                if (section?.sectionType === 'income') {
                    return accumulator + object.amount;
                }
                return accumulator
            }, 0)
        )
        setTotalExpenses(
            categoryArray.reduce((accumulator, object) => {
                let section = sectionsArray.find(x => x.recordID === object.sectionID)
                if (section?.sectionType === 'expense') {
                    return accumulator + object.amount;
                }
                return accumulator
            }, 0)
        )
    }, [categoryArray, sectionsArray])
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

                <Paper elevation={5}>
                    <Box sx={{width:'100%'}}>
                        <Box display='flex' flexDirection='column' alignItems='center' sx={{width:'100%', p:1}}>
                            <Typography sx={{alignSelf:'flex-start'}} display='block' color='text.secondary' variant='subtitle1'>Income: {formatter.format(totalIncome)}</Typography>
                            <Typography sx={{alignSelf:'flex-start'}} display='block' color='text.secondary' variant='subtitle1'>Expenses: {formatter.format(totalExpenses)}</Typography>
                            <Typography sx={{alignSelf:'flex-start'}} display='block' color='text.secondary' variant='subtitle1'>Leftover: {formatter.format(totalIncome-totalExpenses)}</Typography>
                        </Box>
                        <Box><BorderLinearProgress variant="determinate" value={(totalExpenses/totalIncome)*100}/></Box>
                    </Box>
                </Paper>
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
                        maxHeight: 300
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
            <AddCategory/>
            <AddSection/>
            <EditCategory/>
            <EditSection/>
        </>
    )
}