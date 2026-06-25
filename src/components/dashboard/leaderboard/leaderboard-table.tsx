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
import type { UserCourseGroupEnrollment } from '@/types/user-course-group-enrollment';
import { getUserCourseGroupEnrollmentsByCourseGroup } from '@/api/services/user-course-group-enrollment';
import {logger} from "@/lib/default-logger";
import { AccountPopup } from '../account/account-popup';
import { getEduquestUser, getEduquestCosmeticDetail } from '@/api/services/eduquest-user';
import type { EduquestUser, EduquestUserCosmeticResult } from '@/types/eduquest-user';
import {useTheme} from '@mui/material/styles';
import {UserAvatar} from "@/components/auth/user-avatar";
import Avatar from "@mui/material/Avatar";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import Stack from "@mui/material/Stack";
import {getQuestsByCourseGroup} from '@/api/services/quest';
import {getUserQuestAttemptsByUserAndQuest} from '@/api/services/user-quest-attempt';
import {getTestScoresByCourseGroup, getUserTestScoresByTest} from '@/api/services/test-score';
import type { CourseGroup } from '@/types/course-group';

interface LeaderboardTableProps {
  courseGroups: CourseGroup[] | null | undefined;
}

export function LeaderboardTable({ courseGroups }: LeaderboardTableProps): React.JSX.Element {
    const theme = useTheme();
    const [rows, setRows] = React.useState<UserCourseGroupEnrollment[]>([])
    const [selected, setSelected] = React.useState<number>(-1);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
    const [anchorElPosHorizontal, setAnchorElPosHorizontal] = React.useState<number>(0);
    const [anchorElPosVertical, setAnchorElPosVertical] = React.useState<number>(0);

    const [popupUser, setPopupUser] = React.useState<EduquestUser | null>(null);
    const [popupCosmetic, setPopupCosmetic] = React.useState<EduquestUserCosmeticResult | null>(null);
    const [userDataMap, setUserDataMap] = React.useState<
        Record<number, {
            user: EduquestUser;
            cosmetic: EduquestUserCosmeticResult | null;
            score: number;
        }>
    >({});

    function formatName(name: string | undefined): string {
        if (!name) return '';
        // Remove the starting and ending #
        return name.replace(/^#|#$/g, '')
    }

    const handleClick = (
        event: React.MouseEvent<unknown>,
        row: UserCourseGroupEnrollment
    ): void => {
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
        if (!courseGroups) return;

        const fetchData = async () => {
            try {
                let enrollments = (await Promise.all(
                    courseGroups.map((courseGroup) =>
                        getUserCourseGroupEnrollmentsByCourseGroup(
                            courseGroup.id.toString()
                        )
                    )
                )).flat();
                
                // Prevent duplicate if user belongs in multiple groups (which shouldn't be the case anyways)
                enrollments = Array.from(
                    new Map(
                        enrollments.map((e) => [e.student_id, e])
                    ).values()
                );

                setRows(enrollments);

                const quests = (await Promise.all(
                    courseGroups.map((courseGroup) =>
                        getQuestsByCourseGroup(
                            courseGroup.id.toString()
                        )
                    )
                )).flat();
                
                const testScoresList = (await Promise.all(
                    courseGroups.map((courseGroup) =>
                        getTestScoresByCourseGroup(courseGroup.id.toString())
                    )
                )).flat();

                const testWeightMap = Object.fromEntries(
                    testScoresList.map((t) => [t.id, t.weightage ?? 0])
                );
                const allUserTestScores = await Promise.all(
                    testScoresList.map(async (test) => {
                        return await getUserTestScoresByTest(test.id.toString());
                    })
                );
                const flattenedTestScores = allUserTestScores.flat();

                const testScoreMap = flattenedTestScores.reduce<Record<number, number>>((acc, item) => {
                    const studentId = item.student.id;
                    const testId = item.test.id;

                    const weightage = testWeightMap[testId] ?? 0;

                    const weightedScore = (item.score ?? 0) * (weightage / 100);

                    acc[studentId] = (acc[studentId] ?? 0) + weightedScore;

                    return acc;
                }, {});

                const userDataEntries = await Promise.all(
                    enrollments
                        .filter((row) => row.student)
                        .map(async (row) => {
                            const [user, cosmetic] = await Promise.all([
                                getEduquestUser(row.student_id.toString()),
                                getEduquestCosmeticDetail(row.student!.email),
                        ]);

                        const attempts = await Promise.all(
                            quests.map((quest) =>
                                getUserQuestAttemptsByUserAndQuest(
                                    row.student_id.toString(),
                                    quest.id.toString()
                                )
                            )
                        );

                        const attemptsTotalScore = attempts
                            .flat()
                            .reduce(
                            (sum, attempt) => sum + (attempt?.total_score_achieved ?? 0),
                            0
                            );

                        const testScore = Math.floor(testScoreMap[row.student_id] ?? 0);

                        return {
                            student_id: row.student_id,
                            user,
                            cosmetic,
                            score: attemptsTotalScore + testScore,
                        };
                    })
                );

                const sortedEntries = userDataEntries.sort((a, b) => b.score - a.score);

                setUserDataMap(
                    Object.fromEntries(
                        sortedEntries.map((item) => [item.student_id, item])
                    )
                );
            } catch (error) {
                logger.error("Failed to fetch data", error);
            }
        };

        fetchData().catch(() => { return; });
    }, [courseGroups]);

    const sortedRows = React.useMemo(
        () => {
        return [...rows].sort((a, b) => {
            const scoreA = userDataMap[a.student_id]?.score ?? 0;
            const scoreB = userDataMap[b.student_id]?.score ?? 0;
            return scoreB - scoreA;
        });
    }, [rows, userDataMap]);

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
                            onClick={(event) => {handleClick(event, row)}}
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
                                    {row.student?.nickname}
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