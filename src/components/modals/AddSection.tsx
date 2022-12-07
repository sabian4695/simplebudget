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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {snackBarOpen, snackBarSeverity, snackBarText, dialogPaperStyles} from "../../recoil/globalItems";
import {currentBudgetAndMonth, sections} from "../../recoil/tableAtoms";
import {v4 as uuidv4} from "uuid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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
    const setSectionArray = useSetRecoilState(sections);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [errorText, setErrorText] = React.useState('')
    const verifyInputs = () => {
        if (sectionName === 'null') {
            setErrorText('Please enter section name.')
            return false
        }
        return true
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (verifyInputs()) {
            let newSection = {
                recordID: uuidv4(),
                budgetID: currentBudget.budgetID,
                sectionName: sectionName,
                sectionType: sectionType,
                sectionYear: 0,
                sectionMonth: '',
            };
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
                    PaperProps={dialogPaperStyles}
            >
                <Box sx={{bgcolor: 'background.paper'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle>New Section</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
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
                            <Grid xs={12}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={sectionType}
                                    fullWidth
                                    exclusive
                                    onChange={handleTypeChange}
                                >
                                    <ToggleButton value="income">Income</ToggleButton>
                                    <ToggleButton value="expense">Expense</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {<Typography color='error' variant="body2">{errorText}</Typography>}
                        <Button fullWidth variant='contained' type='submit'>Add Section</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}