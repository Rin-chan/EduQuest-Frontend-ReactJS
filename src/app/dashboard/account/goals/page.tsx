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

export default function Page(): React.JSX.Element {
    const [showUpdateGoalsForm, setShowUpdateGoalsForm] = React.useState(false);
    
    const toggleUpdateGoalsForm = (): void => {
        setShowUpdateGoalsForm(!showUpdateGoalsForm);
    };

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
                            <p>Complete a private quest</p>

                            <p>0/1</p>
                        </Stack>
                    </Grid>
                </Grid>

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
                
            </CardContent>
        </Card>

        {showUpdateGoalsForm ? (
            <AccountGoalForm open={showUpdateGoalsForm} setOpen={setShowUpdateGoalsForm}/>
        ) : null}
    </Stack>
  );
}
