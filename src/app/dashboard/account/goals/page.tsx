"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card/Card';
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from '@mui/material/Divider/Divider';
import Button from '@mui/material/Button/Button';
import { AccountGoalForm } from '@/components/dashboard/account/account-goal-form';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import { isWithinInterval } from "date-fns";

export default function Page(): React.JSX.Element {
    const [showUpdateGoalsForm, setShowUpdateGoalsForm] = React.useState(false);
    
    const streak = 1;
    const longestStreak = 2;

    const toggleUpdateGoalsForm = (): void => {
        setShowUpdateGoalsForm(!showUpdateGoalsForm);
    };

    const [dates, setDates] = useState([new Date(2026, 3, 1), new Date(2026, 3, 2), new Date(2026, 3, 20)]);

    const dateAlreadyClicked = (dates, date) => dates.some(
        d => new Date(d).getTime() === new Date(date).getTime()
    )

    const disabledRanges = [[new Date(2020, 1, 1), new Date()]];

    const tileClassName = ({ date }) => {
        if (dateAlreadyClicked(dates, date)) {
            return 'react-calendar__tile--active'
            /* this is react-calendar's default class name for an active
            tile, but you can use any custom class name of your choice */
        }
    }

    function isWithinRange(date, range) {
        return isWithinInterval(date, { start: range[0], end: range[1] });
    }

    function isWithinRanges(date, ranges) {
        return ranges.some(range => isWithinRange(date, range)) && !dateAlreadyClicked(dates, date);
    }

    function tileDisabled({ date, view }) {
        if (view === 'month') {
            return isWithinRanges(date, disabledRanges);
        }
    }

    return (
    <Stack spacing={3}>
        <div>
            <Typography variant="h4">Goals</Typography>
        </div>

        <Card>
            <CardHeader
                title="Daily Goals"
            />

            <CardContent sx={{pb: '16px'}}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={6} lg={4}>
                        <Divider orientation="horizontal" flexItem sx={{ mr: "-1px" }} />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1">Complete a private quest</Typography>

                            <Typography variant="body1">0/1</Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <br />
                
                <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained" onClick={toggleUpdateGoalsForm}>
                        Update Goals
                    </Button>
                </Stack>
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                title="Streak"
            />

            <CardContent sx={{pb: '16px'}}>
                <Stack direction="row" justifyContent="space-around">
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <Typography variant="body1">Current Streak: {streak}</Typography>
                            <Typography variant="body1">Longest streak: {longestStreak}</Typography>
                        </Grid>
                    </Grid>

                    <Calendar
                        tileClassName={tileClassName}
                        tileDisabled={tileDisabled}
                    />
                </Stack>
            </CardContent>
        </Card>

        {showUpdateGoalsForm ? (
            <AccountGoalForm open={showUpdateGoalsForm} setOpen={setShowUpdateGoalsForm}/>
        ) : null}
    </Stack>
  );
}
