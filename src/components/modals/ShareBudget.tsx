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
import Grid from '@mui/material/Grid2';
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {supabase} from "../LoginPage";
import {v4 as uuidv4} from "uuid";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const handleSubmit = async(event: any) => {
        event.preventDefault();
        setErrorText('')
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
        let {error} = await supabase
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
            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                fullScreen={!bigger}
                PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        Share Budget<IconButton onClick={() => setOpen(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Alert severity="warning">Warning!! Sharing your budget allows the other user to create, view, edit and delete categories, sections, and transactions. You can remove the sharing from this budget in the future, but you cannot undo their actions.</Alert>
                            </Grid>
                            <Grid size={12}>
                                <Alert severity='info'>
                                    To share a budget, you need the user ID of the person to share with.
                                    They go to account settings to copy their user ID.
                                </Alert>
                            </Grid>
                            <Grid size={12}>
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
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<ShareIcon />} type='submit' variant='contained'>Share My Budget</Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </>
    )
}