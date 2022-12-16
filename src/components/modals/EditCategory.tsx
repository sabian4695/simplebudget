import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentCategory, currentSection, editCategory} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";
import {v4 as uuidv4} from "uuid";
import {categories, sections} from "../../recoil/tableAtoms";
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import {supabase} from "../LoginPage";

export default function EditCategory() {
    const [openEditCategory, setOpenEditCategory] = useRecoilState(editCategory);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryAmount, setCategoryAmount] = React.useState(0);
    const [categoryArray, setCategoryArray] = useRecoilState(categories)
    const currentCategoryID = useRecoilValue(currentCategory);
    let currentCategoryDetails = categoryArray.find(x => x.recordID === currentCategoryID)
    const currentSectionID = useRecoilValue(currentSection);
    const sectionsArray = useRecoilValue(sections);
    const currentSectionName = sectionsArray.find(x => x.recordID === currentSectionID)?.sectionName
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const verifyInputs = () => {
        if (categoryName === '') {
            setErrorText('Please enter a category name')
            return false
        }
        if (categoryAmount === null) {
            setErrorText('You gotta budget some amount!')
            return false
        }
        return true
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        if (verifyInputs()) {
            let { error } = await supabase
                .from('categories')
                .update({
                    categoryName: categoryName,
                    amount: categoryAmount
                })
                .eq('recordID', currentCategoryID)
            console.log(error)
            let newArr = categoryArray.map(obj => {
                if (obj.recordID === currentCategoryID) {
                    return {...obj,
                        categoryName: categoryName,
                        amount: categoryAmount};
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
                    PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle>Edit Category</DialogTitle>
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
                                    autoFocus
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
                    <DialogActions>
                        <Typography color='error' variant="body2">{errorText}</Typography>
                        <Button fullWidth startIcon={<SaveIcon />} variant='contained' type='submit'>Save Changes</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}