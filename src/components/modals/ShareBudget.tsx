import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useModalStore } from '../../store/modalStore';
import { useTableStore } from '../../store/tableStore';
import { dialogPaperStyles, useGlobalStore } from "../../store/globalStore";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import { supabase } from "../../lib/supabase";
import { ensureSession } from "../extras/ensureSession";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Html5Qrcode } from "html5-qrcode";

export default function ShareBudget() {
    const open = useModalStore(s => s.shareBudget)
    const setOpen = useModalStore(s => s.setShareBudget)
    const [shareToID, setShareToID] = React.useState('')
    const [errorText, setErrorText] = React.useState('')
    const setSnackText = useGlobalStore(s => s.setSnackBarText);
    const setSnackSev = useGlobalStore(s => s.setSnackBarSeverity);
    const setSnackOpen = useGlobalStore(s => s.setSnackBarOpen);
    const user = useGlobalStore(s => s.currentUser)
    const budgetsArray = useTableStore(s => s.budgets)
    const currentBudgetDetails = useTableStore(s => s.currentBudgetAndMonth)
    const setCurrentBudget = useTableStore(s => s.setCurrentBudgetAndMonth)
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const [scanning, setScanning] = React.useState(false);
    const scannerRef = React.useRef<Html5Qrcode | null>(null);
    const scannerContainerId = 'qr-reader';

    const startScanner = async () => {
        setScanning(true);
        // Small delay to let the DOM element render
        setTimeout(async () => {
            try {
                const html5QrCode = new Html5Qrcode(scannerContainerId);
                scannerRef.current = html5QrCode;
                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 200, height: 200 } },
                    (decodedText) => {
                        setShareToID(decodedText);
                        stopScanner();
                        setSnackSev('success');
                        setSnackText('QR Code scanned!');
                        setSnackOpen(true);
                    },
                    () => { } // ignore scan failures
                );
            } catch (err) {
                console.error('QR Scanner error:', err);
                setScanning(false);
                setErrorText('Could not access camera');
            }
        }, 100);
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (e) { /* ignore */ }
            scannerRef.current = null;
        }
        setScanning(false);
    };

    // Cleanup scanner when modal closes
    React.useEffect(() => {
        if (!open) {
            stopScanner();
            setShareToID('');
            setErrorText('');
        }
    }, [open]);
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrorText('')
        if (shareToID === user.recordID) {
            setErrorText('you can\'t share a budget with yourself')
            return
        }
        if (shareToID === '') {
            setErrorText('please enter a user ID to share with')
            return
        }
        let newShare = {
            recordID: uuidv4(),
            budgetID: currentBudgetDetails.budgetID,
            sharedToID: shareToID
        }
        await ensureSession();
        let { error } = await supabase
            .from('shared')
            .insert(newShare)
        if (error) {
            setErrorText(error.message)
            return
        }
        setSnackSev('success')
        setSnackText('Budget Shared Successfully')
        setSnackOpen(true)
        setOpen(false)
    }
    return (
        <>
            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                fullScreen={!bigger}
                PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{ bgcolor: 'background.paper', height: '100%' }} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Share Budget<IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Alert severity="warning">Warning!! Sharing your budget allows the other user to create, view, edit and delete categories, sections, and transactions. You can remove the sharing from this budget in the future, but you cannot undo their actions.</Alert>
                            </Grid>
                            <Grid size={12}>
                                <Alert severity='info'>
                                    To share a budget, scan their QR code or enter their user ID.
                                    They can find their QR code in Settings → "Show My QR Code".
                                </Alert>
                            </Grid>
                            <Grid size={12}>
                                {scanning ? (
                                    <Box>
                                        <div id={scannerContainerId} style={{ width: '100%' }} />
                                        <Button fullWidth size='small' color='error' onClick={stopScanner} sx={{ mt: 1 }}>
                                            Stop Scanner
                                        </Button>
                                    </Box>
                                ) : (
                                    <Button
                                        fullWidth
                                        variant='outlined'
                                        startIcon={<QrCodeScannerIcon />}
                                        onClick={startScanner}
                                    >
                                        Scan QR Code
                                    </Button>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    value={shareToID}
                                    onChange={(event: any) => setShareToID(event.target.value)}
                                    type="text"
                                    label="User ID to share with"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box sx={{ mx: 1, mt: 0.5 }}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<ShareIcon />} type='submit' variant='contained'>Share My Budget</Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </>
    )
}
