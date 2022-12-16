import React from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {useSetRecoilState, useRecoilValue} from "recoil";
import {categories, transactions} from "../recoil/tableAtoms";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Unstable_Grid2";
import List from '@mui/material/List';
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import EditTransaction from "./modals/EditTransaction";
import {currentTransaction, editTransaction} from "../recoil/modalStatusAtoms";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function TransactionsPage() {
    const transactionsArray = useRecoilValue(transactions)
    const categoryArray = useRecoilValue(categories)
    const setCurrentTransaction = useSetRecoilState(currentTransaction)
    const setOpenEditTransaction = useSetRecoilState(editTransaction)
    const openTransaction = (trsID: string) => {
        setCurrentTransaction(trsID)
        setOpenEditTransaction(true)
    }
    return (
        <>
            <Stack spacing={2} alignItems="center">
                <Typography sx={{alignSelf:'flex-start'}} color='text.secondary' variant='h6'>Transactions</Typography>
                <Box sx={{width:'100%'}}>
                    <Paper elevation={5} sx={{width:'100%'}}>
                        <List dense>
                            <ListItem disablePadding>
                                <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>This Month</Typography>
                            </ListItem>
                        {transactionsArray.map((row) => (
                            <>
                                <Divider key={row.recordID}/>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => openTransaction(row.recordID)}>
                                        <Grid xs={12} container columnSpacing={2} alignItems='center'>
                                            <Grid xs="auto">
                                                <Avatar>{dayjs(row.transactionDate).format('MMM DD')}</Avatar>
                                            </Grid>
                                            <Grid xs={6} sx={{flexGrow:1}}>
                                                <Typography sx={{mt:0.5}} variant='body1'>{row.title}</Typography>
                                                <Chip size='small' label={categoryArray.find(x => x.recordID === row.categoryID)?.categoryName}/>
                                            </Grid>
                                            <Grid xs="auto" sx={{textAlign:'right'}}>
                                                <Typography variant='body1'>{ (row.transactionType === 'expense' ? '-' : '+') +  formatter.format(row.amount)}</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ))}
                        </List>
                    </Paper>
                </Box>
            </Stack>
            <EditTransaction/>
        </>
    )
}