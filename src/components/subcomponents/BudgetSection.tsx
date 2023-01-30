import React from 'react';
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {addCategory, currentSection, currentCategory, editCategory, editSection, openViewCategory} from "../../recoil/modalStatusAtoms";
import {sections, categories, transactions} from "../../recoil/tableAtoms";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import IconButton from "@mui/material/IconButton";
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";
import {styled} from "@mui/material/styles";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 2,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 100 : 900],
    },
}));

export default function BudgetSection(sectionID: any) {
    const setAddNewCategory = useSetRecoilState(addCategory)
    const setSection = useSetRecoilState(currentSection)
    const setCategory = useSetRecoilState(currentCategory)
    const setOpenEditCategory = useSetRecoilState(editCategory);
    const setOpenEditSection = useSetRecoilState(editSection);
    const sectionsArray = useRecoilValue(sections)
    const categoriesArray = useRecoilValue(categories)
    const transactionsArray = useRecoilValue(transactions)
    const [categoryArray, setCategoryArray] = React.useState(categoriesArray.filter(x => x.sectionID === sectionID.sectionID))
    let section = sectionsArray.find(x => x.recordID === sectionID.sectionID)
    let categorySumArrayInitial = categoryArray.map((row) => (
        {
            categoryID: row.recordID,
            categorySum: row.amount - (transactionsArray.filter(x => x.categoryID === row.recordID).reduce((accumulator, object) => {
                return accumulator + object.amount;
            }, 0)),
        }
    ))
    const [categorySumArray, setCategorySumArray] = React.useState(categorySumArrayInitial)
    React.useEffect(() => {
        setCategoryArray(categoriesArray.filter(x => x.sectionID === sectionID.sectionID))
    }, [categoriesArray])

    React.useEffect(() => {
        setCategorySumArray(categoryArray.map((row) => (
            {
                categoryID: row.recordID,
                categorySum: row.amount - (transactionsArray.filter(x => x.categoryID === row.recordID).reduce((accumulator, object) => {
                    return accumulator + object.amount;
                }, 0)),
            }
        )))
    }, [transactionsArray, categoriesArray, categoryArray])

    const openAddCategory = () => {
        setSection(sectionID.sectionID)
        setAddNewCategory(true)
    }
    const openCategory = (categoryID: string) => {
        setSection(sectionID.sectionID)
        setCategory(categoryID)
        setOpenEditCategory(true)
    }
    const openSection = () => {
        setSection(sectionID.sectionID)
        setOpenEditSection(true)
    }
    function progPercent(idVal: string, rowAmount: number) {
        if(categorySumArray === undefined) {
            return 0
        }
        if (categorySumArray.find(x => x.categoryID === idVal) === undefined) {
            return 0
        }
        if(rowAmount === 0) {
            return 0
        }
        //@ts-ignore
        return (100-(categorySumArray.find(x => x.categoryID === idVal).categorySum/rowAmount)*100)
    }
    return (
        <>
            <Paper elevation={5} sx={{borderRadius:3}}>
                <Box sx={{width:'100%'}}>
                    <List sx={{width:'100%',pb:0.5}}>
                        <ListItem disablePadding key={1}>
                            <Grid xs={12} container sx={{px:1, pb:0, mb:0}} columnSpacing={2}>
                                <Grid xs={5.5}>
                                    <Typography style={{overflow: "hidden", textOverflow: "ellipsis"}} color='text.secondary' variant='h6' sx={{ fontWeight: '600' }}>
                                        {section?.sectionName}
                                    </Typography>
                                </Grid>
                                <Grid xs={3.25} sx={{textAlign:'right',pt:2}}><Typography color='text.disabled' variant="subtitle2">Planned</Typography></Grid>
                                <Grid xs={3.25} sx={{textAlign:'right',pt:2}}><Typography color='text.disabled' variant="subtitle2">Remaining</Typography></Grid>
                            </Grid>
                        </ListItem>
                        {categoryArray.map((row) => (
                            <ListItem disablePadding key={row.recordID}>
                                <ListItemButton onClick={() => openCategory(row.recordID)}>
                                    <Grid xs={12} container columnSpacing={2}>
                                        <Grid xs={5.5}>
                                            <Typography style={{overflow: "hidden", textOverflow: "ellipsis"}} display='inline' variant='body1'>{row.categoryName}</Typography>
                                        </Grid>
                                        <Grid xs={3.25} sx={{textAlign:'right'}}><Typography variant='body1'>{formatter.format(row.amount)}</Typography></Grid>
                                        {/*@ts-ignore*/}
                                        <Grid xs={3.25} sx={{textAlign:'right'}}><Typography variant='body1'>{formatter.format(categorySumArray.find(x => x.categoryID === row.recordID)?.categorySum)}</Typography></Grid>
                                        <Grid xs={12}>
                                            <BorderLinearProgress
                                                variant='determinate'
                                                value={progPercent(row.recordID, row.amount)}
                                                color={progPercent(row.recordID, row.amount) > 100 ? 'error' : 'primary'}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItemButton>
                            </ListItem>
                            )
                            )}
                    </List>
                    <Box display='flex' justifyContent='space-between' sx={{mx:0.5, mb:0.5}}>
                        <Button size='small' variant='text' startIcon={<PlaylistAddIcon/>} onClick={openAddCategory}>Add Category</Button>
                        <IconButton onClick={openSection} size='small'><MoreHorizIcon /></IconButton>
                    </Box>
                </Box>
            </Paper>
        </>
    )
}