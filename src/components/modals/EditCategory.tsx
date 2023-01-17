import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentCategory, currentSection, editCategory, areYouSure} from '../../recoil/modalStatusAtoms'
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
    snackBarText
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

export default function EditCategory() {
    const [openEditCategory, setOpenEditCategory] = useRecoilState(editCategory);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryAmount, setCategoryAmount] = React.useState(0);
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
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
    React.useEffect(() => {
        if (!openEditCategory) return;
            if (currentCategoryDetails) {
                setCategoryName(currentCategoryDetails.categoryName)
                setCategoryAmount(currentCategoryDetails.amount)
            }
        setErrorText('')
    }, [openEditCategory])
    return (
        <>
            <Dialog open={openEditCategory}
                    onClose={() => setOpenEditCategory(false)}
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
                            <div>Edit Category</div>
                        </Stack>
                        <IconButton onClick={() => setOpenEditCategory(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Typography>Section: {currentSectionName}</Typography>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    onFocus={handleFocus}
                                    value={categoryName}
                                    onChange={(event: any) => setCategoryName(event.target.value)}
                                    type="text"
                                    label="Category Name"
                                />
                            </Grid>
                            <Grid xs={12}>
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