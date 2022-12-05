import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';

export default function AppToolbar() {
    return (
        <>
            <AppBar position="fixed"
                    sx={{
                        width: '100%'
                    }}>
                <Toolbar>
                    <Typography>
                        simple
                    </Typography>
                    <Typography variant="h6" align="left" sx={{flexGrow: 1}}>
                        Budget
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
}