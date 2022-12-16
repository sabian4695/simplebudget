import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentTransaction, editTransaction} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {currentUser, dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";
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
import SaveIcon from "@mui/icons-material/Save";

export default function EditTransaction() {
    const [openEditTransaction, setOpenEditTransaction] = useRecoilState(editTransaction);
    const currentTransactionID = useRecoilValue(currentTransaction)
    const [transactionsArray, setTransactionsArray] = useRecoilState(transactions)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const currentBudget = useRecoilValue(currentBudgetAndMonth)
    const currentUserData = useRecoilValue(currentUser)
    const [errorText, setErrorText] = React.useState('')
    const currentTransactionDetails = transactionsArray.find(x => x.recordID === currentTransactionID)
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
            let { error } = await supabase
                .from('transactions')
                .update({
                    categoryID: transactionCategory !== null ? transactionCategory.id : '',
                    amount: transactionAmount,
                    title: transactionTitle,
                    transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : dayjs().valueOf(),
                    transactionType: transactionType,
                })
                .eq('recordID', currentTransactionID)
            console.log(error)
            let newArr = transactionsArray.map(obj => {
                if (obj.recordID === currentTransactionID) {
                    return {...obj,
                        categoryID: transactionCategory !== null ? transactionCategory.id : '',
                        amount: transactionAmount,
                        title: transactionTitle,
                        transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : 0,
                        transactionType: transactionType,
                    };
                }
                return obj;
            });
            setTransactionsArray(newArr);
            setOpenEditTransaction(false)
            setSnackSev('success')
            setSnackText('Transaction updated!')
            setSnackOpen(true)
        }
    }
    const handleFocus = (event: any) => {
        if (event) {
            event.target.select()
        }
    };
    React.useEffect(() => {
        if (!openEditTransaction) return;
            if (currentTransactionDetails) {
                setTransactionTitle(currentTransactionDetails.title)
                setTransactionAmount(currentTransactionDetails.amount)
                setTransactionType(currentTransactionDetails.transactionType)
                setTransactionCategory(categoryArray.find(x => x.id === currentTransactionDetails.categoryID))
                setTransactionDate(dayjs(currentTransactionDetails.transactionDate))
            }
        setErrorText('')
    }, [openEditTransaction])
    return (
        <>
            <Dialog open={openEditTransaction}
                    onClose={() => setOpenEditTransaction(false)}
                    scroll='paper'
                    PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={1}>
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={transactionType}
                                    fullWidth
                                    onFocus={handleFocus}
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
                                    inputProps={{step:'.01'}}
                                    placeholder='Amount'
                                    label="Amount"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    onFocus={handleFocus}
                                    margin='normal'
                                    value={transactionTitle}
                                    onChange={(event: any) => setTransactionTitle(event.target.value)}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Autocomplete
                                    disablePortal={false}
                                    options={categoryArray}
                                    getOptionLabel={(option) => option.label}
                                    fullWidth
                                    value={transactionCategory}
                                    onChange={(event: any, newValue: any) => {
                                        setTransactionCategory(newValue)
                                    }}
                                    renderInput={(params) => <TextField onFocus={handleFocus} margin="dense" {...params} label="Category"/>}
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
                                        renderInput={(params) => <TextField {...params} onFocus={handleFocus} margin="normal" fullWidth/>}
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
                        <Button fullWidth startIcon={<SaveIcon />} variant='contained' type='submit'>Save Changes</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}