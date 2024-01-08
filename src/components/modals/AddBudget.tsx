import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addBudget} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {snackBarOpen, snackBarSeverity, snackBarText, dialogPaperStyles, currentUser, mainLoading} from "../../recoil/globalItems";
import {budgets, currentBudgetAndMonth} from "../../recoil/tableAtoms";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../LoginPage";
import GrabBudgetData from "../extras/GrabBudgetData";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function AddBudget() {
    const { grabBudgetData } = GrabBudgetData();
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const [addNewBudget, setAddNewBudget] = useRecoilState(addBudget);
    const [budgetName, setBudgetName] = React.useState('');
    const [errorText, setErrorText] = React.useState('');
    const [currentBudgetDetails, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const setBudgetArray = useSetRecoilState(budgets)
    const currentUserDetails = useRecoilValue(currentUser)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const handleSubmit = async(event: any) => {
        event.preventDefault();
        setErrorText('')
        if (budgetName === '' || budgetName === null) {
            setErrorText('Please enter a name')
            return
        }
        setLoadingOpen(true)
        let newBudget = {
            recordID: uuidv4(),
            creatorID: currentUserDetails.recordID,
            budgetName: budgetName,
        }
        const {error} = await supabase
            .from('budgets')
            .insert(newBudget)
        if (error) {
            setLoadingOpen(false)
            setErrorText(error.message)
            return
        }
        setBudgetArray(prevState => [...prevState, newBudget]);
        let currentBudget = {
            budgetID: newBudget.recordID,
            year: currentBudgetDetails.year,
            month: currentBudgetDetails.month,
        }
        localStorage.setItem('currentBudget', JSON.stringify(currentBudget))
        setCurrentBudget(currentBudget)
        await grabBudgetData(currentBudget.budgetID, currentBudgetDetails.year, currentBudgetDetails.month)
        setAddNewBudget(false)
        setLoadingOpen(false)
        setSnackSev('success')
        setSnackText('Budget Added!')
        setSnackOpen(true)
    }
    React.useEffect(() => {
        if (addNewBudget) return;
        setBudgetName('')
        setErrorText('')
    }, [addNewBudget])
    return (
        <>
            <Dialog open={addNewBudget}
                    onClose={() => setAddNewBudget(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        New Budget<IconButton onClick={() => setAddNewBudget(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    value={budgetName}
                                    onChange={(event: any) => setBudgetName(event.target.value)}
                                    type="text"
                                    label="Budget Name"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<AddIcon />} variant='contained' type='submit'>Add Budget</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}