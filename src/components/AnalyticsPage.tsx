import React from 'react';
import { Chart } from "react-google-charts";
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { categories, sections, transactions } from '../recoil/tableAtoms';
import { useRecoilValue } from 'recoil';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function AnalyticsPage() {
    const categoriesArray = useRecoilValue(categories)
    const sectionsArray = useRecoilValue(sections)
    const theme = useTheme()

    function sumCat(idVal: string) {
        return categoriesArray.filter(x => x.sectionID === idVal).reduce((accumulator, object) => {
            return accumulator + object.amount;
        }, 0)
    }

    let incomeArray = categoriesArray.filter(x => sectionsArray.find(row => row.recordID === x.sectionID)?.sectionType === "income").map(y => (
        [
            y.categoryName,
            y.amount
        ]
    ))
    let expenseArray = sectionsArray.filter(x => x.sectionType === "expense").map(y => (
        [
            y.sectionName,
            sumCat(y.recordID)
        ]
    ))
        
    let incomeColumns = [["Income Title", "Amount"]]
    let expenseColumns = [["Columns Title", "Amount"]]
    //@ts-ignore
    let incomeGraphData = incomeColumns.concat(incomeArray)
    //@ts-ignore
    let expenseGraphData = expenseColumns.concat(expenseArray)

    const options = {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.paper : '#2A2A2A',
        legend: "none",
    };
    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Stack spacing={2} alignItems="stretch" sx={{maxWidth:400, width:'100%'}}>
                    <Paper elevation={5} sx={{ borderRadius: 3, p:1, width:'100%' }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography textAlign='center' color='text.secondary' variant='h6' sx={{ fontWeight: '600' }}>
                                Income Sources
                            </Typography>
                            <Chart
                                chartType="PieChart"
                                data={incomeGraphData}
                                options={options}
                                width={"100%"}
                                height={"400px"}
                            />
                            {incomeArray.sort(function(a, b) {
                                //@ts-ignore
                                return b[1] - a[1];
                            }).map(x => (
                                <Box display='flex' flexDirection='row' justifyContent='space-between' sx={{mx:2, my:1}}>
                                    <Typography variant='body2' fontWeight='bold' color='text.secondary'>
                                        {/*@ts-ignore*/}
                                        {x[0]}
                                    </Typography>
                                    <Divider variant='middle' sx={{flexGrow:'1', alignSelf:'center'}}/>
                                    <Typography variant='body2' fontWeight='bold' color='text.secondary'>
                                        {/*@ts-ignore*/}
                                        {formatter.format(x[1])}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                    <Paper elevation={5} sx={{ borderRadius: 3, p:1, width:'100%' }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography textAlign='center' color='text.secondary' variant='h6' sx={{ fontWeight: '600' }}>
                                Expense Distribution
                            </Typography>
                            <Chart
                                chartType="PieChart"
                                data={expenseGraphData}
                                options={options}
                                width={"100%"}
                                height={"400px"}
                            />
                            {expenseArray.sort(function(a, b) {
                                //@ts-ignore
                                return b[1] - a[1];
                            }).map(x => (
                                <Box display='flex' flexDirection='row' justifyContent='space-between' sx={{mx:2, my:1}}>
                                    <Typography variant='body2' fontWeight='bold' color='text.secondary'>
                                        {/*@ts-ignore*/}
                                        {x[0]}
                                    </Typography>
                                    <Divider variant='middle' sx={{flexGrow:'1', alignSelf:'center'}}/>
                                    <Typography variant='body2' fontWeight='bold' color='text.secondary'>
                                        {/*@ts-ignore*/}
                                        {formatter.format(x[1])}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Stack>
            </Box>
        </>
    )
}