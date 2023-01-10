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
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function TransactionsPage() {
    const transactionsArray = useRecoilValue(transactions)
    const [filteredTransactions, setFilteredTransactions] = React.useState(transactionsArray)
    React.useEffect(() => {
        filterTransactions(searchText)
    }, [transactionsArray])
    const [searchText, setSearchText] = React.useState('')
    function setText(event: any) {
        setSearchText(event.target.value)
        filterTransactions(event.target.value)
    }
    const filterTransactions = (targetText: string) => {
        if (targetText.length > 0) {
            const filtered = transactionsArray.filter((data) => JSON.stringify({[data.title]: data.amount}).toLowerCase().indexOf(targetText.toLowerCase()) !== -1);
            setFilteredTransactions(filtered)
        } else {
            setFilteredTransactions(transactionsArray)
        }
    }
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
                <TextField
                    fullWidth
                    size='small'
                    variant='filled'
                    value={searchText}
                    onChange={(event: any) => setText(event)}
                    type="search"
                    label="Search Transactions"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {filteredTransactions.filter(x => x.categoryID === null).length > 0 ?
                <Box sx={{width:'100%'}}>
                    <Paper elevation={5} sx={{width:'100%'}}>
                        <List dense>
                            <ListItem disablePadding key={1}>
                                <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>Uncategorized</Typography>
                            </ListItem>
                            {filteredTransactions.filter(x => x.categoryID === null).map((row) => (
                                <>
                                    <Divider/>
                                    <ListItem disablePadding key={row.recordID}>
                                        <ListItemButton onClick={() => openTransaction(row.recordID)}>
                                            <Grid xs={12} container columnSpacing={2} alignItems='center'>
                                                <Grid xs="auto">
                                                    <Avatar>{dayjs(row.transactionDate).format('MMM DD')}</Avatar>
                                                </Grid>
                                                <Grid xs='auto' sx={{flexGrow:1}}>
                                                    <Typography sx={{mt:0.5}} variant='body1'>{row.title}</Typography>
                                                    <Chip size='small' label='Uncategorized' color='warning' />
                                                </Grid>
                                                <Grid xs="auto" sx={{textAlign:'right'}}>
                                                    <Typography variant='body1'>{ (row.transactionType === 'expense' ? '-' : '+') + formatter.format(row.amount)}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            ))}
                        </List>
                    </Paper>
                </Box> : null}
                {filteredTransactions.filter(x => x.categoryID !== null).length > 0 ?
                <Box sx={{width:'100%'}}>
                    <Paper elevation={5} sx={{width:'100%'}}>
                        <List dense>
                            <ListItem disablePadding key={2}>
                                <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>Categorized</Typography>
                            </ListItem>
                        {filteredTransactions.filter(x => x.categoryID !== null).map((row) => (
                            <>
                                <Divider/>
                                <ListItem disablePadding key={row.recordID}>
                                    <ListItemButton onClick={() => openTransaction(row.recordID)}>
                                        <Grid xs={12} container columnSpacing={2} alignItems='center'>
                                            <Grid xs="auto">
                                                <Avatar>{dayjs(row.transactionDate).format('MMM DD')}</Avatar>
                                            </Grid>
                                            <Grid xs='auto' sx={{flexGrow:1}}>
                                                <Typography sx={{mt:0.5}} variant='body1'>{row.title}</Typography>
                                                <Chip size='small' label={categoryArray.find(x => x.recordID === row.categoryID)?.categoryName} color='success' />
                                            </Grid>
                                            <Grid xs="auto" sx={{textAlign:'right'}}>
                                                <Typography variant='body1'>{ (row.transactionType === 'expense' ? '-' : '+') + formatter.format(row.amount)}</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ))}
                        </List>
                    </Paper>
                </Box> :
                    <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '300', ml:1 }}>Nothing here yet!</Typography>
                }
            </Stack>
            <EditTransaction/>
        </>
    )
}