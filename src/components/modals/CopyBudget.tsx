import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {copyBudget} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
    dialogPaperStyles,
    snackBarOpen,
    snackBarSeverity,
    snackBarText
} from "../../recoil/globalItems";
import {categories, currentBudgetAndMonth, sections} from "../../recoil/tableAtoms";
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import {supabase} from "../LoginPage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {supaCategories, supaSections} from "../extras/api_functions";
import {v4 as uuidv4} from "uuid";

export default function CopyBudget() {
    const [sectionsArray, setSectionsArray] = useRecoilValue(sections);
    const [categoriesArray, setCategoriesArray] = useRecoilValue(categories);
    const [fromMonth, setFromMonth] = React.useState<Dayjs | null>(dayjs());
    const [toMonth, setToMonth] = React.useState<Dayjs | null>(dayjs().add(1, 'month'));
    const [openCopyBudget, setOpenCopyBudget] = useRecoilState(copyBudget)
    const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
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
        if (dayjs(toMonth).format('MMMM, YYYY') === dayjs(fromMonth).format('MMMM, YYYY')) {
            setErrorText('Please select differing months')
            return false
        }
        return true
    }

    React.useEffect(() => {
        if (openCopyBudget) {
            setErrorText('')
        }
    }, [openCopyBudget])

    async function handleSubmit(event: any) {
        event.preventDefault();
        setErrorText('')
        if (verifyInputs()) {

            let allSections = await supaSections(currentBudget.budgetID, dayjs(fromMonth).format('MMMM'), Number(dayjs(fromMonth).format('YYYY')))
            if (allSections === null) {
                setErrorText('no sections found for the from month')
                setSnackSev('error')
                setSnackText('No data found')
                setSnackOpen(true)
                return
            }

            let newSectionArray = allSections.map((x) => ({
                    recordID: uuidv4(),
                    budgetID: currentBudget.budgetID,
                    sectionName: x.sectionName,
                    sectionType: x.sectionType,
                    sectionYear: Number(dayjs(toMonth).format('YYYY')),
                    sectionMonth: dayjs(toMonth).format('MMMM'),
            }))
            for (let i = 0; i < newSectionArray.length; i++) {
                let {error} = await supabase
                    .from('sections')
                    .insert(newSectionArray[i])
                if (error) {
                    setErrorText(error.message)
                    return
                }
            }

            let allCategories = await supaCategories(allSections.map(x => x.recordID))
            if (allCategories !== null) {
                let newCategories = allCategories.map((row) => ({
                    recordID: uuidv4(),
                    //@ts-ignore
                    sectionID: newSectionArray[allSections.findIndex(x => x.recordID === row.sectionID)].recordID,
                    categoryName: row.categoryName,
                    amount: row.amount
                }))
                for (let i = 0; i < newCategories.length; i++) {
                    let {error} = await supabase
                        .from('categories')
                        .insert(newCategories[i])
                    if (error) {
                        setErrorText(error.message)
                        return
                    }
                }
            }

            setOpenCopyBudget(false)
            setSnackSev('success')
            setSnackText('Budget data copied!')
            setSnackOpen(true)
        }
    }
    return (
        <>
            <Dialog open={openCopyBudget}
                    onClose={() => setOpenCopyBudget(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <div>Copy Budget Data</div>
                        </Stack>
                        <IconButton onClick={() => setOpenCopyBudget(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Typography>This will copy all sections and categories from one month to another. </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid xs={12}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        label="Copy From"
                                        minDate={dayjs().subtract(2, 'year')}
                                        maxDate={dayjs().add(2, 'year')}
                                        value={fromMonth}
                                        onChange={(newValue) => {
                                            setFromMonth(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth helperText={null} />}
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        label="Copy To"
                                        value={toMonth}
                                        minDate={dayjs().subtract(2, 'year')}
                                        maxDate={dayjs().add(2, 'year')}
                                        onChange={(newValue) => {
                                            setToMonth(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth helperText={null} />}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                    </DialogContent>
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<SaveIcon />} variant='contained' type='submit'>Copy Data</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}