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
import Popover from '@mui/material/Popover/Popover';
import { UserCourseGroupEnrollment } from '@/types/user-course-group-enrollment';
import { getUserCourseGroupEnrollmentsByCourseGroup } from '@/api/services/user-course-group-enrollment';
import {logger} from "@/lib/default-logger";
import type { Course } from "@/types/course";
import { AccountPopup } from '../account/account-popup';
import { getEduquestUser, getEduquestCosmeticDetail } from '@/api/services/eduquest-user';
import type { EduquestUser, EduquestUserCosmeticResult } from '@/types/eduquest-user';
import {useTheme} from '@mui/material/styles';

interface LeaderboardTableProps {
  course: Course;
}

export function LeaderboardTable({ course }: LeaderboardTableProps): React.JSX.Element {
    const theme = useTheme();
    const [rows, setRows] = React.useState<UserCourseGroupEnrollment[]>([])
    const [selected, setSelected] = React.useState<number>(-1);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(2);
    const [anchorElPosHorizontal, setAnchorElPosHorizontal] = React.useState<number>(0);
    const [anchorElPosVertical, setAnchorElPosVertical] = React.useState<number>(0);

    const [popupUser, setPopupUser] = React.useState<EduquestUser | null>(null);
    const [popupCosmetic, setPopupCosmetic] = React.useState<EduquestUserCosmeticResult | null>(null);
    const [userDataMap, setUserDataMap] = React.useState<
        Record<number, {
            user: EduquestUser;
            cosmetic: EduquestUserCosmeticResult | null;
        }>
    >({});

    const handleClick = (
        event: React.MouseEvent<unknown>,
        row: UserCourseGroupEnrollment
    ) => {
        if (selected === row.student_id) {
            setSelected(-1);
            return;
        }

        const data = userDataMap[row.student_id];

        if (data) {
            setPopupUser(data.user);
            setPopupCosmetic(data.cosmetic);
        }

        setAnchorElPosHorizontal(event.clientX);
        setAnchorElPosVertical(event.clientY);
        setSelected(row.student_id);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollments =
                    await getUserCourseGroupEnrollmentsByCourseGroup(
                        course.id.toString()
                    );

                setRows(enrollments);

                const userDataEntries = await Promise.all(
                    enrollments
                        .filter((row) => row.student)
                        .map(async (row) => {
                            const [user, cosmetic] = await Promise.all([
                                getEduquestUser(row.student_id.toString()),
                                getEduquestCosmeticDetail(row.student!.email),
                            ]);

                            return [
                                row.student_id,
                                {
                                    user,
                                    cosmetic,
                                },
                            ] as const;
                        })
                );

                setUserDataMap(Object.fromEntries(userDataEntries));
            } catch (error) {
                logger.error("Failed to fetch data", error);
            }
        };

        fetchData().catch(() => { return; });
    }, [course.id]);

    const handleClose = (): void => {
        setSelected(-1);
    };

    const handleChangePage = (event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = React.useMemo(
        () =>
            [...rows].slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [rows, page, rowsPerPage]
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
                        const isItemSelected = selected === row.student_id;

                        return (
                        <TableRow
                            hover
                            onClick={(event) => {handleClick(event, row)}}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.student_id}
                            sx={{ cursor: 'pointer',
                                backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, ${ userDataMap[row.student_id]?.cosmetic?.profile_background ?? theme.palette.background.paper }, ${theme.palette.background.paper})`
                             }}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="center">{row.student?.nickname}</TableCell>
                            <TableCell align="right">{row.student?.email}</TableCell>
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

            <Popover
                open={selected !== -1}
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
                <AccountPopup
                    eduquestUser={popupUser}
                    cosmetic={popupCosmetic}
                />
            </Popover>
        </Paper>

    </Box>
  );
}