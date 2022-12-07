import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addCategory, addTransaction} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";
import {v4 as uuidv4} from "uuid";
import dayjs, {Dayjs} from "dayjs";
import {categories, currentBudget, transactions} from "../../recoil/tableAtoms";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputAdornment from "@mui/material/InputAdornment";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddTransaction() {
    const [addNewTransaction, setAddNewTransaction] = useRecoilState(addTransaction);
    const [transactionAmount, setTransactionAmount] = React.useState(null)
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
    const setTransactionsArray = useSetRecoilState(transactions)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const currentBudgetID = useRecoilValue(currentBudget)
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
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (verifyInputs()) {
            let newCategory = {
                recordID: uuidv4(),
                budgetID: currentBudgetID,
                categoryID: transactionCategory !== null ? transactionCategory.id : '',
                amount: transactionAmount !== null ? transactionAmount : 0,
                title: transactionTitle,
                transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : 0,
                transactionType: transactionType,
            };
            setTransactionsArray(prevState => [...prevState, newCategory]);
            setAddNewTransaction(false)
            setSnackSev('success')
            setSnackText('Transaction Added!')
            setSnackOpen(true)
        }
    }
    React.useEffect(() => {
        if (addTransaction) return;
        setTransactionTitle('')
        setTransactionAmount(null)
        setTransactionType('expense')
        setTransactionCategory(null)
        setTransactionDate(dayjs())
        setErrorText('')
    }, [])
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
                                <TextField
                                    autoFocus
                                    fullWidth
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
                                    value={transactionTitle}
                                    onChange={(event: any) => setTransactionTitle(event.target.value)}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={transactionType}
                                    fullWidth
                                    exclusive
                                    onChange={handleTypeChange}
                                >
                                    <ToggleButton value="income">Income</ToggleButton>
                                    <ToggleButton value="expense">Expense</ToggleButton>
                                </ToggleButtonGroup>
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
                                        renderInput={(params) => <TextField {...params} margin="dense" fullWidth/>}
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
                        <Button fullWidth onClick={handleSubmit} variant='contained'>Add Transaction</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}