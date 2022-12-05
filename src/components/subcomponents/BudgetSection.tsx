import React from 'react';
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import {budgetDetails, transactions, categories, sections} from '../../recoil/tableAtoms'

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function createData(
    category: string,
    amount: number,
    remaining: number,
) {
    return {category, amount, remaining};
}

const rows = [
    createData('Tithe', 420.29, 6.0),
    createData('Giving', 100, 9.0),
];

const rows1 = [
    createData('Mortgage', 1545.35, 0),
    createData('Water', 0, 0),
    createData('Electricity', 98, 0),
    createData('Internet', 100, 9.0),
    createData('Trash', 100, 9.0),
    createData('Gas', 100, 9.0),
    createData('Security System', 100, 9.0),
];

export default function BudgetSection() {

    return (
        <>
            <Paper elevation={5}>
                <Box sx={{width:'100%'}}>
                    <List sx={{width:'100%',pb:0.5}}>
                        <ListItem disablePadding>
                            <Grid xs={12} container sx={{px:1, pb:0, mb:0}} columnSpacing={2}>
                                <Grid xs={6}><Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600' }}>Income</Typography></Grid>
                                <Grid xs={3} sx={{textAlign:'right',pt:2}}><Typography color='text.disabled' variant="subtitle2">Planned</Typography></Grid>
                                <Grid xs={3} sx={{textAlign:'right',pt:2}}><Typography color='text.disabled' variant="subtitle2">Remaining</Typography></Grid>
                            </Grid>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <Grid xs={12} container columnSpacing={2}>
                                    <Grid xs={6}><Typography variant='body2'>Nifco</Typography></Grid>
                                    <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>{formatter.format(22)}</Typography></Grid>
                                    <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>$20.00</Typography></Grid>
                                </Grid>
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <Grid xs={12} container columnSpacing={2}>
                                    <Grid xs={6}><Typography variant='body2'>Mikayla Brown Counseling LLC</Typography></Grid>
                                    <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>$100.00</Typography></Grid>
                                    <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>$0.00</Typography></Grid>
                                </Grid>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Button size='small' variant='text' sx={{mx:0.5, mb:0.5}}>Add Category</Button>
                </Box>
            </Paper>
        </>
    )
}