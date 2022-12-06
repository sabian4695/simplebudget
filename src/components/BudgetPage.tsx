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
import {budgetDetails, sections} from '../recoil/tableAtoms';

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
    return (
        <>
            <CustomButton size='large' sx={{mb:1}}><Typography variant='h5'>December 2022</Typography></CustomButton>
            <Stack spacing={2} alignItems="stretch">
                {sectionsArray.map((row) => (
                    <BudgetSection sectionID={row.recordID} key={row.recordID}/>
                    )
                )}
                <Button variant='outlined' color='secondary' onClick={() => setAddNewSection(true)}>Add Section</Button>
            </Stack>
            <Fab color="secondary" sx={fabStyle} onClick={() => setAddNewTransaction(true)}>
                <AddIcon />
            </Fab>
            <AddSection/>
            <AddTransaction/>
        </>
    )
}