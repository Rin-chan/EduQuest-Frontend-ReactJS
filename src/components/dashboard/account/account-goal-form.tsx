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
import { questsAvailable } from '@/constants';

interface AccountGoalFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

function createData(
    id: number,
    task: string,
    complete: number,
) {
  return { id, task, complete };
}

const rows = [
    createData(1, 'Complete a private quest', 1),
    createData(2, 'Collect stars', 10)
];

var id = 3;

export function AccountGoalForm({open, setOpen}: AccountGoalFormProps): React.JSX.Element {
    const [goals, setGoals] = React.useState<typeof rows>(rows);

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddGoal = () => {
        const newGoals = [...goals, createData(id, '', 0)];
        id++;
        setGoals(newGoals);
    }

    const handleRemoveGoal = (id: number) => {
        const newGoals = goals.filter((goal) => goal.id !== id);
        setGoals(newGoals);
    }

    const handleSubmit = () => {
        for (const goal of goals) {
            if (goal.complete <= 0 || goal.complete > 100) {
                alert('Please fix errors before submitting');
                return;
            }
        }
        handleClose();
    };

    return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
                Update Goals
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose}></Button>
            </Stack>
        </DialogTitle>

        <DialogContent>
            <Button onClick={handleAddGoal} variant="outlined">Add</Button>
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
                        {goals.map((row, index) => {
                            return (
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        select
                                        id={`task-${row.id}`}
                                        variant='standard'
                                        value={row.task}
                                        onChange={(e) => {
                                            const newGoals = [...goals];
                                            newGoals[index].task = e.target.value;
                                            setGoals(newGoals);
                                        }}
                                    >
                                        {questsAvailable.map((quest) => (
                                            <MenuItem key={quest.id} value={quest.name}>
                                                {quest.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        error={row.complete <= 0 || row.complete > 100}
                                        helperText={row.complete <= 0 ? 'Must be greater than 0' : row.complete > 100 ? 'Must be less than or equal to 100' : ''}
                                        id={`complete-${row.id}`}
                                        variant='standard'
                                        type="number"
                                        value={row.complete}
                                        onChange={(e) => {
                                            const newGoals = [...goals];
                                            newGoals[index].complete = parseInt(e.target.value) || 0;
                                            setGoals(newGoals);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => handleRemoveGoal(row.id)} color="error">
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                            );
                        })}
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
    </React.Fragment>
  );
}