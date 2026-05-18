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
import { Course } from '@/types/course';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { set } from 'react-hook-form';

interface TestDataProps {
    course: Course;
    open: boolean;
    setOpen: (open: boolean) => void;
}

function createDataFiles(
    id: number,
    file: string
) {
  return { id, file };
}

const rows1 = [
    createDataFiles(1, 'Test1'),
    createDataFiles(2, 'Test2'),
    createDataFiles(3, 'Test3'),
    createDataFiles(4, 'Test4'),
    createDataFiles(5, 'Test5'),
];

function createDataScores(
    id: number,
    email: string,
    name: string,
    score: number
) {
  return { id, email, name, score };
}

const rows2 = [
    createDataScores(1, 'john.doe@example.com', 'John Doe', 85),
    createDataScores(2, 'jane.smith@example.com', 'Jane Smith', 92),
    createDataScores(3, 'alice.johnson@example.com', 'Alice Johnson', 78),
    createDataScores(4, 'bob.brown@example.com', 'Bob Brown', 95),
    createDataScores(5, 'charlie.davis@example.com', 'Charlie Davis', 88)
];

export function TestData({open, setOpen, course}: TestDataProps): React.JSX.Element {
    const handleClose = () => {
        setOpen(false);
    };

    const [pageFiles, setPageFiles] = React.useState(0);
    const [pageScores, setPageScores] = React.useState(0);
    const [rowsPerPageFiles, setRowsPerPageFiles] = React.useState(2);
    const [rowsPerPageScores, setRowsPerPageScores] = React.useState(2);
    const [deleteConfirmation, setDeleteConfirmation] = React.useState(false);
    const [selected, setSelected] = React.useState<number>(-1);
    const [editing, setEditing] = React.useState(false);

    const handleChangePageFiles = (event: unknown, newPage: number) => {
        setPageFiles(newPage);
    };

    const handleChangeRowsPerPageFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPageFiles(parseInt(event.target.value, 10));
        setPageFiles(0);
    };

    const visibleRowsFiles = React.useMemo(
        () =>
        [...rows1]
            .slice(pageFiles * rowsPerPageFiles, pageFiles * rowsPerPageFiles + rowsPerPageFiles),
        [pageFiles, rowsPerPageFiles],
    );

    const handleChangePageScores = (event: unknown, newPage: number) => {
        setPageScores(newPage);
    };

    const handleChangeRowsPerPageScores = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPageScores(parseInt(event.target.value, 10));
        setPageScores(0);
    };

    const visibleRowsScores = React.useMemo(
        () =>
        [...rows2]
            .slice(pageScores * rowsPerPageScores, pageScores * rowsPerPageScores + rowsPerPageScores),
        [pageScores, rowsPerPageScores],
    );

    const editFile = (id: number): void => {
        setSelected(id);
        setEditing(true);
    }

    const confirmDelete = (id: number, confirm: boolean): void => {
        setSelected(id);
        setDeleteConfirmation(confirm);
    }

    const deleteFile = (id: number): void => {
        setSelected(-1);
        setDeleteConfirmation(false);
        console.log(`Delete file with id ${id}`);
    }

    const changeScore = (id: number, score: number): void => {
        const index = rows2.findIndex(row => row.id === id);
        if (index !== -1) {
            rows2[index].score = score;
        }
    }

    const saveEdit = (): void => {
        setSelected(-1);
        setEditing(false);
        console.log('Saved changes');
    }

    return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            {selected !== -1 && editing ? `Editing File ID: ${selected}` : 'All Test Data'}
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose}></Button>
            </Stack>
        </DialogTitle>
        <DialogContent>
            <Box>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    {editing ?
                    <>
                    <TableContainer>
                    <Table
                        sx={{ minWidth: '50vw' }}
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
                        {visibleRowsScores.map((row, index) => {
                            return (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        margin="dense"
                                        fullWidth
                                        variant="standard"
                                        id="score"
                                        type="number"
                                        defaultValue={row.score}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            changeScore(row.id, parseInt(event.target.value));
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
                    rowsPerPageOptions={[2, 5, 25]}
                    component="div"
                    count={rows2.length}
                    rowsPerPage={rowsPerPageScores}
                    page={pageScores}
                    onPageChange={handleChangePageScores}
                    onRowsPerPageChange={handleChangeRowsPerPageScores}
                    />

                    <Stack direction="row" sx={{ alignContent: 'right', justifyContent: 'right' }}>
                        <Button variant='contained' onClick={saveEdit}>
                            Save
                        </Button>
                    </Stack>
                    </>
                    :
                    <>
                    <TableContainer>
                    <Table
                        sx={{ minWidth: '50vw' }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <TableHead>
                        <TableRow>
                            <TableCell>File</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {visibleRowsFiles.map((row, index) => {
                            return (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{row.file}</TableCell>
                                <TableCell align="center">
                                    {deleteConfirmation && selected === row.id ? (
                                        <>
                                        <Button variant="contained" onClick={() => confirmDelete(row.id, false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => deleteFile(row.id)}>
                                            Confirm Delete
                                        </Button>
                                        </>
                                    ) : (
                                        <>
                                        <Button variant="contained" color="primary" onClick={() => editFile(row.id)}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => confirmDelete(row.id, true)}>
                                            Delete
                                        </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                    rowsPerPageOptions={[2, 5, 25]}
                    component="div"
                    count={rows1.length}
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