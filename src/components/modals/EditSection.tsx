import React from 'react';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentSection, areYouSure, editSection} from '../../recoil/modalStatusAtoms'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
    areYouSureAccept,
    areYouSureDetails,
    areYouSureTitle,
    dialogPaperStyles,
    snackBarOpen,
    snackBarSeverity,
    snackBarText
} from "../../recoil/globalItems";
import {categories, sections, transactions} from "../../recoil/tableAtoms";
import SaveIcon from '@mui/icons-material/Save';
import {supabase} from "../LoginPage";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export default function EditSection() {
    const [openEditSection, setOpenEditSection] = useRecoilState(editSection);
    const [transactionsArray, setTransactionsArray] = useRecoilState(transactions)
    const [categoryArray, setCategoryArray] = useRecoilState(categories)
    const [sectionsArray, setSectionsArray] = useRecoilState(sections);
    const currentSectionID = useRecoilValue(currentSection);
    let currentSectionDetails = sectionsArray.find(x => x.recordID === currentSectionID)
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

    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [areYouSureOpen, setAreYouSureOpen] = useRecoilState(areYouSure);
    const setCheckTitle = useSetRecoilState(areYouSureTitle);
    const setCheckDetails = useSetRecoilState(areYouSureDetails);
    const [checkAccept, setCheckAccept] = useRecoilState(areYouSureAccept);
    const [errorText, setErrorText] = React.useState('')
    const theme = useTheme();
    const bigger = useMediaQuery(theme.breakpoints.up('sm'));
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const moreOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleDoubleCheck() {
        setAnchorEl(null);
        setCheckTitle('Are you sure you want to delete this section?')
        setCheckDetails('WARNING: This will delete all categories and transactions assigned to this section as well.')
        setAreYouSureOpen(true)
    }

    React.useEffect(() => {
        if(!areYouSureOpen) {
            if(checkAccept) {
                handleDelete()
            }
        }
    }, [areYouSureOpen])

    async function deleteTransactions(catArray: string | any[]) {
        for (let i = 0; i < catArray.length; i++) {
            let {error} = await supabase
                .from('transactions')
                .delete()
                .eq('categoryID', catArray[i].recordID)
            let newTrans = transactionsArray.filter(function(el) { return el.categoryID !== catArray[i].recordID; });
            setTransactionsArray(newTrans)
        }
    }

    async function handleDelete() {
        setErrorText('')

        let catDelete = categoryArray.filter(x => x.sectionID === currentSectionID)
        await deleteTransactions(catDelete)

        let { data } = await supabase
            .from('categories')
            .delete()
            .eq('sectionID', currentSectionID)

        let { error } = await supabase
            .from('sections')
            .delete()
            .eq('recordID', currentSectionID)
        if (error) {
            setErrorText(error.message)
            return
        }
        let newSec = sectionsArray.filter(function(el) { return el.recordID !== currentSectionID; });
        let newCat = categoryArray.filter(function(el) { return el.sectionID !== currentSectionID; });
        setSectionsArray(newSec)
        setCategoryArray(newCat)

        setOpenEditSection(false)
        setSnackSev('success')
        setSnackText('Section deleted')
        setSnackOpen(true)
        setCheckAccept(false)
    }
    const verifyInputs = () => {
        if (sectionName === '' || sectionName === null) {
            setErrorText('Please enter section name.')
            return false
        }
        return true
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        setErrorText('')
        if (verifyInputs()) {
            let { error } = await supabase
                .from('sections')
                .update({
                    sectionName: sectionName,
                    sectionType: sectionType,
                })
                .eq('recordID', currentSectionID)
            if (error) {
                setErrorText(error.message)
                return
            }
            let newArr = sectionsArray.map(obj => {
                if (obj.recordID === currentSectionID) {
                    return {...obj,
                        sectionName: sectionName,
                        sectionType: sectionType}
                }
                return obj;
            });
            setSectionsArray(newArr);
            setOpenEditSection(false)
            setSnackSev('success')
            setSnackText('Section updated!')
            setSnackOpen(true)
        }
    }
    const handleFocus = (event: any) => {
        if (event) {
            event.target.select()
        }
    };
    React.useEffect(() => {
        if (!openEditSection) return;
            if (currentSectionDetails) {
                setSectionName(currentSectionDetails.sectionName)
                setSectionType(currentSectionDetails.sectionType)
            }
        setErrorText('')
    }, [openEditSection])
    return (
        <>
            <Dialog open={openEditSection}
                    onClose={() => setOpenEditSection(false)}
                    scroll='paper'
                    fullScreen={!bigger}
                    PaperProps={bigger ? dialogPaperStyles : undefined}
            >
                <Box sx={{bgcolor: 'background.paper', height:'100%'}} component='form' onSubmit={handleSubmit}>
                    <DialogTitle sx={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <IconButton
                                size='small'
                                aria-label="more"
                                aria-controls={moreOpen ? 'long-menu' : undefined}
                                aria-expanded={moreOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon/>
                            </IconButton>
                            <div>Edit Section</div>
                        </Stack>
                        <IconButton onClick={() => setOpenEditSection(false)}><CloseIcon/></IconButton>
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
                        <Button fullWidth startIcon={<SaveIcon />} variant='contained' type='submit'>Save Changes</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={moreOpen}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDoubleCheck}>
                    <DeleteIcon/>
                    Delete
                </MenuItem>
            </Menu>
        </>
    )
}