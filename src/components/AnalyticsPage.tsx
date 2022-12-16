import React from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { PieChart, Pie, Tooltip, Label, ResponsiveContainer } from 'recharts';
import {primaryMain, secondaryMain} from '../recoil/globalItems'
import {categories, sections} from "../recoil/tableAtoms";
import {useRecoilValue} from "recoil";
import List from '@mui/material/List';
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

export default function AnalyticsPage() {
    const sectionArray = useRecoilValue(sections)
    const categoryArray = useRecoilValue(categories)

    function grabSectionAmount(id: string) {
        return categoryArray.reduce((accumulator, object) => {
            if (object.sectionID === id) {
                return accumulator + object.amount;
            }
            return accumulator
        }, 0)
    }

    let incomeSections = sectionArray.filter(x => (x.sectionType === 'income')
    ).map((row) => (
        {
            name: row.sectionName,
            value: grabSectionAmount(row.recordID)
        }
    ))

    let expenseSections = sectionArray.filter(x => (x.sectionType === 'expense')
    ).map((row) => (
        {
            name: row.sectionName,
            value: grabSectionAmount(row.recordID)
        }
    ))

    return (
        <>
            <Stack spacing={2} alignItems="center">
                <Typography sx={{alignSelf:'flex-start'}} color='text.secondary' variant='h6'>Analytics</Typography>
                <Paper elevation={5} sx={{width:'100%', height:300}}>
                    <List dense>
                        <ListItem disablePadding key={1}>
                            <Typography color='text.secondary' variant='h6' sx={{ fontWeight: '600', ml:1 }}>Budget Allocation</Typography>
                        </ListItem>
                        <Divider/>
                        <ListItem disablePadding sx={{height:250}} key={2}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart width={400} height={400}>
                                    <Tooltip />
                                    <Pie data={incomeSections} dataKey="value" cx="50%" cy="50%" innerRadius={2} outerRadius={60}
                                         fill={primaryMain}>
                                        <Label value='Income' />
                                    </Pie>
                                    <Pie data={expenseSections} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill={secondaryMain} label>
                                        <Label value='Expenses' position='outside'/>
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ListItem>
                    </List>
                </Paper>
            </Stack>
        </>
    )
}