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
                    <Typography variant="h6" align="left" >
                        Budget
                    </Typography>
                    <Typography color='error' align="left" sx={{flexGrow: 1, ml:1}}>[alpha]</Typography>
                </Toolbar>
            </AppBar>
        </>
    );
}