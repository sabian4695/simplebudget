import React from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {useRecoilValue} from "recoil";
import {transactions} from "../recoil/tableAtoms";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Unstable_Grid2";
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import {budgetDetails} from "../recoil/tableAtoms";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function TransactionsPage() {
    const transactionsArray = useRecoilValue(transactions)
    const budgetArray = useRecoilValue(budgetDetails)
    return (
        <>
            <Stack spacing={1} alignItems="center">
                <Typography sx={{alignSelf:'flex-start'}} color='text.secondary' variant='h6'>Transactions</Typography>
                <Box sx={{width:'100%'}}>
                    <Paper elevation={5} sx={{width:'100%'}}>
                        <List dense>
                            <ListItem disablePadding>
                                <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>This Month</Typography>
                            </ListItem>
                        {transactionsArray.map((row) => (
                            <>
                                <Divider/>
                                <ListItem disablePadding key={row.recordID}>
                                    <ListItemButton>
                                        <Grid xs={12} container columnSpacing={2} alignItems='center'>
                                            <Grid xs={9}><ListItemText primary={row.title} secondary={dayjs(row.transactionDate).format('MMM DD')}/></Grid>
                                            <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>{ (row.transactionType === 'expense' ? '-' : '+') +  formatter.format(row.amount)}</Typography></Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ))}
                        </List>
                    </Paper>
                </Box>
            </Stack>
        </>
    )
}