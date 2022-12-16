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
import {snackBarOpen, snackBarSeverity, snackBarText, dialogPaperStyles, currentUser} from "../../recoil/globalItems";
import {budgets, currentBudgetAndMonth} from "../../recoil/tableAtoms";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../LoginPage";
import AddIcon from "@mui/icons-material/Add";

export default function AddBudget() {
    const [addNewBudget, setAddNewBudget] = useRecoilState(addBudget);
    const [budgetName, setBudgetName] = React.useState('');
    const [currentBudgetDetails, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const [budgetArray, setBudgetArray] = useRecoilState(budgets)
    const currentUserDetails = useRecoilValue(currentUser)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const handleSubmit = async(event: any) => {
        event.preventDefault();
        let newBudget = {
            recordID: uuidv4(),
            creatorID: currentUserDetails.recordID,
            budgetName: budgetName,
        }
        await supaNewBudget(newBudget)
        setBudgetArray(prevState => [...prevState, newBudget]);
        console.log(newBudget)
        console.log(budgetArray)
        let currentBudget = {
            budgetID: newBudget.recordID,
            year: currentBudgetDetails.year,
            month: currentBudgetDetails.month,
        }
        localStorage.setItem('currentBudget', JSON.stringify(currentBudget))
        setCurrentBudget(currentBudget)
        setAddNewBudget(false)
        setSnackSev('success')
        setSnackText('Budget Added!')
        setSnackOpen(true)
    }
    async function supaNewBudget(newBudgetData: any) {
        const { data, error } = await supabase
            .from('budgets')
            .insert(newBudgetData)
        console.log(error)
    }
    React.useEffect(() => {
        if (addNewBudget) return;
        setBudgetName('')
    }, [addNewBudget])
    return (
        <>
            <Dialog open={addNewBudget}
                    onClose={() => setAddNewBudget(false)}
                    scroll='paper'
                    PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle>New Budget</DialogTitle>
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
                    <DialogActions>
                        <Button fullWidth startIcon={<AddIcon />} variant='contained' type='submit'>Add Budget</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}