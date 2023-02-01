import React from 'react';
import { Chart } from "react-google-charts";
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { categories, sections, transactions } from '../recoil/tableAtoms';
import { useRecoilValue } from 'recoil';

export const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
];

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
    console.log(expenseGraphData)

    const options = {
        title: "My Daily Activities",
        backgroundColor: "rgba(0,0,0,0)"
    };
    return (
        <>
            <Paper elevation={5} sx={{ borderRadius: 3 }}>
                <Box sx={{ width: '100%' }}>
                    <Chart
                        chartType="PieChart"
                        data={incomeGraphData}
                        options={options}
                        width={"100%"}
                        height={"400px"}
                    />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Chart
                        chartType="PieChart"
                        data={expenseGraphData}
                        options={options}
                        width={"100%"}
                        height={"400px"}
                    />
                </Box>
            </Paper>
        </>
    )
}