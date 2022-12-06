import React from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

export default function TransactionsPage() {

    return (
        <>
            <Stack spacing={1} alignItems="center">
                <Typography sx={{alignSelf:'flex-start'}} color='text.secondary' variant='h6'>Transactions</Typography>
                <Paper elevation={5} sx={{width:'100%'}}>
                    Stuff to display
                </Paper>
            </Stack>
        </>
    )
}