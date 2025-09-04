import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import BudgetSection from "./subcomponents/BudgetSection";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { addSection, copyBudget } from "../recoil/modalStatusAtoms";
import AddSection from "./modals/AddSection";
import { categories, currentBudgetAndMonth, sections, transactions } from '../recoil/tableAtoms';
import Box from '@mui/material/Box';
import AddCategory from "./modals/AddCategory";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import dayjs from "dayjs";
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditCategory from "./modals/EditCategory";
import LinearProgress from '@mui/material/LinearProgress';
import Paper from "@mui/material/Paper";
import GrabBudgetData from "./extras/GrabBudgetData";
import EditSection from "./modals/EditSection";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import CopyBudget from "./modals/CopyBudget";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return (
        //@ts-ignore
        <div
            role="tabpanel"
            hidden={value !== index}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
            {/*@ts-ignore*/}
        </div>
    );
}

const CustomButton = styled(Button)({
    textTransform: 'none',
});

const options: string[] = [];

let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let d = dayjs().toDate();
let i
d.setMonth(d.getMonth() + 3);
for (i = 0; i > -14; i--) {
    options.push(monthName[d.getMonth()] + ' ' + d.getFullYear());
    d.setMonth(d.getMonth() - 1);
}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function BudgetPage() {
    const setAddNewSection = useSetRecoilState(addSection)
    const sectionsArray = useRecoilValue(sections)
    const transactionsArray = useRecoilValue(transactions)
    const setOpenCopyBudget = useSetRecoilState(copyBudget)
    const { grabBudgetData } = GrabBudgetData();
    const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const categoryArray = useRecoilValue(categories)
    const [selectedIndex, setSelectedIndex] = React.useState(options.indexOf(currentBudget.month + ' ' + currentBudget.year));
    const [tabValue, setTabValue] = React.useState(0);
    const open = Boolean(anchorEl);
    const moreOpen = Boolean(anchorEl1);
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
        localStorage.setItem('currentBudget', JSON.stringify(
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
    let totalActualExpensesStart = transactionsArray.reduce((accumulator, object) => {
        if (object.transactionType === "expense") {
            return accumulator + object.amount;
        } else {
            return accumulator
        }
    }, 0)
    let totalActualIncomeStart = transactionsArray.reduce((accumulator, object) => {
        if (object.transactionType === "income") {
            return accumulator + object.amount;
        } else {
            return accumulator
        }
    }, 0)

    const [totalIncome, setTotalIncome] = React.useState(totalIncomeStart)
    const [totalExpenses, setTotalExpenses] = React.useState(totalExpensesStart)
    const [totalActualExpenses, setTotalActualExpenses] = React.useState(totalActualExpensesStart)
    const [totalActualIncome, setTotalActualIncome] = React.useState(totalActualIncomeStart)
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
        setTotalActualExpenses(
            transactionsArray.reduce((accumulator, object) => {
                if (object.transactionType === "expense") {
                    return accumulator + object.amount;
                } else {
                    return accumulator
                }
            }, 0)
        )
        setTotalActualIncome(
            transactionsArray.reduce((accumulator, object) => {
                if (object.transactionType === "income") {
                    return accumulator + object.amount;
                } else {
                    return accumulator
                }
            }, 0)
        )
    }, [categoryArray, sectionsArray, transactionsArray])
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpenOptions = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl1(event.currentTarget);
    };
    const closeOptions = () => {
        setAnchorEl1(null);
    };
    function copyBudgetClick() {
        setAnchorEl1(null);
        setOpenCopyBudget(true)
    }
    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    function sumCat(idVal: string) {
        return categoryArray.filter(x => x.sectionID === idVal).reduce((accumulator, object) => {
            return accumulator + object.amount;
        }, 0)
    }
    return (
        <>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Stack spacing={2} alignItems="stretch" sx={{ maxWidth: 400 }}>
                    <Box>
                        <Box sx={{mt: -0.5}} display='flex' flexDirection='row' alignSelf='flex-start'>
                            <IconButton
                                size='small'
                                aria-label="more"
                                aria-controls={moreOpen ? 'long-menu' : undefined}
                                aria-expanded={moreOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleOpenOptions}
                            ><MoreVertIcon /></IconButton>
                            <Typography display='inline' color='text.secondary' variant='h6'>Budget:</Typography>
                            <CustomButton color={monthName[dayjs().toDate().getMonth()] === currentBudget.month ? 'primary' : 'secondary'} variant="outlined" onClick={handleClickListItem} size='small' sx={{ py: 0, ml: 1 }}><Typography variant='h6'>{options[selectedIndex]}</Typography></CustomButton>
                        </Box>
                        <Box>
                            <Tabs variant='fullWidth' value={tabValue} onChange={(event: React.SyntheticEvent, newValue: number) => {
                                setTabValue(newValue);
                            }} centered>
                                <Tab label="Planned" />
                                <Tab label="Actual" />
                            </Tabs>
                            <TabPanel value={tabValue} index={0}>
                                <Paper elevation={1} sx={{ borderRadius: 3 }}>
                                    <Box display='flex' alignItems='center' justifyContent='space-evenly' sx={{ width: '100%', p: 1, textAlign: 'center' }}>
                                        <Paper elevation={3} sx={{ px: 1 }}>
                                            <Typography color='text.secondary' variant='body1'>Income: {formatter.format(totalIncome)}</Typography>
                                        </Paper>
                                        <Paper elevation={3} sx={{ mx: 1, px: 1 }}>
                                            <Typography color='text.secondary' variant='body1'>Expenses: {formatter.format(totalExpenses)}</Typography>
                                        </Paper>
                                        <Paper elevation={3} sx={{ px: 1 }}>
                                            <Typography
                                                color={totalIncome - totalExpenses < 0 ? 'error.main' : 'success.main'}
                                                style={{ fontWeight: 'bold' }}
                                                variant='body1'
                                            >
                                                Leftover: {formatter.format(totalIncome - totalExpenses)}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                    <LinearProgress
                                        sx={{ height: 10, borderBottomRightRadius: 6, borderBottomLeftRadius: 6 }}
                                        variant="determinate" color={(totalExpenses / totalIncome) > 1 ? 'error' : 'success'}
                                        value={(totalExpenses / totalIncome) * 100}
                                    />
                                </Paper>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <Paper elevation={1} sx={{ borderRadius: 3 }}>
                                    <Box display='flex' alignItems='center' justifyContent='space-evenly' sx={{ width: '100%', p: 1, textAlign: 'center' }}>
                                        <Paper elevation={3} sx={{ px: 1 }}>
                                            <Typography color='text.secondary' variant='body1'>Received: {formatter.format(totalActualIncome)}</Typography>
                                        </Paper>
                                        <Paper elevation={3} sx={{ mx: 1, px: 1 }}>
                                            <Typography color='text.secondary' variant='body1'>Spent: {formatter.format(totalActualExpenses)}</Typography>
                                        </Paper>
                                        <Paper elevation={3} sx={{ px: 1 }}>
                                            <Typography
                                                color={totalActualIncome - totalActualExpenses < 0 ? 'error.main' : 'success.main'}
                                                style={{ fontWeight: 'bold' }}
                                                variant='body1'
                                            >
                                                Difference: {formatter.format(totalActualIncome - totalActualExpenses)}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                    <LinearProgress
                                        sx={{ height: 10, borderBottomRightRadius: 6, borderBottomLeftRadius: 6 }}
                                        variant="determinate" color={(totalActualExpenses / totalActualIncome) > 1 ? 'error' : 'success'}
                                        value={(totalActualExpenses / totalActualIncome) * 100}
                                    />
                                </Paper>
                            </TabPanel>
                        </Box>
                    </Box>

                    {sectionsArray.filter(x => x.sectionType === 'income').map((row) => (
                        <BudgetSection sectionID={row.recordID} key={row.recordID} />
                    )
                    )}
                    {sectionsArray.filter(x => x.sectionType === 'expense').sort(function(a, b) {
                                //@ts-ignore
                                return sumCat(b.recordID) - sumCat(a.recordID);
                            }).map((row) => (
                        <BudgetSection sectionID={row.recordID} key={row.recordID} />
                    )
                    )}
                    <Button variant='outlined' color='secondary' startIcon={<PostAddIcon />} onClick={() => setAddNewSection(true)}>Add Section</Button>
                </Stack>
            </Box >
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
                PaperProps={{ style: { maxHeight: 300 } }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        //@ts-ignore
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            <Menu
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl1}
                open={moreOpen}
                onClose={closeOptions}
            >
                <MenuItem onClick={copyBudgetClick}>
                    <CopyAllIcon sx={{ mr: 1 }} />
                    Copy budget
                </MenuItem>
            </Menu>
            <AddCategory />
            <AddSection />
            <EditCategory />
            <EditSection />
            <CopyBudget />
        </>
    )
}