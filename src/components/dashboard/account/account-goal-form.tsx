"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import { X } from "@phosphor-icons/react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Alert from '@mui/material/Alert';
import { goalsAvailable } from '@/constants';
import {useUser} from "@/hooks/use-user";
import type { UserGoals } from '@/types/eduquest-user';
import { updateDailyGoals } from '@/api/services/eduquest-user';

interface AccountGoalFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function AccountGoalForm({open, setOpen}: AccountGoalFormProps): React.JSX.Element {
    const { eduquestUser, checkSession } = useUser();
    const [goals, setGoals] = React.useState<UserGoals[]>([]);
    const [id, setId] = React.useState(1);
    const [formError, setFormError] = React.useState<string | null>(null);

    React.useEffect((): void => {
        if (!eduquestUser) {
            return;
        }

        setGoals(eduquestUser.daily_goals || []);

        if (eduquestUser.daily_goals.length > 0) {
            setId(Math.max(...eduquestUser.daily_goals.map((goal) => goal.id)) + 1);
        }
    }, [eduquestUser]);

    const handleClose = (): void => {
        setOpen(false);
        setFormError(null);
    };

    const handleAddGoal = (): void => {
        const addGoal: UserGoals = {
            id,
            task: 1,
            complete: 0,
            target: 1,
        };
        const newGoals = [...goals, addGoal];
        setId(id + 1);
        setGoals(newGoals);
    };

    const handleRemoveGoal = (goalId: number): void => {
        const newGoals = goals.filter((goal) => goal.id !== goalId);
        setGoals(newGoals);
    };

    const hasDuplicateTasks = (goalList: UserGoals[]): boolean => {
        const taskCounts = goalList.reduce<Record<number, number>>((acc, goal) => {
            acc[goal.task] = (acc[goal.task] || 0) + 1;
            return acc;
        }, {});
        return Object.values(taskCounts).some((count) => count > 1);
    };

    const handleSubmit = async (): Promise<void> => {
        setFormError(null);

        if (hasDuplicateTasks(goals)) {
            setFormError('Please select a unique task for each goal. Duplicate tasks are not allowed.');
            return;
        }

        for (const goal of goals) {
            if (goal.target <= 0 || goal.target > 100) {
                setFormError('Please fix errors before submitting');
                return;
            }
        }

        try {
            await updateDailyGoals(goals);
            await checkSession?.();
            handleClose();
        } catch (error) {
            setFormError('Unable to save goals. Please try again.');
        }
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
                Update Goals
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose} />
            </Stack>
        </DialogTitle>

        <DialogContent>
            <Button onClick={handleAddGoal} variant="outlined">Add</Button>
            {formError ? <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert> : null}
            <br />
            <br />
            <Box>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                    <Table
                        sx={{ minWidth: 500 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <TableHead>
                        <TableRow>
                            <TableCell>Task</TableCell>
                            <TableCell>Number to Complete</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {goals.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <TextField
                                        select
                                        id={`task-${String(row.id)}`}
                                        variant='standard'
                                        value={row.task}
                                        onChange={(e) => {
                                            let newGoals = [...goals];
                                            newGoals.map(goal => {
                                                if (goal.id === row.id) {
                                                    goal.task = Number(e.target.value);
                                                }
                                                return goal
                                            })
                                            setGoals(newGoals);
                                        }}
                                    >
                                        {goalsAvailable.map((goal) => {
                                            const isSelectedElsewhere = goals.some((selectedGoal, selectedIndex) =>
                                                selectedIndex !== row.id && selectedGoal.task === goal.id
                                            );
                                            return (
                                                <MenuItem
                                                    key={goal.id}
                                                    value={goal.id}
                                                    disabled={isSelectedElsewhere}
                                                >
                                                    {goal.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </TextField>

                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        error={row.target <= 0 || row.target > 100}
                                        helperText={row.target <= 0 ? 'Must be greater than 0' : row.target > 100 ? 'Must be less than or equal to 100' : ''}
                                        id={`target-${String(row.id)}`}
                                        variant='standard'
                                        type="number"
                                        value={row.target}
                                        onChange={(e) => {
                                            const newGoals = [...goals];
                                            newGoals[index].target = parseInt(e.target.value) || 0;
                                            setGoals(newGoals);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => {handleRemoveGoal(row.id)}} color="error">
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save Goals</Button>
        </DialogActions>
      </Dialog>
  );
}