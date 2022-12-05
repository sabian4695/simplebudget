import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import BudgetSection from "./subcomponents/BudgetSection";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const fabStyle = {
    position: 'fixed',
    bottom: 75,
    right: 16,
};

const CustomButton = styled(Button)({
    textTransform: 'none',
});

export default function BudgetPage() {

    return (
        <>
            <CustomButton size='large' sx={{mb:1}}><Typography variant='h5'>December 2022</Typography></CustomButton>
            <Stack spacing={2} alignItems="stretch">
                <BudgetSection/>
                <Button variant='outlined'>Add Section</Button>
            </Stack>
            <Fab color="primary" sx={fabStyle}>
                <AddIcon />
            </Fab>
        </>
    )
}