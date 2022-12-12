import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addTransaction} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {currentUser, dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";
import {v4 as uuidv4} from "uuid";
import dayjs, {Dayjs} from "dayjs";
import {categories, currentBudgetAndMonth, transactions} from "../../recoil/tableAtoms";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import {supabase} from "../LoginPage";

export default function AddTransaction() {
    const [addNewTransaction, setAddNewTransaction] = useRecoilState(addTransaction);
    const [transactionAmount, setTransactionAmount] = React.useState(0.00)
    const [transactionTitle, setTransactionTitle] = React.useState('')
    const [transactionCategory, setTransactionCategory] = React.useState<any>(null);
    const [transactionType, setTransactionType] = React.useState('expense')
    const [transactionDate, setTransactionDate] = React.useState<Dayjs | null>(dayjs())
    const handleTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: string,
    ) => {
        if (newType !== null) {
            setTransactionType(newType);
        }
    };
    const categoriesArray = useRecoilValue(categories)
    const categoryArray = categoriesArray.map((row) => (
        {
            id: row.recordID,
            label: row.categoryName
        }
    ))
    const [transactionsArray, setTransactionsArray] = useRecoilState(transactions)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const currentBudget = useRecoilValue(currentBudgetAndMonth)
    const currentUserData = useRecoilValue(currentUser)
    const [errorText, setErrorText] = React.useState('')
    const verifyInputs = () => {
        if (transactionTitle === '') {
            setErrorText('Please enter a title')
            return false
        }
        if (transactionAmount === null) {
            setErrorText('Please enter an amount')
            return false
        }
        if (transactionCategory === '') {
            setErrorText('Please enter a category')
            return false
        }
        if (transactionDate === null) {
            setErrorText('Please enter a date')
            return false
        }
        return true
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        if (verifyInputs()) {
            let newTransaction = {
                recordID: uuidv4(),
                budgetID: currentBudget.budgetID,
                categoryID: transactionCategory !== null ? transactionCategory.id : '',
                amount: transactionAmount,
                title: transactionTitle,
                transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : 0,
                transactionType: transactionType,
                creatorID: currentUserData.recordID,
            };
            let {data, error} = await supabase
                .from('transactions')
                .insert(newTransaction)
            setTransactionsArray(prevState => [...prevState, newTransaction]);
            localStorage.setItem('transactions', JSON.stringify(transactionsArray))
            setAddNewTransaction(false)
            setSnackSev('success')
            setSnackText('Transaction Added!')
            setSnackOpen(true)
        }
    }
    const handleFocus = (event: any) => {
        if (event) {
            event.target.select()
        }
    };
    React.useEffect(() => {
        if (addNewTransaction) return;
        setTransactionTitle('')
        setTransactionAmount(0)
        setTransactionType('expense')
        setTransactionCategory(null)
        setTransactionDate(dayjs())
        setErrorText('')
    }, [addNewTransaction])
    return (
        <>
            <Dialog open={addNewTransaction}
                    onClose={() => setAddNewTransaction(false)}
                    scroll='paper'
                    PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper'}}>
                    <DialogTitle>New Transaction</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={1}>
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={transactionType}
                                    fullWidth
                                    exclusive
                                    onChange={handleTypeChange}
                                    size='small'
                                >
                                    <ToggleButton value="income">Income</ToggleButton>
                                    <ToggleButton value="expense">Expense</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    onFocus={handleFocus}
                                    fullWidth
                                    margin='normal'
                                    value={transactionAmount}
                                    onChange={(event: any) => setTransactionAmount(event.target.value)}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    placeholder='Amount'
                                    label="Amount"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    margin='normal'
                                    value={transactionTitle}
                                    onChange={(event: any) => setTransactionTitle(event.target.value)}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Autocomplete
                                    disablePortal
                                    options={categoryArray}
                                    getOptionLabel={(option) => option.label}
                                    fullWidth
                                    value={transactionCategory}
                                    onChange={(event: any, newValue: any) => {
                                        setTransactionCategory(newValue)
                                    }}
                                    renderInput={(params) => <TextField margin="dense" {...params} label="Category"/>}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Date"
                                        value={transactionDate}
                                        onChange={(newValue) => {
                                            setTransactionDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} margin="normal" fullWidth/>}
                                        componentsProps={{
                                            actionBar: {
                                                actions: ['today'],
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {<Typography color='error' variant="body2">{errorText}</Typography>}
                        <Button fullWidth startIcon={<AddIcon />} onClick={handleSubmit} variant='contained'>Add Transaction</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}