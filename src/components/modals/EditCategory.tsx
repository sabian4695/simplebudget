import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import BalanceIcon from '@mui/icons-material/Balance';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    currentCategory,
    currentSection,
    editCategory,
    areYouSure,
    currentTransaction, editTransaction, addTransaction
} from '../../recoil/modalStatusAtoms'
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
    addTransactionCategory
} from "../../recoil/globalItems";
import {categories, sections, transactions} from "../../recoil/tableAtoms";
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import {supabase} from "../LoginPage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Grow from '@mui/material/Grow';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import GlobalJS from "../extras/GlobalJS"

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
};

export default function EditCategory() {
    const [openEditCategory, setOpenEditCategory] = useRecoilState(editCategory);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryAmount, setCategoryAmount] = React.useState(0);
    const [editMode, setEditMode] = React.useState(false);
    const [categoryArray, setCategoryArray] = useRecoilState(categories)
    const [transactionsArray, setTransactionsArray] = useRecoilState(transactions)
    const currentCategoryID = useRecoilValue(currentCategory);
    let currentCategoryDetails = categoryArray.find(x => x.recordID === currentCategoryID)
    const currentSectionID = useRecoilValue(currentSection);
    const sectionsArray = useRecoilValue(sections);
    const currentSectionName = sectionsArray.find(x => x.recordID === currentSectionID)?.sectionName
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [areYouSureOpen, setAreYouSureOpen] = useRecoilState(areYouSure);
    const setCheckTitle = useSetRecoilState(areYouSureTitle);
    const setCheckDetails = useSetRecoilState(areYouSureDetails);
    const [checkAccept, setCheckAccept] = useRecoilState(areYouSureAccept);
    const [errorText, setErrorText] = React.useState('')
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const moreOpen = Boolean(anchorEl);
    const [categoryDelete, setCategoryDelete] = React.useState(false)
    const [categorySum, setCategorySum] = React.useState(0)
    const setTransactionCategory = useSetRecoilState(addTransactionCategory)
    const setAddNewTransaction = useSetRecoilState(addTransaction)
    const { grabCategorySum } = GlobalJS();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const addNewTransClick = () => {
        setTransactionCategory({
            //@ts-ignore
            sectionName: currentSectionName,
            id: currentCategoryID,
            label: currentCategoryDetails?.categoryName
        })
        setAddNewTransaction(true)
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    function editModeClick() {
        setAnchorEl(null);
        setEditMode(!editMode)
    }
    async function balanceClick() {
        setAnchorEl(null);
        let { error } = await supabase
            .from('categories')
            .update({
                //@ts-ignore
                amount: Math.abs(categorySum) === '' ? 0 : Math.abs(categorySum)
            })
            .eq('recordID', currentCategoryID)
        if (error) {
            setErrorText(error.message)
            return
        }
        let newArr = categoryArray.map(obj => {
            if (obj.recordID === currentCategoryID) {
                return {...obj,
                    amount: Number(Math.abs(categorySum))}
            }
            return obj;
        });
        setCategoryArray(newArr);
        setOpenEditCategory(false)
        setSnackSev('success')
        setSnackText('Category Balanced!')
        setSnackOpen(true)
    }
    async function handleDoubleCheck() {
        setCategoryDelete(true)
        setAnchorEl(null);
        setCheckTitle('Are you sure you want to delete this category?')
        setCheckDetails('WARNING: This will delete all transactions assigned to this category as well.')
        setAreYouSureOpen(true)
    }

    React.useEffect(() => {
        if(!areYouSureOpen) {
            if(checkAccept) {
                handleDelete()
            }
            setCategoryDelete(false)
        }
    }, [areYouSureOpen])

    async function handleDelete() {
        setErrorText('')
        if (!categoryDelete) {
            return
        }
        let { data } = await supabase
            .from('transactions')
            .delete()
            .eq('categoryID', currentCategoryID)
        let { error } = await supabase
            .from('categories')
            .delete()
            .eq('recordID', currentCategoryID)
        if (error) {
            setErrorText(error.message)
            return
        }
        let newCat = categoryArray.filter(function(el) { return el.recordID !== currentCategoryID; });
        setCategoryArray(newCat);

        let newTrans = transactionsArray.filter(function(el) { return el.categoryID !== currentCategoryID; });
        setTransactionsArray(newTrans);

        setOpenEditCategory(false)
        setSnackSev('success')
        setSnackText('Category deleted')
        setSnackOpen(true)
        setCheckAccept(false)
        setCategoryDelete(false)
    }
    const verifyInputs = () => {
        if (categoryName === '' || categoryName === null) {
            setErrorText('Please enter a category name')
            return false
        }
        //@ts-ignore
        if (categoryAmount === null || categoryAmount === '') {
            setCategoryAmount(0)
        }
        return true
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        setErrorText('')
        if (verifyInputs()) {
            let { error } = await supabase
                .from('categories')
                .update({
                    categoryName: categoryName,
                    //@ts-ignore
                    amount: categoryAmount === '' ? 0 : categoryAmount
                })
                .eq('recordID', currentCategoryID)
            if (error) {
                setErrorText(error.message)
                return
            }
            let newArr = categoryArray.map(obj => {
                if (obj.recordID === currentCategoryID) {
                    return {...obj,
                        categoryName: categoryName,
                        amount: Number(categoryAmount)}
                }
                return obj;
            });
            setCategoryArray(newArr);
            setOpenEditCategory(false)
            setSnackSev('success')
            setSnackText('Category updated!')
            setSnackOpen(true)
        }
    }
    const handleFocus = (event: any) => {
        if (event) {
            event.target.select()
        }
    };
    const setCurrentTransaction = useSetRecoilState(currentTransaction)
    const setOpenEditTransaction = useSetRecoilState(editTransaction)
    const openTransaction = (trsID: string) => {
        setCurrentTransaction(trsID)
        setOpenEditTransaction(true)
    }
    React.useEffect(() => {
        if (!openEditCategory) return;
            if (currentCategoryDetails) {
                setCategoryName(currentCategoryDetails.categoryName)
                setCategoryAmount(currentCategoryDetails.amount)
                setEditMode(false)
                setCategorySum(grabCategorySum(currentCategoryID))
            }
        setErrorText('')
    }, [openEditCategory])
    React.useEffect(() => {
        if (!openEditCategory) return;
            if (currentCategoryDetails) {
                setCategorySum(grabCategorySum(currentCategoryID))
            }
    }, [transactionsArray])
    return (
        <>
            <Dialog open={openEditCategory}
                    onClose={() => setOpenEditCategory(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', overflow:'auto', minHeight:'100%'}} component='form' onSubmit={handleSubmit}>
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
                            <Stack spacing={-1}>
                                <Typography variant='overline'>{currentSectionName}</Typography>
                                {editMode ?
                                    <Grow in={editMode}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            variant='filled'
                                            onFocus={handleFocus}
                                            value={categoryName}
                                            onChange={(event: any) => setCategoryName(event.target.value)}
                                            type="text"
                                            label="Category Name"
                                        />
                                    </Grow>
                                    :
                                    <Typography variant='h6'>{categoryName}</Typography>
                                }
                            </Stack>
                        </Stack>
                        <IconButton onClick={() => setOpenEditCategory(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                {editMode ?
                                <TextField
                                    fullWidth
                                    onFocus={handleFocus}
                                    value={categoryAmount}
                                    onChange={(event: any) => setCategoryAmount(event.target.value)}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    inputProps={{
                                        step: 'any'
                                    }}
                                    placeholder='Budget Amount'
                                    label="Budget Amount"
                                />
                                    :
                                    <Stack direction='row' justifyContent='space-between'>
                                        <div>
                                            <Typography variant='subtitle2'>{"Budgeted: " + formatter.format(categoryAmount)}</Typography>
                                            <Typography variant='subtitle2'>{"Tracked: " + formatter.format(categorySum)}</Typography>
                                        </div>
                                        {bigger ? 
                                            <Fab color="secondary" variant='extended' onClick={addNewTransClick}>
                                                <AddIcon /> Add Transaction
                                            </Fab> : null
                                        }
                                    </Stack>
                                }
                            </Grid>
                            <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                            {editMode ?
                                <Grid xs={12}>
                                    <Grow in={editMode}>
                                        <DialogActions>
                                            <Button fullWidth startIcon={<SaveIcon/>} variant='contained' type='submit'>
                                                Save Changes</Button>
                                        </DialogActions>
                                    </Grow>
                                </Grid>
                                : null
                            }
                            <Grid xs={12}>
                                <Paper elevation={5} sx={{width: '100%', borderRadius: 3}}>
                                    <List dense>
                                        {transactionsArray.filter(x => x.categoryID === currentCategoryDetails?.recordID).length > 0 ?
                                            <>
                                            <ListItem disablePadding key="1">
                                                <Typography color='text.secondary' variant='h6'
                                                            sx={{fontWeight: '600', ml: 1}}>Tracked</Typography>
                                            </ListItem>
                                            {transactionsArray.filter(x => x.categoryID === currentCategoryDetails?.recordID).sort(
                                                (a, b) => {
                                                    return b.transactionDate - a.transactionDate;
                                                }
                                            ).map((row) => (
                                                <>
                                                    <Divider/>
                                                    <ListItem disablePadding key={row.recordID}>
                                                        <ListItemButton onClick={() => openTransaction(row.recordID)} sx={{px:0.5}}>
                                                            <Grid xs={12} container columnSpacing={2} alignItems='center'>
                                                                <Grid xs="auto">
                                                                    <Avatar sx={{fontSize: 15, textAlign: 'center', bgcolor: 'primary.light'}}>
                                                                        {dayjs(row.transactionDate).format('MMM DD')}
                                                                    </Avatar>
                                                                </Grid>
                                                                <Grid xs='auto' sx={{flexGrow: 1}}>
                                                                    <Typography sx={{mt: 0.5}}
                                                                                variant='body1'>{row.title}</Typography>
                                                                </Grid>
                                                                <Grid xs="auto" sx={{textAlign: 'right'}}>
                                                                    <Typography
                                                                        variant='body1'>{(row.transactionType === 'expense' ? '-' : '+') + formatter.format(row.amount)}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </ListItemButton>
                                                    </ListItem>
                                                </>
                                            ))}
                                            </>
                                            :
                                            <ListItem disablePadding key="2">
                                                <Typography color='text.secondary' variant='h6'
                                                sx={{fontWeight: '600', ml: 1}}>Nothing Tracked Here</Typography>
                                            </ListItem>
                                        }
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    {bigger ? null :
                        <Fab color="secondary" sx={fabStyle} onClick={addNewTransClick}>
                            <AddIcon />
                        </Fab>
                    }
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
                <MenuItem onClick={editModeClick}>
                    <EditIcon sx={{mr:1}}/>
                    Edit Category
                </MenuItem>
                <MenuItem onClick={balanceClick}>
                    <BalanceIcon sx={{mr:1}}/>
                    Balance Category
                </MenuItem>
                <MenuItem onClick={handleDoubleCheck}>
                    <DeleteIcon sx={{mr:1}}/>
                    Delete Category
                </MenuItem>
            </Menu>
        </>
    )
}