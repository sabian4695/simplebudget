import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addCategory, currentSection} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";
import {v4 as uuidv4} from "uuid";
import {categories, sections} from "../../recoil/tableAtoms";
import InputAdornment from '@mui/material/InputAdornment';

export default function AddCategory() {
    const [addNewCategory,setAddNewCategory] = useRecoilState(addCategory);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryAmount, setCategoryAmount] = React.useState(null);
    const setCategoryArray = useSetRecoilState(categories)
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
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (verifyInputs()) {
            let newCategory = {
                recordID: uuidv4(),
                sectionID: currentSectionID,
                categoryName: categoryName,
                amount: categoryAmount !== null ? categoryAmount : 0,
                categoryType: '',
            };
            setCategoryArray(prevState => [...prevState, newCategory]);
            setAddNewCategory(false)
            setSnackSev('success')
            setSnackText('Category Added!')
            setSnackOpen(true)
        }
    }
    React.useEffect(() => {
        if (addCategory) return;
        setCategoryName('')
        setCategoryAmount(null)
        setErrorText('')
    }, [])
    return (
        <>
            <Dialog open={addNewCategory}
                    onClose={() => setAddNewCategory(false)}
                    scroll='paper'
                    PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle>New Category</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Typography>Adding to: {currentSectionName}</Typography>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
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
                                    value={categoryAmount}
                                    onChange={(event: any) => setCategoryAmount(event.target.value)}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    placeholder='Budget Amount'
                                    label="Budget Amount"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Typography color='error' variant="body2">{errorText}</Typography>
                        <Button fullWidth variant='contained' type='submit'>Add Category</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}