import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useTheme from '@mui/material/styles/useTheme';
import Popover from '@mui/material/Popover/Popover';

import type { Course } from "@/types/course";
import { AccountPopup } from '../account/account-popup';

interface LeaderboardTableProps {
  course: Course;
}

function createData(
    id: number,
    user: string,
    score: number,
) {
  return { id, user, score };
}

const rows = [
    createData(1, 'John Doe', 95),
    createData(2, 'Jane Smith', 90),
    createData(3, 'Alice Johnson', 85),
    createData(4, 'Bob Brown', 80),
    createData(5, 'Charlie Davis', 75),
];

// Currently missing implementation of course and sorting by score to get rank
export function LeaderboardTable({ course }: LeaderboardTableProps): React.JSX.Element {
    const theme = useTheme();

    const [selected, setSelected] = React.useState<number>(-1);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(2);
    const [anchorEl, setAnchorEl] = React.useState(-1);
    const [anchorElPosHorizontal, setAnchorElPosHorizontal] = React.useState(0);
    const [anchorElPosVertical, setAnchorElPosVertical] = React.useState(0);

    // For cosmetic
    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        if (selected === id) {
            setSelected(-1);
            return;
        }
        setSelected(id);

        setAnchorEl(id);
        setAnchorElPosHorizontal(event.clientX);
        setAnchorElPosVertical(event.clientY);
    };

    const handleClose = () => {
        setAnchorEl(-1);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = React.useMemo(
        () =>
        [...rows]
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage],
    );

  return (
    <Box>


        <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
            <Table
                sx={{ minWidth: '80vw' }}
                aria-labelledby="tableTitle"
                size="medium"
            >
                <TableHead>
                <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell align="center">User</TableCell>
                    <TableCell align="right">Score</TableCell>
                </TableRow>
                </TableHead>

                <TableBody>
                {visibleRows.map((row, index) => {
                    const isItemSelected = selected === row.id;

                    return (
                    <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Popover
                            id={row.id}
                            open={anchorEl === row.id ?  'simple-popover' : undefined}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorReference="anchorPosition"
                            anchorPosition={{
                                top: anchorElPosVertical,
                                left: anchorElPosHorizontal
                            }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <AccountPopup userId={row.id} />
                        </Popover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell align="center">{row.user}</TableCell>
                        <TableCell align="right">{row.score}</TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[2, 5, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>

    </Box>
  );
}