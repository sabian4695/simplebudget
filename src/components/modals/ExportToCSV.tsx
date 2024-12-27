import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {exportToCSV} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {snackBarOpen, snackBarSeverity, snackBarText, dialogPaperStyles, mainLoading} from "../../recoil/globalItems";
import {currentBudgetAndMonth} from "../../recoil/tableAtoms";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DownloadIcon from '@mui/icons-material/Download';
import dayjs, { Dayjs } from 'dayjs';
import {supaCategories, supaSections, supaTransactionsFromCategories} from "../extras/api_functions";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CSVLink } from "react-csv";

export default function AddSection() {
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const [fromMonth, setFromMonth] = React.useState<Dayjs | null>(dayjs());
    const [toMonth, setToMonth] = React.useState<Dayjs | null>(dayjs());
    const [exportCSV,setExportCSV] = useRecoilState(exportToCSV);
    const currentBudget = useRecoilValue(currentBudgetAndMonth)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [allExportData, setAllExportData] = React.useState()
    const [grabbedSections, setGrabbedSections] = React.useState(false)
    const [exportSections, setExportSections] = React.useState()
    const [generated, setGenerated] = React.useState(false);
    const [errorText, setErrorText] = React.useState('')
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const verifyInputs = () => {
        if (fromMonth === null) {
            setErrorText('Please enter a from month')
            return false
        }
        if (toMonth === null) {
            setErrorText('Please enter a to month')
            return false
        }
        if (fromMonth.isAfter(toMonth)) {
            setErrorText('Please enter in the correct order')
            return false
        }
        return true
    }
    async function addSections() {
        setGrabbedSections(false)
        let exportSectionsAll: any = []
        let s = dayjs(fromMonth)
            let e = dayjs(toMonth)
            let months = []
            for (var m = dayjs(s); m.isBefore(e); m = m.add(1, 'month')) {
                months.push({ year: m.format('YYYY'), month: m.format('MMMM') });
            }
            months.push({ year: e.format('YYYY'), month: e.format('MMMM') });
        months.forEach(async(x) => {
            let newSec = await supaSections(currentBudget.budgetID, x.month, x.year)
            newSec?.forEach((sections) => {
                exportSectionsAll.push(sections)
            })
        })
        setExportSections(exportSectionsAll)
        await sendIt()
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        setErrorText('')
        if (verifyInputs()) {
            addSections()
        }
        
    }
    React.useEffect(() => {
        if (exportCSV) return;
        setGenerated(false)
        setAllExportData(undefined)
        setGrabbedSections(false)
        setErrorText('')
    }, [exportCSV])
    async function sendIt() {
            //@ts-ignore
            let exportCategories = await supaCategories(exportSections.map((x: any) => x.recordID))
            //@ts-ignore
            let exportTransactions = await supaTransactionsFromCategories(exportCategories?.map(x => x.recordID))
            setLoadingOpen(true)
            let exportDataAll = exportTransactions?.map((x: any) => {
                let thisCategory = exportCategories?.find((cat) => cat.recordID === x.categoryID)
                //@ts-ignore
                let thisSection: any = exportSections?.find((sec: any) => sec.recordID === thisCategory.sectionID)
                return {
                    budgetYear: thisSection?.sectionYear,
                    budgetMonth: thisSection?.sectionMonth,
                    sectionName: thisSection?.sectionName,
                    sectionType: thisSection?.sectionType,
                    categoryName: thisCategory.categoryName,
                    categoryBudgeted: thisSection?.sectionType === 'expense' ? -thisCategory.amount : thisCategory.amount,
                    transactionDate: dayjs(x.transactionDate).format('MM/DD/YYYY'),
                    transactionType: x.transactionType,
                    transactionAmount: x.transactionType === 'expense' ? -x.amount : x.amount,
                    transactionTitle: x.title
                }
            })
            //@ts-ignore
            setAllExportData(exportDataAll)
            console.log(exportCategories)
            console.log(exportDataAll)
            setGenerated(true)
            setLoadingOpen(false)
            setSnackSev('success')
            setSnackText('Export generated!')
            setSnackOpen(true)
    }
    React.useEffect(() => {
        if (!grabbedSections) return;
            //sendIt()
    }, [grabbedSections])
    return (
        <>
            <Dialog open={exportCSV}
                    onClose={() => setExportCSV(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        Export Data to CSV <IconButton onClick={() => setExportCSV(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                    <Grid container spacing={2}>
                            <Typography>Select the start and end months of the data you want</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid size={12}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        label="Start Month"
                                        value={fromMonth}
                                        onChange={(newValue) => {
                                            setFromMonth(newValue);
                                        }}
                                        slotProps={{
                                            textField: (params) => <TextField {...params} fullWidth helperText={null} />,
                                        }}
                                        sx={{width: '100%'}}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        label="End Month"
                                        value={toMonth}
                                        onChange={(newValue) => {
                                            setToMonth(newValue);
                                        }}
                                        slotProps={{
                                            textField: (params) => <TextField {...params} fullWidth helperText={null} />,
                                        }}
                                        sx={{width: '100%'}}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                    </DialogContent>
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        {generated ? 
                            <CSVLink
                                //@ts-ignore
                                data={allExportData}
                                filename={"budgetData.csv"}
                                onClick={() => {
                                    setExportCSV(false)
                                  }}
                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                                target="_blank"
                            >
                                Download Export
                            </CSVLink>
                            :
                            <Button fullWidth startIcon={<DownloadIcon />} type='submit' variant='contained'>Export</Button>
                        }
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}