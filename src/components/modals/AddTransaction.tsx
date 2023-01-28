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
import {categories, currentBudgetAndMonth, sections, transactions} from "../../recoil/tableAtoms";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import {supabase} from "../LoginPage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, lighten, darken } from '@mui/system';

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === 'light'
        ? lighten(theme.palette.primary.light, 0.85)
        : darken(theme.palette.primary.main, 0.8),
  }));

  const GroupItems = styled('ul')({
    padding: 0,
  });

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
    const sectionsArray = useRecoilValue(sections)
    const categoryArray = categoriesArray.map((row) => (
        {
            id: row.recordID,
            label: row.categoryName
        }
    ))
    const categoryGroups = categoriesArray.map((option) => {
        const sectionName = sectionsArray.find(x => x.recordID === option.sectionID)?.sectionName
        return {
          sectionName: sectionName === undefined ? "" : sectionName,
          id: option.recordID,
          label: option.categoryName
        };
      });
    const setTransactionsArray = useSetRecoilState(transactions)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const currentBudget = useRecoilValue(currentBudgetAndMonth)
    const currentUserData = useRecoilValue(currentUser)
    const [errorText, setErrorText] = React.useState('')
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const verifyInputs = () => {
        if (transactionTitle === '' || transactionTitle === null) {
            setErrorText('Please enter a title')
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
        if (currentBudget.budgetID === undefined) {
            setErrorText('You need to create a budget first! Go to the settings page, click \'Select Budget\'')
            return
        }
        setErrorText('')
        if (verifyInputs()) {
            let newTransaction = {
                recordID: uuidv4(),
                budgetID: currentBudget.budgetID,
                categoryID: transactionCategory === null ? null : transactionCategory.id,
                //@ts-ignore
                amount: transactionAmount === '' ? 0 : transactionAmount,
                title: transactionTitle,
                transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : dayjs().valueOf(),
                transactionType: transactionType,
                creatorID: currentUserData.recordID,
            };
            let {error} = await supabase
                .from('transactions')
                .insert(newTransaction)
            if (error) {
                setErrorText(error.message)
                return
            }
            setTransactionsArray(prevState => [...prevState, newTransaction]);
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
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        New Transaction <IconButton onClick={() => setAddNewTransaction(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={0}>
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="standard"
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
                                    fullWidth
                                    autoFocus
                                    onFocus={handleFocus}
                                    margin='normal'
                                    value={transactionTitle}
                                    onChange={(event: any) => setTransactionTitle(event.target.value)}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
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
                                <Autocomplete
                                    disablePortal={false}
                                    options={categoryGroups}
                                    getOptionLabel={(option) => option.label}
                                    groupBy={(option) => option.sectionName}
                                    fullWidth
                                    value={transactionCategory}
                                    onChange={(event: any, newValue: any) => {
                                        setTransactionCategory(newValue)
                                    }}
                                    renderInput={(params) => <TextField onFocus={handleFocus} margin="dense" {...params} label="Category"/>}
                                    renderGroup={(params) => (
                                        <li>
                                          <GroupHeader>{params.group}</GroupHeader>
                                          <GroupItems>{params.children}</GroupItems>
                                        </li>
                                      )}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        closeOnSelect
                                        label="Date"
                                        value={transactionDate}
                                        onChange={(newValue) => {
                                            setTransactionDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField onFocus={handleFocus} {...params} margin="normal" fullWidth/>}
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
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<AddIcon />} type='submit' variant='contained'>Add Transaction</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}