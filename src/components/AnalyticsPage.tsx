import React from 'react';
import { Chart } from "react-google-charts";
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
];



export default function AnalyticsPage() {
    const theme = useTheme()
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
                        data={data}
                        options={options}
                        width={"100%"}
                        height={"400px"}
                    />
                </Box>
            </Paper>
        </>
    )
}