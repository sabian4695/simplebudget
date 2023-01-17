import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import logo from '../../logo.png'
import {useRecoilValue} from "recoil";
import {themeAtom} from "../../recoil/globalItems";

export default function AppToolbar() {
    const currentTheme = useRecoilValue(themeAtom);
    return (
        <>
            <AppBar position="fixed"
                    sx={{
                        width: '100%'
                    }}>
                <Toolbar sx={currentTheme === 'dark' ? null : {backgroundColor:'background.paper', color:'primary.main'}}>
                    <img
                        height='30'
                        src={logo}
                        srcSet={`${logo}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt='logo'
                        loading="lazy"
                    />
                    <Typography sx={{ml:1}}>simple</Typography>
                    <Typography variant="h6" align="left" >
                        Budget
                    </Typography>
                    <Typography color='error' align="left" sx={{flexGrow: 1, ml:1}}>[beta]</Typography>
                </Toolbar>
            </AppBar>
        </>
    );
}