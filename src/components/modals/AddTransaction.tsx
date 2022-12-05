import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useSetRecoilState} from "recoil";
import {addTransaction} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {snackBarOpen, snackBarSeverity, snackBarText} from "../../recoil/globalItems";

export default function AddTransaction() {
    const [addNewTransaction, setAddNewTransaction] = useRecoilState(addTransaction);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setAddNewTransaction(false)
        setSnackSev('success')
        setSnackText('Category Added!')
        setSnackOpen(true)
    }
    return (
        <>
            <Dialog open={addNewTransaction}
                    onClose={() => setAddNewTransaction(false)}
                    scroll='paper'
            >
                <Box sx={{bgcolor: 'background.paper'}}>
                    <DialogTitle>New Transaction</DialogTitle>
                    <DialogContent dividers>
                        <Grid container>
                            <TextField></TextField>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {<Typography color='error' variant="body2">{errorText}</Typography>}
                        <Button fullWidth onClick={handleSubmit} variant='outlined'>Add Transaction</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}