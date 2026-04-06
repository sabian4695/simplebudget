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
import Alert from '@mui/material/Alert';
import Paper from "@mui/material/Paper";
import useGrabBudgetData from "./extras/GrabBudgetData";
import EditSection from "./modals/EditSection";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import CopyBudget from "./modals/CopyBudget";
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

    // Compute over-budget expense categories
    const overBudgetCategories = categoryArray.filter(cat => {
        const section = sectionsArray.find(s => s.recordID === cat.sectionID);
        if (section?.sectionType !== 'expense') return false;
        const spent = transactionsArray
            .filter(t => t.categoryID === cat.recordID && t.transactionType === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
        return spent > cat.amount && cat.amount > 0;
    });
    const overBudgetTotal = overBudgetCategories.reduce((acc, cat) => {
        const spent = transactionsArray
            .filter(t => t.categoryID === cat.recordID && t.transactionType === 'expense')
            .reduce((a, t) => a + t.amount, 0);
        return acc + (spent - cat.amount);
    }, 0);

    return (
        <>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Stack spacing={2} alignItems="stretch" sx={{ maxWidth: 400, width: '100%' }}>
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
                        <Paper elevation={1} sx={{ borderRadius: 3, mt: 1, p: 1.5 }}>
                            <Box display='flex' justifyContent='space-between' sx={{ mb: 0.5 }}>
                                <Typography variant='caption' color='text.secondary'>Planned</Typography>
                                <Typography variant='caption' color='text.secondary'>Actual</Typography>
                            </Box>
                            <Box display='flex' justifyContent='space-between' alignItems='baseline'>
                                <Typography variant='body2' color='text.secondary'>
                                    {formatter.format(totalIncome)} in
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {formatter.format(totalActualIncome)} in
                                </Typography>
                            </Box>
                            <Box display='flex' justifyContent='space-between' alignItems='baseline'>
                                <Typography variant='body2' color='text.secondary'>
                                    {formatter.format(totalExpenses)} out
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {formatter.format(totalActualExpenses)} out
                                </Typography>
                            </Box>
                            <Box display='flex' justifyContent='space-between' alignItems='baseline' sx={{ mt: 0.5 }}>
                                <Typography
                                    variant='body1'
                                    sx={{ fontWeight: 'bold' }}
                                    color={totalIncome - totalExpenses < 0 ? 'error.main' : 'success.main'}
                                >
                                    {formatter.format(totalIncome - totalExpenses)}
                                </Typography>
                                <Typography
                                    variant='body1'
                                    sx={{ fontWeight: 'bold' }}
                                    color={totalActualIncome - totalActualExpenses < 0 ? 'error.main' : 'success.main'}
                                >
                                    {formatter.format(totalActualIncome - totalActualExpenses)}
                                </Typography>
                            </Box>
                            <LinearProgress
                                sx={{ height: 6, borderRadius: 3, mt: 1 }}
                                variant="determinate"
                                color={(totalActualExpenses / totalActualIncome) > 1 ? 'error' : 'success'}
                                value={Math.min((totalActualExpenses / (totalActualIncome || 1)) * 100, 100)}
                            />
                        </Paper>
                    </Box>

                    {overBudgetCategories.length > 0 && (
                        <Alert severity="warning" variant="outlined" sx={{ py: 0 }}>
                            {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category' : 'categories'} over budget by {formatter.format(overBudgetTotal)}
                        </Alert>
                    )}

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
