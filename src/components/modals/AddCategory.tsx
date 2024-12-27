import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addCategory, currentSection} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText, mainLoading} from "../../recoil/globalItems";
import {v4 as uuidv4} from "uuid";
import {categories, sections} from "../../recoil/tableAtoms";
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from "@mui/icons-material/Add";
import {supabase} from "../LoginPage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function AddCategory() {
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const [addNewCategory,setAddNewCategory] = useRecoilState(addCategory);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryAmount, setCategoryAmount] = React.useState(0);
    const setCategoryArray = useSetRecoilState(categories)
    const currentSectionID = useRecoilValue(currentSection);
    const sectionsArray = useRecoilValue(sections);
    const currentSectionName = sectionsArray.find(x => x.recordID === currentSectionID)?.sectionName
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
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
            setLoadingOpen(true)
            let newCategory = {
                recordID: uuidv4(),
                sectionID: currentSectionID,
                categoryName: categoryName,
                //@ts-ignore
                amount: categoryAmount === '' ? 0 : Number(categoryAmount)
            };
            let {error} = await supabase
                .from('categories')
                .insert(newCategory)
            if (error) {
                setLoadingOpen(false)
                setErrorText(error.message)
                return
            }
            setCategoryArray(prevState => [...prevState, newCategory]);
            setAddNewCategory(false)
            setLoadingOpen(false)
            setSnackSev('success')
            setSnackText('Category Added!')
            setSnackOpen(true)
        }
    }
    const handleFocus = (event: any) => {
        if (event) {
            event.target.select()
        }
    };
    React.useEffect(() => {
        if (addNewCategory) return;
        setCategoryName('')
        setCategoryAmount(0)
        setErrorText('')
    }, [addNewCategory])
    return (
        <>
            <Dialog open={addNewCategory}
                    onClose={() => setAddNewCategory(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        New Category <IconButton onClick={() => setAddNewCategory(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Typography>Adding to: {currentSectionName}</Typography>
                            <Grid size={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    value={categoryName}
                                    onChange={(event: any) => setCategoryName(event.target.value)}
                                    type="text"
                                    label="Category Name"
                                />
                            </Grid>
                            <Grid size={12}>
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
                        <Button fullWidth startIcon={<AddIcon />} variant='contained' type='submit'>Add Category</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}