import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {areYouSure, currentTransaction, editTransaction} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
    areYouSureAccept,
    areYouSureDetails,
    areYouSureTitle,
    dialogPaperStyles,
    snackBarOpen,
    snackBarSeverity,
    snackBarText,
    mainLoading
} from "../../recoil/globalItems";
import dayjs, {Dayjs} from "dayjs";
import {categories, transactions, sections} from "../../recoil/tableAtoms";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputAdornment from "@mui/material/InputAdornment";
import {supabase} from "../LoginPage";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
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

export default function EditTransaction() {
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const [openEditTransaction, setOpenEditTransaction] = useRecoilState(editTransaction);
    const currentTransactionID = useRecoilValue(currentTransaction)
    const [transactionsArray, setTransactionsArray] = useRecoilState(transactions)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const currentTransactionDetails = transactionsArray.find(x => x.recordID === currentTransactionID)
    const [transactionAmount, setTransactionAmount] = React.useState(0.00)
    const [transactionTitle, setTransactionTitle] = React.useState('')
    const [transactionCategory, setTransactionCategory] = React.useState<any>(null);
    const [transactionType, setTransactionType] = React.useState('expense')
    const [transactionDate, setTransactionDate] = React.useState<Dayjs | null>(dayjs())
    const [areYouSureOpen, setAreYouSureOpen] = useRecoilState(areYouSure);
    const setCheckTitle = useSetRecoilState(areYouSureTitle);
    const setCheckDetails = useSetRecoilState(areYouSureDetails);
    const [checkAccept, setCheckAccept] = useRecoilState(areYouSureAccept);
    const [deleteTrans, setDeleteTrans] = React.useState(false)
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const moreOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleDoubleCheck() {
        setDeleteTrans(true)
        setAnchorEl(null);
        let transDetails = 'Title: '
        if(currentTransactionDetails !== undefined) {
            transDetails = transDetails + currentTransactionDetails.title
        }
        setCheckTitle('Are you sure you want to delete this transaction?')
        setCheckDetails(transDetails)
        setAreYouSureOpen(true)
    }

    React.useEffect(() => {
        if(!areYouSureOpen) {
            if(checkAccept) {
                handleDelete()
            }
            setDeleteTrans(false)
        }
    }, [areYouSureOpen])

    async function handleDelete() {
        setErrorText('')
        if(!deleteTrans) {
            return
        }
        setLoadingOpen(true)
        let { error } = await supabase
            .from('transactions')
            .delete()
            .eq('recordID', currentTransactionID)
        if (error) {
            setLoadingOpen(false)
            setErrorText(error.message)
            return
        }
        let newArr = transactionsArray.filter(function(el) { return el.recordID !== currentTransactionID; });
        setTransactionsArray(newArr);
        setOpenEditTransaction(false)
        setLoadingOpen(false)
        setSnackSev('success')
        setSnackText('Transaction deleted')
        setSnackOpen(true)
        setCheckAccept(false)
        setDeleteTrans(false)
    }
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
        setErrorText('')
        console.log(transactionCategory)
        if (verifyInputs()) {
            setLoadingOpen(true)
            let { error } = await supabase
                .from('transactions')
                .update({
                    categoryID: transactionCategory === null ? null : transactionCategory.id,
                    //@ts-ignore
                    amount: transactionAmount === '' ? 0 : transactionAmount,
                    title: transactionTitle,
                    transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : dayjs().valueOf(),
                    transactionType: transactionType,
                })
                .eq('recordID', currentTransactionID)
            if (error) {
                setErrorText(error.message)
                setLoadingOpen(false)
                return
            }
            let newArr = transactionsArray.map(obj => {
                if (obj.recordID === currentTransactionID) {
                    return {...obj,
                        categoryID: transactionCategory === null ? null : transactionCategory.id,
                        //@ts-ignore
                        amount: transactionAmount === '' ? 0 : transactionAmount,
                        title: transactionTitle,
                        transactionDate: dayjs(transactionDate).valueOf() !== null ? dayjs(transactionDate).valueOf() : 0,
                        transactionType: transactionType,
                    };
                }
                return obj;
            });
            setTransactionsArray(newArr);
            setOpenEditTransaction(false)
            setLoadingOpen(false)
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
            setTransactionCategory(categoryGroups.find(x => x.id === currentTransactionDetails.categoryID))
            setTransactionDate(dayjs(currentTransactionDetails.transactionDate))
        }
        setErrorText('')
    }, [openEditTransaction])
    return (
        <>
            <Dialog open={openEditTransaction}
                    onClose={() => setOpenEditTransaction(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <IconButton
                                size='small'
                                aria-label="more"
                                aria-controls={moreOpen ? 'long-menu' : undefined}
                                aria-expanded={moreOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon/>
                            </IconButton>
                            <div>Edit Transaction</div>
                        </Stack>
                        <IconButton onClick={() => setOpenEditTransaction(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <ToggleButtonGroup
                                    color="success"
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
                            <Grid size={{ xs: 7, md: 12 }}>
                                <TextField
                                    autoFocus
                                    onFocus={handleFocus}
                                    fullWidth
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
                                            textField: (params) => <TextField {...params} onFocus={handleFocus} fullWidth/>,
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
                                    label="Title"
                                />
                            </Grid>
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
                        </Grid>
                    </DialogContent>
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<SaveIcon />} variant='contained' type='submit'>Save Changes</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={moreOpen}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDoubleCheck}>
                    <DeleteIcon/>
                    Delete
                </MenuItem>
            </Menu>
        </>
    )
}