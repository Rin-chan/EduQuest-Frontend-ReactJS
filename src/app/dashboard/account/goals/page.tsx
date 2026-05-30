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
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { isWithinInterval } from "date-fns";
import {useUser} from "@/hooks/use-user";
import { getCalendarDailyCheckIn } from '@/api/services/eduquest-user';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { goalsAvailable } from '@/constants';

export default function Page(): React.JSX.Element {
    const { eduquestUser } = useUser();
    const [dates, setDates] = useState<Date[]>([]);
    const [showUpdateGoalsForm, setShowUpdateGoalsForm] = React.useState(false);

    const toggleUpdateGoalsForm = (): void => {
        setShowUpdateGoalsForm(!showUpdateGoalsForm);
    };

    useEffect(() => {
        if (eduquestUser) {
            getCalendarDailyCheckIn(eduquestUser.id)
                .then((response) => {
                    setDates(response.checkin_dates.map(dateStr => dayjs(dateStr).toDate()));
                })
                .catch(() => {
                    /* Ignore calendar load errors in this view */
                });
        }
    }, []);

    const dateAlreadyClicked = (clickedDates: Date[], date: Date): boolean => clickedDates.some(
        d => new Date(d).getTime() === new Date(date).getTime()
    );

    const disabledRanges: Date[][] = [[new Date(2020, 1, 1), new Date()]];

    const tileClassName = ({ date }: { date: Date }): string | undefined => {
        if (dateAlreadyClicked(dates, date)) {
            return 'react-calendar__tile--active'
            /* this is react-calendar's default class name for an active
            tile, but you can use any custom class name of your choice */
        }
    }

    function isWithinRange(date: Date, range: Date[]): boolean {
        return isWithinInterval(date, { start: range[0], end: range[1] });
    }

    function isWithinRanges(date: Date, ranges: Date[][]): boolean {
        return ranges.some((range: Date[]) => isWithinRange(date, range)) && !dateAlreadyClicked(dates, date);
    }

    function tileDisabled({ date, view }: { date: Date; view: string }): boolean {
        if (view === 'month') {
            return isWithinRanges(date, disabledRanges);
        }
        return false;
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

            <CardContent sx={{pd: '16px'}}>
                <Grid container spacing={2}>
                    <Grid xs={16} md={14} lg={12}>
                        {
                            eduquestUser?.daily_goals.map((goal) => (
                                <Grid key={goal.id} sx={{ margin: 2 }}>
                                    <Divider orientation="horizontal" flexItem sx={{ mr: "-1px" }} />
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body1">{goalsAvailable[goalsAvailable.findIndex((g) => g.id === goal.task)].name}</Typography>

                                        <Typography variant="body1">{Math.round(Number(goal.complete))}/{goal.target}</Typography>
                                    </Stack>
                                </Grid>
                            ))
                        }
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
                            <Typography variant="body1">Current Streak: {eduquestUser?.daily_checkin_streak}</Typography>
                            <Typography variant="body1">Longest streak: {eduquestUser?.daily_checkin_longest_streak}</Typography>
                        </Grid>
                    </Grid>

                    <ReactCalendar
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
