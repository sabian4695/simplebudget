import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {addSection} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {snackBarOpen, snackBarSeverity, snackBarText, dialogPaperStyles} from "../../recoil/globalItems";
import {currentBudgetAndMonth, sections} from "../../recoil/tableAtoms";
import {v4 as uuidv4} from "uuid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddIcon from '@mui/icons-material/Add';
import {supabase} from "../LoginPage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function AddSection() {
    const [addNewSection,setAddNewSection] = useRecoilState(addSection);
    const [sectionName, setSectionName] = React.useState('');
    const [sectionType, setSectionType] = React.useState('expense');
    const handleTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: string,
    ) => {
        if (newType !== null) {
            setSectionType(newType);
        }
    };
    const currentBudget = useRecoilValue(currentBudgetAndMonth)
    const [sectionsArray, setSectionArray] = useRecoilState(sections);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const verifyInputs = () => {
        if (sectionName === '' || sectionName === null) {
            setErrorText('Please enter section name.')
            return false
        }
        return true
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        if (currentBudget.budgetID === undefined) {
            setErrorText('You need to create a budget first! Go to the settings page, click \'Select Budget\'')
            return
        }
        setErrorText('')
        if (verifyInputs()) {
            let newSection = {
                recordID: uuidv4(),
                budgetID: currentBudget.budgetID,
                sectionName: sectionName,
                sectionType: sectionType,
                sectionYear: currentBudget.year,
                sectionMonth: currentBudget.month,
            };
            let {error} = await supabase
                .from('sections')
                .insert(newSection)
            if (error) {
                setErrorText(error.message)
                return
            }
            setSectionArray(prevState => [...prevState, newSection]);
            setAddNewSection(false)
            setSnackSev('success')
            setSnackText('Section Added!')
            setSnackOpen(true)
        }
    }
    React.useEffect(() => {
        if (addNewSection) return;
        setSectionName('')
        setSectionType('expense')
        setErrorText('')
    }, [addNewSection])
    return (
        <>
            <Dialog open={addNewSection}
                    onClose={() => setAddNewSection(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        New Section <IconButton onClick={() => setAddNewSection(false)}><CloseIcon/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="standard"
                                    value={sectionType}
                                    fullWidth
                                    exclusive
                                    onChange={handleTypeChange}
                                >
                                    <ToggleButton value="income">Income</ToggleButton>
                                    <ToggleButton value="expense">Expense</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    value={sectionName}
                                    onChange={(event: any) => setSectionName(event.target.value)}
                                    type="text"
                                    label="Section Name"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth startIcon={<AddIcon />} type='submit' variant='contained'>Add Section</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}