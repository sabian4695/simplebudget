import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addTransaction} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {currentUser, dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText, addTransactionCategory, mainLoading, addTransactionType} from "../../recoil/globalItems";
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
import Divider from '@mui/material/Divider';

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

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function AddTransaction() {
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const [splitBool, setSplitBool] = React.useState(false);
    const [addNewTransaction, setAddNewTransaction] = useRecoilState(addTransaction);
    const [transactionAmount, setTransactionAmount] = React.useState(0.00)
    const [transactionTitle, setTransactionTitle] = React.useState('')
    const [transactionCategory, setTransactionCategory] = useRecoilState(addTransactionCategory);
    const [transactionType, setTransactionType] = useRecoilState(addTransactionType);

    let splitArrDef = [
        {
            recId: uuidv4(),
            cat: transactionCategory,
            transAmount: transactionAmount,
        }
      ]
    const [splitArr, setSplitArr] = React.useState(splitArrDef);
    const [transactionDate, setTransactionDate] = React.useState<Dayjs | null>(dayjs())
    const handleTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: string,
    ) => {
        if (newType !== null) {
            //@ts-ignore
            setTransactionType(newType);
        }
    };
    const categoriesArray = useRecoilValue(categories)
    const sectionsArray = useRecoilValue(sections)
    const categoryGroups = categoriesArray.map((option) => {
        const sectionName = sectionsArray.find(x => x.recordID === option.sectionID)?.sectionName
        return {
          sectionName: sectionName === undefined ? "" : sectionName,
          id: option.recordID,
          label: option.categoryName
        };
      }).sort(function(a, b){
        if(a.sectionName < b.sectionName) { return -1; }
        if(a.sectionName > b.sectionName) { return 1; }
        return 0;
        }
    );
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
        if (!verifyInputs()) {
            return
        }
        setLoadingOpen(true)
        if (splitBool) {
            if (transactionAmount - splitArr.reduce((accumulator: any, object) => {
                return accumulator + Number(object.transAmount);
            }, 0).toFixed(2) !== 0) {
                setErrorText('Must allocate full amount!')
                setLoadingOpen(false)
                return
            }          

            let addTransactions = splitArr.map((row) => {
                return {
                    recordID: row.recId,
                    budgetID: currentBudget.budgetID,
                    //@ts-ignore
                    categoryID: row.cat.id,
                    //@ts-ignore
                    amount: Math.round(row.transAmount * 100) / 100,
                    title: transactionTitle + ' ' + transactionAmount + ' split',
                    transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : dayjs().valueOf(),
                    transactionType: transactionType,
                    creatorID: currentUserData.recordID,
                }
            })

            addTransactions.forEach(async(x) => {
                let {error} = await supabase
                    .from('transactions')
                    .insert(x)
                if (error) {
                    setErrorText(error.message)
                    setLoadingOpen(false)
                    return
                }
                //@ts-ignore
                setTransactionsArray(prevState => [...prevState, x]);
            })

            setAddNewTransaction(false)
            setLoadingOpen(false)
            setSnackSev('success')
            setSnackText('Transactions Added!')
            setSnackOpen(true)
            return
        } //the typical un-split transaction
        let newTransaction = {
            recordID: uuidv4(),
            budgetID: currentBudget.budgetID,
            //@ts-ignore
            categoryID: transactionCategory === null ? null : transactionCategory.id,
            //@ts-ignore
            amount: transactionAmount === '' ? 0 : Math.round(transactionAmount * 100) / 100,
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
            setLoadingOpen(false)
            return
        }
        //@ts-ignore
        setTransactionsArray(prevState => [...prevState, newTransaction]);
        setAddNewTransaction(false)
        setLoadingOpen(false)
        setSnackSev('success')
        setSnackText('Transaction Added!')
        setSnackOpen(true)
    }
    function addSplit() {
        let newCat = {
            recId: uuidv4(),
            cat: null,
            transAmount: 0,
        }
        setSplitArr(prevState => [...prevState, newCat]);
    }
    function deleteSplitCat(splitRecId: any) {
        setSplitArr(splitArr.filter(function(el) { return el.recId !== splitRecId; }));
    }
    function changeSplitAmount(splitRecId: string, newVal: any) {
        let newArr = splitArr.map(obj => {
            if (obj.recId === splitRecId) {
                return {...obj,transAmount: newVal}
            }
            return obj;
        })
        //@ts-ignore
        setSplitArr(newArr);
    }
    function changeSplitCat(splitRecId: string, newVal: any) {
        let newArr = splitArr.map(obj => {
            if (obj.recId === splitRecId) {
                return {...obj,cat: newVal}
            }
            return obj;
        })
        //@ts-ignore
        setSplitArr(newArr);
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
        //@ts-ignore
        setTransactionType('expense')
        setTransactionCategory(null)
        setTransactionDate(dayjs())
        setSplitBool(false)
        setSplitArr(splitArrDef)
        setErrorText('')
    }, [addNewTransaction])
    React.useEffect(() => {
        if (!splitBool) return;
        //@ts-ignore
        setTransactionType('expense')
        //@ts-ignore
        setSplitArr(splitArr.map(obj => {
            return {...obj, cat: transactionCategory}
        }))
    }, [splitBool])
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
                        New Transaction 
                        <ToggleButton
                            value="check"
                            selected={splitBool}
                            size='medium'
                            color="error"
                            onChange={() => {
                                setSplitBool(!splitBool);
                            }}>
                            Split
                        </ToggleButton>
                        <IconButton onClick={() => setAddNewTransaction(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {splitBool ? 
                            <>
                                <Grid size={12}><Typography variant='subtitle2'>{"Left to track: " + formatter.format(transactionAmount - splitArr.reduce((accumulator, object) => {
                                        return accumulator + Number(object.transAmount);
                                    }, 0))}</Typography></Grid>
                            </>
                            :
                            <Grid size={12}>
                                <ToggleButtonGroup
                                    color="success"
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
                            }
                            <Grid size={{ xs: 7, md: 12 }}>
                                <TextField
                                    onFocus={handleFocus}
                                    fullWidth
                                    autoFocus
                                    value={transactionAmount}
                                    onChange={(event: any) => setTransactionAmount(event.target.value)}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    inputProps={{step:'.01'}}
                                    placeholder='Amount'
                                    label={splitBool ? "Total Amount" : "Amount"}
                                />
                            </Grid>
                            <Grid size={{ xs: 5, md: 12 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        closeOnSelect
                                        label="Date"
                                        value={transactionDate}
                                        onChange={(newValue) => {
                                            setTransactionDate(newValue);
                                        }}
                                        slotProps={{
                                            actionBar: {actions: ['today']},
                                            textField: (params) => <TextField onFocus={handleFocus} {...params} fullWidth />,
                                        }}
                                        sx={{width: '100%'}}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    onFocus={handleFocus}
                                    value={transactionTitle}
                                    onChange={(event: any) => setTransactionTitle(event.target.value)}
                                    type="text"
                                    label={splitBool ? "Overall Title" : "Title"}
                                    required
                                />
                            </Grid>
                            {splitBool ? 
                            <></>
                            :
                            <Grid size={12}>
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
                                    renderInput={(params) => <TextField onFocus={handleFocus} margin="none" {...params} label="Category"/>}
                                    renderGroup={(params) => (
                                        <li>
                                          <GroupHeader>{params.group}</GroupHeader>
                                          <GroupItems>{params.children}</GroupItems>
                                        </li>
                                      )}
                                />
                            </Grid>
                            }
                            {splitBool ? 
                                <Grid container spacing={1}>
                                    <Grid size={12}><Divider variant="middle" /></Grid>
                                    {splitArr.map((x) => (
                                    <>
                                        <Grid size={4} key={x.recId}>
                                            <TextField
                                                onFocus={handleFocus}
                                                fullWidth
                                                autoFocus
                                                size='small'
                                                value={x.transAmount}
                                                onChange={(event: any) => changeSplitAmount(x.recId, event.target.value)}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                inputProps={{step:'.01'}}
                                                placeholder='Amount'
                                                label="Amount"
                                                variant='filled'
                                                required
                                            />
                                        </Grid>
                                        <Grid size={7}>
                                            <Autocomplete
                                                disablePortal={false}
                                                options={categoryGroups}
                                                getOptionLabel={(option) => option.label}
                                                groupBy={(option) => option.sectionName}
                                                fullWidth
                                                size='small'
                                                value={x.cat}
                                                onChange={(event: any, newValue: any) => {
                                                    changeSplitCat(x.recId, newValue)
                                                }}
                                                renderInput={(params) => <TextField variant='filled' required onFocus={handleFocus} margin="none" {...params} label="Category"/>}
                                                renderGroup={(params) => (
                                                    <li>
                                                    <GroupHeader>{params.group}</GroupHeader>
                                                    <GroupItems>{params.children}</GroupItems>
                                                    </li>
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={1}>
                                            <IconButton size='small' onClick={() => deleteSplitCat(x.recId)}><CloseIcon/></IconButton>
                                        </Grid>
                                    </>
                                    ))}
                                    <Grid size={12}>
                                        <Button fullWidth color='secondary' onClick={addSplit} startIcon={<AddIcon fontSize='small' />}>Add Category Split</Button>
                                    </Grid>
                                </Grid>
                                :
                                <></>
                            }
                            
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
