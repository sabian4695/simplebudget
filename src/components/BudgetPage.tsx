import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import BudgetSection from "./subcomponents/BudgetSection";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {addSection, addTransaction} from "../recoil/modalStatusAtoms";
import AddSection from "./modals/AddSection";
import AddTransaction from "./modals/AddTransaction";
import {budgetDetails, currentBudget, sections} from '../recoil/tableAtoms';
import Box from '@mui/material/Box';
import AddCategory from "./modals/AddCategory";

const fabStyle = {
    position: 'fixed',
    bottom: 75,
    right: 16,
};

const CustomButton = styled(Button)({
    textTransform: 'none',
});

export default function BudgetPage() {
    const setAddNewSection = useSetRecoilState(addSection)
    const setAddNewTransaction = useSetRecoilState(addTransaction)
    const sectionsArray = useRecoilValue(sections)
    const currentBudgetID = useRecoilValue(currentBudget)
    const budgetsArray = useRecoilValue(budgetDetails)
    let currentBudgetDetails = budgetsArray.find(x => x.recordID === currentBudgetID)
    return (
        <>
            <Stack spacing={2} alignItems="stretch">
                <Box display='flex' flexDirection='row' alignItems='center'>
                    <Typography sx={{alignSelf:'flex-start'}} display='inline' color='text.secondary' variant='h6'>Budget:</Typography>
                    <CustomButton size='small' sx={{py:0, ml:1}}><Typography variant='h6'>{currentBudgetDetails?.month + ' ' + currentBudgetDetails?.year}</Typography></CustomButton>
                </Box>
                {sectionsArray.map((row) => (
                    <BudgetSection sectionID={row.recordID} key={row.recordID}/>
                    )
                )}
                <Button variant='outlined' color='secondary' onClick={() => setAddNewSection(true)}>Add Section</Button>
            </Stack>
            <Fab color="secondary" sx={fabStyle} onClick={() => setAddNewTransaction(true)}>
                <AddIcon />
            </Fab>
            <AddCategory/>
            <AddSection/>
            <AddTransaction/>
        </>
    )
}