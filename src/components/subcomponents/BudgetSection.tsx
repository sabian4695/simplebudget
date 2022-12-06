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
import AddCategory from "../modals/AddCategory";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {addCategory, currentCategory} from "../../recoil/modalStatusAtoms";
import {sections, categories, transactions} from "../../recoil/tableAtoms";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function BudgetSection(sectionID: any) {
    const setAddNewCategory = useSetRecoilState(addCategory)
    const setCategory = useSetRecoilState(currentCategory)
    const sectionsArray = useRecoilValue(sections)
    const categoriesArray = useRecoilValue(categories)
    const transactionsArray = useRecoilValue(transactions)
    let section = sectionsArray.find(x => x.recordID === sectionID.sectionID)
    let categoryArray = categoriesArray.filter(x => x.sectionID === sectionID.sectionID)
    let categorySumArray = categoryArray.map((row) => (
        {
            categoryID: row.recordID,
            categorySum: row.amount - (transactionsArray.filter(x => x.categoryID === row.recordID).reduce((accumulator, object) => {
                return accumulator + object.amount;
            }, 0)),
        }
    ))
    console.log(categorySumArray)
    const openAddCategory = (categoryID: string) => {
        setCategory(categoryID)
        setAddNewCategory(true)
    }
    return (
        <>
            <Paper elevation={5}>
                <Box sx={{width:'100%'}}>
                    <List sx={{width:'100%',pb:0.5}}>
                        <ListItem disablePadding>
                            <Grid xs={12} container sx={{px:1, pb:0, mb:0}} columnSpacing={2}>
                                <Grid xs={6}><Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600' }}>{section?.sectionName}</Typography></Grid>
                                <Grid xs={3} sx={{textAlign:'right',pt:2}}><Typography color='text.disabled' variant="subtitle2">Planned</Typography></Grid>
                                <Grid xs={3} sx={{textAlign:'right',pt:2}}><Typography color='text.disabled' variant="subtitle2">Remaining</Typography></Grid>
                            </Grid>
                        </ListItem>
                        {categoryArray.map((row) => (
                            <>
                            <Divider/>
                            <ListItem disablePadding key={row.recordID}>
                                <ListItemButton>
                                    <Grid xs={12} container columnSpacing={2}>
                                        <Grid xs={6}><Typography variant='body2'>{row.categoryName}</Typography></Grid>
                                        <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>{formatter.format(row.amount)}</Typography></Grid>
                                        {/*@ts-ignore*/}
                                        <Grid xs={3} sx={{textAlign:'right'}}><Typography variant='body2'>{formatter.format(categorySumArray.find(x => x.categoryID === row.recordID).categorySum)}</Typography></Grid>
                                    </Grid>
                                </ListItemButton>
                            </ListItem>
                            </>
                            )
                            )}
                    </List>
                    <Button size='small' variant='text' sx={{mx:0.5, mb:0.5}} onClick={() => openAddCategory('')}>Add Category</Button>
                </Box>
            </Paper>
            <AddCategory/>
        </>
    )
}