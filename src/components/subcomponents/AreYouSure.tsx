import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {dialogPaperStyles} from "../../recoil/globalItems";
import Box from "@mui/material/Box";
import {areYouSure} from '../../recoil/modalStatusAtoms'
import {areYouSureTitle, areYouSureDetails, areYouSureAccept} from '../../recoil/globalItems'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";

export default function AreYouSure() {
    const [open, setOpen] = useRecoilState(areYouSure)
    const setAccept = useSetRecoilState(areYouSureAccept)
    const title = useRecoilValue(areYouSureTitle)
    const details = useRecoilValue(areYouSureDetails)
    function handleClick(answer: boolean) {
        setAccept(answer)
        setOpen(false)
    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}}>
                    <DialogTitle id="alert-dialog-title">
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {details}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClick(false)} size='small'>Cancel</Button>
                        <Button onClick={() => handleClick(true)} size='small' autoFocus variant='contained'>
                            Let's do it
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
}