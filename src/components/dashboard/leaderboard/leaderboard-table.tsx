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
import {logger} from "@/lib/default-logger";
import { AccountPopup } from '../account/account-popup';
import type { EduquestUser, EduquestUserCosmeticResult } from '@/types/eduquest-user';
import {useTheme} from '@mui/material/styles';
import {UserAvatar} from "@/components/auth/user-avatar";
import Avatar from "@mui/material/Avatar";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import Stack from "@mui/material/Stack";
import type { Course } from '@/types/course';
import type { UserData } from '@/types/leaderboard';
import { getCourseLeaderboard } from '@/api/services/leaderboard';

interface LeaderboardTableProps {
  course: Course;
  hideLeaderboard: boolean;
}

export function LeaderboardTable({ course, hideLeaderboard }: LeaderboardTableProps): React.JSX.Element {
    const theme = useTheme();
    const [selected, setSelected] = React.useState<number>(-1);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [anchorElPosHorizontal, setAnchorElPosHorizontal] = React.useState<number>(0);
    const [anchorElPosVertical, setAnchorElPosVertical] = React.useState<number>(0);

    const [popupUser, setPopupUser] = React.useState<EduquestUser | null>(null);
    const [popupCosmetic, setPopupCosmetic] = React.useState<EduquestUserCosmeticResult | null>(null);
    const [userDataMap, setUserDataMap] = React.useState<Record<number, UserData>>({});

    function formatName(name: string | undefined): string {
        if (!name) return '';
        // Remove the starting and ending #
        return name.replace(/^#|#$/g, '')
    }

    const handleClick = (
        event: React.MouseEvent<unknown>,
        studentId: number
    ): void => {
        if (selected === studentId) {
            setSelected(-1);
            return;
        }

        const data = userDataMap[studentId];

        if (data) {
            setPopupUser(data.user ?? null);
            setPopupCosmetic(data.cosmetic ?? null);
        }

        setAnchorElPosHorizontal(event.clientX);
        setAnchorElPosVertical(event.clientY);
        setSelected(studentId);

        return;
    };

    const showLeaderboard = () => {
        if (!course) return;

        const fetchData = async () => {
            try {
                const data = await getCourseLeaderboard(
                    course.id.toString()
                );

                setUserDataMap(data);
            } catch (error) {
                logger.error("Failed to fetch data", error);
            }
        };

        fetchData().catch(() => { return; });
    };

    const sortedRows = React.useMemo(() => {
        return Object.entries(userDataMap)
            .sort(([, a], [, b]) => b.score - a.score)
            .map(([studentId, data]) => ({
                student_id: Number(studentId),
                ...data,
            }));
    }, [userDataMap]);

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
            [...sortedRows].slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [sortedRows, page, rowsPerPage]
    );

    React.useEffect(() => {
        if(!hideLeaderboard) {showLeaderboard()};
    }, [hideLeaderboard])

    return (
    <Box>

        <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
            <Table
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
                            onClick={(event) => {handleClick(event, row.student_id)}}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.student_id}
                            sx={{ cursor: 'pointer',
                                backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, ${ userDataMap[row.student_id]?.cosmetic?.profile_background ?? theme.palette.background.paper }, ${theme.palette.background.paper})`
                             }}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="center">
                                <Stack direction='row' alignItems='center'>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 72,
                                            height: 72,
                                            aspectRatio: '1 / 1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 2
                                        }}
                                        >
                                        {
                                            userDataMap[row.student_id]?.cosmetic?.profile_border?.image.filename ?
                                            <Box
                                            component="img"
                                            src={`/assets/${userDataMap[row.student_id]?.cosmetic?.profile_border.image.filename ?? ''}`}
                                            sx={{
                                                position: 'absolute',
                                                width: 72,
                                                height: 72,
                                                top: 0,
                                                left: 0,
                                                pointerEvents: 'none',
                                                zIndex: 1,
                                            }}
                                            />
                                            : null
                                        }
                    
                                        {
                                            userDataMap[row.student_id]?.cosmetic?.profile_picture === undefined || userDataMap[row.student_id]?.cosmetic?.profile_picture === null ?
                                            <UserAvatar size='48px' {... {
                                                name: formatName(userDataMap[row.student_id]?.user.nickname),
                                                bgColor: 'var(--mui-palette-neutral-900)',
                                                textColor: "white",
                                            }}/>
                                            : userDataMap[row.student_id]?.cosmetic?.profile_picture?.image?.filename ?
                                            <Avatar
                                                src={`/assets/${userDataMap[row.student_id]?.cosmetic?.profile_picture?.image.filename ?? ''}`}
                                                sx={{width: 48, height: 48}}
                                            /> : <UserIcon size={32} color="var(--mui-palette-primary-main)" />
                                        }
                                    </Box>
                                    {userDataMap[row.student_id]?.user?.nickname}
                                </Stack>
                            </TableCell>
                            <TableCell align="right">{userDataMap[row.student_id]?.score.toString() ?? 0}</TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedRows.length}
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