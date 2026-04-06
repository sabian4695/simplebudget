import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import BudgetSection from "./subcomponents/BudgetSection";
import Button from '@mui/material/Button';
import { useModalStore } from "../store/modalStore";
import { useTableStore } from "../store/tableStore";
import AddSection from "./modals/AddSection";
import Box from '@mui/material/Box';
import AddCategory from "./modals/AddCategory";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import dayjs from "dayjs";
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditCategory from "./modals/EditCategory";
import LinearProgress from '@mui/material/LinearProgress';
import Paper from "@mui/material/Paper";
import useGrabBudgetData from "./extras/GrabBudgetData";
import EditSection from "./modals/EditSection";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import CopyBudget from "./modals/CopyBudget";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function BudgetPage() {
    const setAddNewSection = useModalStore(s => s.setAddSection)
    const sectionsArray = useTableStore(s => s.sections)
    const transactionsArray = useTableStore(s => s.transactions)
    const setOpenCopyBudget = useModalStore(s => s.setCopyBudget)
    const { grabBudgetData } = useGrabBudgetData();
    const currentBudget = useTableStore(s => s.currentBudgetAndMonth)
    const setCurrentBudget = useTableStore(s => s.setCurrentBudgetAndMonth)
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const categoryArray = useTableStore(s => s.categories)
    const [tabValue, setTabValue] = React.useState(0);
    const moreOpen = Boolean(anchorEl1);
    const selectedMonth = dayjs(`${currentBudget.year}-${currentBudget.month}-01`, 'YYYY-MMMM-DD');

    const handleMonthChange = (newValue: any) => {
        if (!newValue) return;
        const year = Number(newValue.format('YYYY'));
        const month = newValue.format('MMMM');
        setCurrentBudget({
            budgetID: currentBudget.budgetID,
            year,
            month,
        });
        localStorage.setItem('currentBudget', JSON.stringify({
            budgetID: currentBudget.budgetID,
            year,
            month,
        }));
        grabBudgetData(currentBudget.budgetID, year, month);
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
                        <Box sx={{ mt: -0.5 }} display='flex' flexDirection='row' alignSelf='flex-start' alignItems='center'>
                            <IconButton
                                size='small'
                                aria-label="more"
                                aria-controls={moreOpen ? 'long-menu' : undefined}
                                aria-expanded={moreOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleOpenOptions}
                            ><MoreVertIcon /></IconButton>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month']}
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            variant: 'outlined'
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box>
                            <Tabs variant='fullWidth' sx={{ mt: 1 }} value={tabValue} onChange={(event: React.SyntheticEvent, newValue: number) => {
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
                    {sectionsArray.filter(x => x.sectionType === 'expense').sort(function (a, b) {
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
                slotProps={{
                    list: {
                        'aria-labelledby': 'long-button',
                    },
                }}
                anchorEl={anchorEl1}
                open={moreOpen}
                onClose={closeOptions}
            >
                <MenuItem onClick={copyBudgetClick}>
                    <CopyAllIcon sx={{ mr: 1 }} />
                    Copy budget outline
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
