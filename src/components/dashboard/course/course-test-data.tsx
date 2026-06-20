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
import type { Course } from '@/types/course';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {logger} from "@/lib/default-logger";
import { getTestScoresByCourseGroup, deleteTestScore, getUserTestScoresByTest, updateTestScoreWeightage, updateUserTestScores } from '@/api/services/test-score';
import type { TestScore, UserTestScore } from "@/types/test-score";
import { Typography } from '@mui/material';

interface TestDataProps {
    course: Course;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function TestData({open, setOpen, course}: TestDataProps): React.JSX.Element {
    const handleClose = (): void => {
        setOpen(false);
    };

    const [filesRow, setFilesRow] = React.useState<TestScore[]>([]);
    const [scoresRow, setScoresRow] = React.useState<UserTestScore[]>([]);

    const [pageFiles, setPageFiles] = React.useState<number>(0);
    const [pageScores, setPageScores] = React.useState<number>(0);
    const [rowsPerPageFiles, setRowsPerPageFiles] = React.useState<number>(5);
    const [rowsPerPageScores, setRowsPerPageScores] = React.useState<number>(5);
    const [deleteConfirmation, setDeleteConfirmation] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<number>(-1);
    const [selectedName, setSelectedName] = React.useState<string>('');
    const [editing, setEditing] = React.useState<boolean>(false);
    const [weightage, setWeightage] = React.useState<number>(100);
    const [refresh, setRefresh] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (refresh) {
            const fetchData = async () => {
                try {
                    const testList =
                        await getTestScoresByCourseGroup(
                            course.id.toString()
                        );

                    setFilesRow(testList);
                } catch (error) {
                    logger.error("Failed to fetch data", error);
                }
            };

            fetchData().catch(() => { return; });
            setRefresh(false);
        }
    }, [course.id, refresh, filesRow]);

    const handleChangePageFiles = (event: unknown, newPage: number): void => {
        setPageFiles(newPage);
        logger.debug(course);
    };

    const handleChangeRowsPerPageFiles = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPageFiles(parseInt(event.target.value, 10));
        setPageFiles(0);
    };

    const visibleRowsFiles = React.useMemo(
        () =>
        [...filesRow]
            .slice(pageFiles * rowsPerPageFiles, pageFiles * rowsPerPageFiles + rowsPerPageFiles),
        [filesRow, pageFiles, rowsPerPageFiles],
    );

    const handleChangePageScores = (event: unknown, newPage: number): void => {
        setPageScores(newPage);
    };

    const handleChangeRowsPerPageScores = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPageScores(parseInt(event.target.value, 10));
        setPageScores(0);
    };

    const visibleRowsScores = React.useMemo(
        () =>
        [...scoresRow]
            .slice(pageScores * rowsPerPageScores, pageScores * rowsPerPageScores + rowsPerPageScores),
        [scoresRow, pageScores, rowsPerPageScores],
    );

    const editFile = async (id: number, name: string, weightageEdit: number): Promise<void> => {
        const studentTestList = await getUserTestScoresByTest(id.toString());
        setScoresRow(studentTestList);
        setSelectedName(name);
        setWeightage(weightageEdit);

        setSelected(id);
        setEditing(true);
    }

    const confirmDelete = (id: number, confirm: boolean): void => {
        setSelected(id);
        setDeleteConfirmation(confirm);
    }

    const deleteFile = async (id: number): Promise<void> => {
        await deleteTestScore(id.toString());
        setRefresh(true);
        setSelected(-1);
        setDeleteConfirmation(false);
    }

    const changeScore = (id: number, score: number): void => {
        setScoresRow(prev =>
            prev.map(row =>
                row.id === id
                    ? { ...row, score }
                    : row
            )
        );
    }

    const returnEdit = (): void => {
        setSelected(-1);
        setEditing(false);
    }

    const saveEdit = async (): Promise<void> => {
        await Promise.all([
            updateUserTestScores(scoresRow),
            updateTestScoreWeightage(selected.toString(), weightage.toString())
        ]);
        setRefresh(true);
        returnEdit();
    }

    return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            {selected !== -1 && editing ? `Editing File: ${selectedName}` : 'All Test Data'}
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose}></Button>
            </Stack>
        </DialogTitle>
        <DialogContent>
            <Box>
                <Paper sx={{ mb: 2 }}>
                    {editing ?
                    <>
                    <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 5 }}>
                        <Typography variant="body1">Weightage</Typography>
                        <TextField
                            required
                            margin="dense"
                            fullWidth
                            variant="standard"
                            id="weightage"
                            value={weightage}
                            type="number"
                            error={weightage < 0 || weightage > 100}
                            helperText={weightage < 0 || weightage > 100 ? 'Must be between 0 to 100' : ''}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setWeightage(parseInt(event.target.value));
                            }}
                        />
                    </Stack>

                    <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Score</TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {visibleRowsScores.map((row) => {
                            return (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id.toString()}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{row.student.email}</TableCell>
                                <TableCell>{row.student.nickname}</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        margin="dense"
                                        fullWidth
                                        variant="standard"
                                        id="score"
                                        type="number"
                                        value={row.score}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            changeScore(row.id,Number(event.target.value) || 0);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={scoresRow.length}
                        rowsPerPage={rowsPerPageScores}
                        page={pageScores}
                        onPageChange={handleChangePageScores}
                        onRowsPerPageChange={handleChangeRowsPerPageScores}
                    />

                    <Stack direction="row" sx={{ alignContent: 'right', justifyContent: 'right' }}>
                        <Button variant='contained' color='secondary' onClick={returnEdit}>
                            Back
                        </Button>
                        <Button variant='contained' onClick={saveEdit}>
                            Save
                        </Button>
                    </Stack>
                    </>
                    :
                    <>
                    <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <TableHead>
                        <TableRow>
                            <TableCell>File</TableCell>
                            <TableCell align="center" width="25%">Action</TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {visibleRowsFiles.map((row) => {
                            return (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id.toString()}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="center">
                                    {deleteConfirmation && selected === row.id ? (
                                        <Stack>
                                            <Button variant="contained" onClick={() => {confirmDelete(-1, false)}}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" color="error" onClick={async () => {try{await deleteFile(row.id)}catch(e){return}}}>
                                                Confirm Delete
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack>
                                            <Button variant="contained" color="primary" onClick={async () => {try{await editFile(row.id, row.name, row.weightage)}catch(e){return}}}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => {confirmDelete(row.id, true)}}>
                                                Delete
                                            </Button>
                                        </Stack>
                                    )}
                                </TableCell>
                            </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filesRow.length}
                        rowsPerPage={rowsPerPageFiles}
                        page={pageFiles}
                        onPageChange={handleChangePageFiles}
                        onRowsPerPageChange={handleChangeRowsPerPageFiles}
                    />
                    </>
                    }
                </Paper>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}