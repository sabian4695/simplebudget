import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {shareBudget} from "../../recoil/modalStatusAtoms";
import {budgets, currentBudgetAndMonth} from "../../recoil/tableAtoms"
import {currentUser, dialogPaperStyles, snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import {supabase} from "../LoginPage";
import {v4 as uuidv4} from "uuid";

export default function ShareBudget() {
    const [open, setOpen] = useRecoilState(shareBudget)
    const [shareToID, setShareToID] = React.useState('')
    const [errorText, setErrorText] = React.useState('')
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const user = useRecoilValue(currentUser)
    const budgetsArray = useRecoilValue(budgets)
    const [currentBudgetDetails, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const handleSubmit = async(event: any) => {
        event.preventDefault();
        if (shareToID === user.recordID) {
            setErrorText('you can\'t share a budget with yourself')
            return
        }
        if (shareToID === '') {
            setErrorText('please enter a user ID to share with')
            return
        }
        let newShare = {
            recordID: uuidv4(),
            budgetID: currentBudgetDetails.budgetID,
            sharedToID: shareToID
        }
        let {data, error} = await supabase
            .from('shared')
            .insert(newShare)
        if (error) {
            setErrorText(error.message)
            return
        }
        setSnackSev('success')
        setSnackText('Budget Shared Successfully')
        setSnackOpen(true)
        setOpen(false)
    }
    return (
        <>
            <Dialog onClose={() => setOpen(false)} open={open} PaperProps={dialogPaperStyles}>
                <Box sx={{bgcolor: 'background.paper'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle>New Section</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <Alert severity="warning">Warning!! Sharing your budget allows the other user to create, view, edit and delete categories, sections, and transactions. You can remove the sharing from this budget in the future, but you cannot undo their actions.</Alert>
                            </Grid>
                            <Grid xs={12}>
                                <Alert severity='info'>
                                    To share a budget, you need the user ID of the person to share with.
                                    They go to account settings to copy their user ID.
                                </Alert>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    value={shareToID}
                                    onChange={(event: any) => setShareToID(event.target.value)}
                                    type="text"
                                    label="User ID to share with"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {<Typography color='error' variant="body2">{errorText}</Typography>}
                        <Button fullWidth startIcon={<ShareIcon />} type='submit' variant='contained'>Share My Budget</Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </>
    )
}