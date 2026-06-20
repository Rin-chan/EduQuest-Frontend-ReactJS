// src/components/dashboard/quest/question/attempt/question-attempt-card.tsx

"use client";

import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CardHeader from "@mui/material/CardHeader";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { PaperPlaneTilt as PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeClosed as EyeClosedIcon } from "@phosphor-icons/react/dist/ssr/EyeClosed";
import { Divider, Alert, Stack, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, TextField, FormControl } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import type { UserAnswerAttempt, UserAnswerAttemptUpdateForm, UserShortAnswerAttempt, UserShortAnswerAttemptUpdateForm } from "@/types/user-answer-attempt";
import { type UserQuestAttemptUpdateForm } from "@/types/user-quest-attempt";
import { logger } from "@/lib/default-logger";
import { updateMultipleUserAnswerAttempts, updateMultipleUserShortAnswerAttempts } from "@/api/services/user-answer-attempt";
import { updateUserQuestAttempt, claimUserQuestAttemptBonus } from "@/api/services/user-quest-attempt";
import Points from "../../../../../../public/assets/point.svg";
import { useUser } from '@/hooks/use-user';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { getQuestBonusGame } from "@/api/services/quest";
import type { BonusGame } from "@/types/bonus-game";
import { CaretUp as CaretUpIcon } from "@phosphor-icons/react/dist/ssr/CaretUp";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { updateDailyGoals } from '@/api/services/eduquest-user';


interface AnswerAttemptCardProps {
  data: UserAnswerAttempt[] | UserShortAnswerAttempt[];
  onAnswerChange: (attemptId: number, answerId: number, isChecked: boolean) => void;
  onShortAnswerChange: (attemptId: number, answerId: number, text: string) => void;
  userQuestAttemptId: string;
  submitted: boolean;
  bonusAwarded: boolean;
  onHintUsed: (questionId: number) => void;
  onAnswerSubmit: (attemptId: string) => void;
  onAnswerSave: () => void;
  isPrivateQuest: boolean;
  questId: string;
}

interface GroupedQuestion {
  question: UserAnswerAttempt['question'];
  unstructuredanswer: UserShortAnswerAttempt | null;
  answers: UserAnswerAttempt[] | null;
}

/**
 * Parses the text and replaces KaTeX expressions with InlineMath components.
 *
 * @param text - The text containing KaTeX expressions.
 * @returns An array of React elements.
 */
const parseKaTeX = (text: string): React.ReactNode[] => {
  const parts = text.split(/(?<katex>\\\([\s\S]*?\\\))/g);

  return parts.map((part, index) => {
    if (part.startsWith('\\(') && part.endsWith('\\)')) {
      return (
        <InlineMath
          key={index}
          math={part.slice(2, -2)}
        />
      );
    }

    return part;
  });
};

export function AnswerAttemptCard({ data, userQuestAttemptId, onAnswerChange, onShortAnswerChange, submitted, bonusAwarded: initialBonusAwarded, onHintUsed, onAnswerSubmit: onAnswerSubmit, onAnswerSave, isPrivateQuest, questId }: AnswerAttemptCardProps): React.JSX.Element {
  const { checkSession, eduquestUser } = useUser();
  const [page, setPage] = React.useState(1);
  const [showExplanation, setShowExplanation] = React.useState<Record<number, boolean>>({});
  const rowsPerPage = 1; // Adjust as needed
  const [status, setStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [bonusOpen, setBonusOpen] = React.useState(false);
  const [bonusGame, setBonusGame] = React.useState<BonusGame | null>(null);
  const [bonusLoading, setBonusLoading] = React.useState(false);
  const [bonusLoadingProgress, setBonusLoadingProgress] = React.useState(0);
  const [bonusStatus, setBonusStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [bonusAwarded, setBonusAwarded] = React.useState(false);
  const [matchingSelections, setMatchingSelections] = React.useState<Record<number, string>>({});
  const [matchingOptions, setMatchingOptions] = React.useState<string[]>([]);
  const [orderingItems, setOrderingItems] = React.useState<string[]>([]);

  // 1. Group UserAnswerAttempt by Question using useMemo
  const groupedQuestions: GroupedQuestion[] = React.useMemo(() => {
    const map = new Map<number, GroupedQuestion>();
    data.forEach(attempt => {
      const q = attempt.question;
      if ((q.question_type === 'short_ans' || q.question_type === 'latex_short_ans') && !map.has(q.id)) {
        map.set(q.id, { question: q, unstructuredanswer: attempt as UserShortAnswerAttempt, answers: [] });
      }
      else if (!map.has(q.id)) {
        map.set(q.id, { question: q, unstructuredanswer: null, answers: [] });
      }

      map.get(q.id)?.answers?.push(attempt as UserAnswerAttempt);
    });

    // Sort answers by answer.id in ascending order
    map.forEach((group) => {
      if (group.answers) {
        group.answers.sort((a, b) => a.answer.id - b.answer.id);
      }
    });

    return Array.from(map.values()).sort((a, b) => a.question.number - b.question.number);
  }, [data]);

  // 2. Calculate pageCount after groupedQuestions is defined
  const pageCount = Math.ceil(groupedQuestions.length / rowsPerPage);

  // 3. Slice groupedQuestions to get current page's questions
  const currentPageQuestions = groupedQuestions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const markHintUsed = (questionId: number): void => {
    onHintUsed(questionId);
  };

  const refreshUser = async (): Promise<void> => {
    if (checkSession) {
      await checkSession();
    }
  };

  const bulkUpdateUserAnswerAttempts = async (updatedUserAnswerAttempts: UserAnswerAttemptUpdateForm[] | UserShortAnswerAttemptUpdateForm[]): Promise<void> => {
    try {
      if (data && (data[0].question.question_type === 'short_ans' || data[0].question.question_type === 'latex_short_ans')) {
        // @ts-expect-error type could be undeefined
        const response = await updateMultipleUserShortAnswerAttempts(updatedUserAnswerAttempts);
        logger.debug('Bulk Update UserShortAnswerAttempts Success:', response);
      }
      else {
        // @@ts-expect-errortype could be undeefined
        const response = await updateMultipleUserAnswerAttempts(updatedUserAnswerAttempts);
        logger.debug('Bulk Update UserAnswerAttempts Success:', response);
      }
    } catch (error: unknown) {
      logger.error('Bulk Update UserAnswerAttempts Failed:', error);
    }
  };

  /**
   * Handles the Save action.
   */
  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    const currentDate = new Date().toISOString();

    if (data && (data[0].question.question_type === 'short_ans' || data[0].question.question_type === 'latex_short_ans')) {
      // 1. Prepare the data to update is_selected
      const updatedUserAnswerAttempts: UserShortAnswerAttemptUpdateForm[] = data.map(attempt => ({
        id: attempt.id,
        text: 'unstructuredanswer' in attempt ? attempt.text : '',
        hint_used: attempt.hint_used,
      }));

      if (eduquestUser) {
        try {
          // 2. Update UserAnswerAttempts
          await bulkUpdateUserAnswerAttempts(updatedUserAnswerAttempts);

          // 3. Update UserQuestAttempt with last_attempted_date
          const updatedUserQuestAttempt: UserQuestAttemptUpdateForm = {
            submitted: false,
            last_attempted_date: currentDate,
            student_id: eduquestUser.id,
            quest_id: data[0].question.quest_id,
          };
          await updateUserQuestAttempt(userQuestAttemptId, updatedUserQuestAttempt);

          // 4. Refresh the user attempt table
          onAnswerSave();

          // 5. Update local state with calculated scores
          setStatus({ type: 'success', message: 'Save Successful.' });
          logger.debug('Save action completed successfully.');
        } catch (error) {
          setStatus({ type: 'error', message: 'Save Failed. Please try again.' });
          logger.error('Save action failed:', error);
        }
      }
    }
    else {
      // 1. Prepare the data to update is_selected
      const updatedUserAnswerAttempts: UserAnswerAttemptUpdateForm[] = data.map(attempt => ({
        id: attempt.id,
        is_selected: 'is_selected' in attempt ? attempt.is_selected : false,
        hint_used: attempt.hint_used,
      }));

      if (eduquestUser) {
        try {
          // 2. Update UserAnswerAttempts
          await bulkUpdateUserAnswerAttempts(updatedUserAnswerAttempts);

          // 3. Update UserQuestAttempt with last_attempted_date
          const updatedUserQuestAttempt: UserQuestAttemptUpdateForm = {
            submitted: false,
            last_attempted_date: currentDate,
            student_id: eduquestUser.id,
            quest_id: data[0].question.quest_id,
          };
          await updateUserQuestAttempt(userQuestAttemptId, updatedUserQuestAttempt);

          // 4. Refresh the user attempt table
          onAnswerSave();

          // 5. Update local state with calculated scores
          setStatus({ type: 'success', message: 'Save Successful.' });
          logger.debug('Save action completed successfully.');
        } catch (error) {
          setStatus({ type: 'error', message: 'Save Failed. Please try again.' });
          logger.error('Save action failed:', error);
        }
      }
    }


  };

  /**
   * Handles the Submit action.
   * Calculates scores, updates is_selected, sets submitted to true, updates last_attempted_date, and redirects.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const currentDate = new Date().toISOString();

    // 1. Calculate scores
    // const updatedData = calculateScores([...data]); // Clone data to avoid mutating state directly
    // logger.debug('Updated Data:', updatedData);
    // 2. Prepare the data to update is_selected and score_achieved
    if (data && (data[0].question.question_type === 'short_ans' || data[0].question.question_type === 'latex_short_ans')) {
      const updatedUserAnswerAttempts: UserShortAnswerAttemptUpdateForm[] = data.map(attempt => ({
        id: attempt.id,
        text: 'unstructuredanswer' in attempt ? attempt.text : '',
        hint_used: attempt.hint_used,
      }));

      logger.debug('Updated UserAnswerAttempts:', updatedUserAnswerAttempts);

      if (eduquestUser) {
        try {
          // 3. Update UserAnswerAttempts
          await bulkUpdateUserAnswerAttempts(updatedUserAnswerAttempts);

          // 4. Update UserQuestAttempt with submitted=true and last_attempted_date
          const updatedUserQuestAttempt: UserQuestAttemptUpdateForm = {
            submitted: true,
            last_attempted_date: currentDate,
            student_id: eduquestUser.id,
            quest_id: data[0].question.quest_id,
          };
          await updateUserQuestAttempt(userQuestAttemptId, updatedUserQuestAttempt);

          // 5. Update User Daily Goals if they have any goals related to quests
          await updateUserDailyGoals();

          // 6. Update local state with calculated scores
          setStatus({ type: 'success', message: 'Submit Successful! Redirecting to Quest page...' });
          logger.debug('Submit action completed successfully.');

          // 7. Optionally, refresh user session or data here
          await refreshUser();

          // 8. Redirect to Quest page after submission
          onAnswerSubmit(userQuestAttemptId);

          // 5. Update local state with calculated scores
          setStatus({ type: 'success', message: 'Save Successful.' });
          logger.debug('Save action completed successfully.');
        } catch (error) {
          setStatus({ type: 'error', message: 'Save Failed. Please try again.' });
          logger.error('Save action failed:', error);
        }
      }
    }
    else {
      const updatedUserAnswerAttempts: UserAnswerAttemptUpdateForm[] = data.map(attempt => ({
        id: attempt.id,
        is_selected: 'is_selected' in attempt ? attempt.is_selected : false,
        hint_used: attempt.hint_used,
      }));

      logger.debug('Updated UserAnswerAttempts:', updatedUserAnswerAttempts);

      if (eduquestUser) {
        try {
          // 3. Update UserAnswerAttempts
          await bulkUpdateUserAnswerAttempts(updatedUserAnswerAttempts);

          // 4. Update UserQuestAttempt with submitted=true and last_attempted_date
          const updatedUserQuestAttempt: UserQuestAttemptUpdateForm = {
            submitted: true,
            last_attempted_date: currentDate,
            student_id: eduquestUser.id,
            quest_id: data[0].question.quest_id,
          };
          await updateUserQuestAttempt(userQuestAttemptId, updatedUserQuestAttempt);

          // 5. Update User Daily Goals if they have any goals related to quests
          await updateUserDailyGoals();

          // 6. Update local state with calculated scores
          setStatus({ type: 'success', message: 'Submit Successful! Redirecting to Quest page...' });
          logger.debug('Submit action completed successfully.');

          // 7. Optionally, refresh user session or data here
          await refreshUser();

          // 8. Redirect to Quest page after submission
          onAnswerSubmit(userQuestAttemptId);
        } catch (error) {
          setStatus({ type: 'error', message: 'Submit Failed. Please try again.' });
          logger.error('Submit action failed:', error);
        }
      }
    };
  };

  const toggleExplanation = (questionId: number): void => {
    setShowExplanation(prevState => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const handleCheckboxChange = (attemptId: number, answerId: number, isChecked: boolean): void => {
    onAnswerChange(attemptId, answerId, isChecked);
  };

  const handleTextFieldChange = (attemptId: number, answerId: number, text: string): void => {
    onShortAnswerChange(attemptId, answerId, text);
  };

  const shuffleArray = (items: string[]): string[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const handleOpenBonus = async (): Promise<void> => {
    setBonusOpen(true);
    setBonusStatus(null);
    if (bonusGame || bonusLoading) {
      return;
    }
    try {
      setBonusLoading(true);
      setBonusLoadingProgress(10);
      const response = await getQuestBonusGame(questId);
      setBonusGame(response);
      setBonusLoadingProgress(100);
    } catch (error: unknown) {
      logger.error('Failed to fetch bonus game', error);
      setBonusStatus({ type: 'error', message: 'Failed to load bonus game. Please try again.' });
    } finally {
      setBonusLoading(false);
    }
  };

  const handleCloseBonus = (): void => {
    setBonusOpen(false);
    setBonusLoadingProgress(0);
  };

  React.useEffect(() => {
    setBonusAwarded(Boolean(initialBonusAwarded));
  }, [initialBonusAwarded, userQuestAttemptId]);

  React.useEffect(() => {
    if (!bonusLoading) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setBonusLoadingProgress((prevProgress) => {
        if (prevProgress >= 90) {
          return prevProgress;
        }
        return Math.min(prevProgress + 8, 90);
      });
    }, 300);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [bonusLoading]);

  React.useEffect(() => {
    if (!bonusGame) {
      return;
    }
    setBonusStatus(null);
    if (bonusGame.game_type === 'matching') {
      setMatchingSelections({});
      setMatchingOptions(shuffleArray(bonusGame.pairs.map(pair => pair.right)));
    } else {
      setOrderingItems(shuffleArray(bonusGame.items));
    }
  }, [bonusGame]);

  const handleMatchChange = (index: number, value: string): void => {
    setMatchingSelections(prevState => ({
      ...prevState,
      [index]: value
    }));
  };

  const moveOrderingItem = (index: number, direction: 'up' | 'down'): void => {
    setOrderingItems(prevItems => {
      const nextItems = [...prevItems];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= nextItems.length) {
        return prevItems;
      }
      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return nextItems;
    });
  };

  const handleBonusSubmit = async (): Promise<void> => {
    if (!bonusGame) {
      return;
    }

    if (bonusGame.game_type === 'matching') {
      const allSelected = bonusGame.pairs.every((_pair, index) => Boolean(matchingSelections[index]));
      if (!allSelected) {
        setBonusStatus({ type: 'error', message: 'Please complete all matches.' });
        return;
      }
      const correct = bonusGame.pairs.every((pair, index) => matchingSelections[index] === pair.right);
      if (!correct) {
        setBonusStatus({ type: 'error', message: 'Not quite right. Try again.' });
        return;
      }
    } else {
      const correctOrder = bonusGame.answer_order.map(index => bonusGame.items[index]);
      const correct = orderingItems.every((item, index) => item === correctOrder[index]);
      if (!correct) {
        setBonusStatus({ type: 'error', message: 'Sequence is incorrect. Try again.' });
        return;
      }
    }

    try {
      const response = await claimUserQuestAttemptBonus(userQuestAttemptId);
      setBonusAwarded(response.bonus_awarded);
      setBonusStatus({ type: 'success', message: `Bonus +${String(response.bonus_points)} points awarded!` });
      await refreshUser();
      onAnswerSave();
      handleCloseBonus();
    } catch (error: unknown) {
      logger.error('Failed to award bonus points', error);
      const apiMessage = axios.isAxiosError(error)
        ? ((error.response?.data as { error?: string } | undefined)?.error || null)
        : null;
      setBonusStatus({ type: 'error', message: apiMessage || 'Failed to award bonus points. Please try again.' });
    }
  };

  const updateUserDailyGoals = async (): Promise<void> => {
    if(isPrivateQuest && eduquestUser) {
      let dailyGoals = eduquestUser.daily_goals;
      dailyGoals.forEach((goals) => {
        // 1 is the constant for GoalsAvailable
        if(goals.task === 1) {
          goals.complete += 1;
        }
      });
      
      await updateDailyGoals(dailyGoals);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        {isPrivateQuest ? (
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button
              size="small"
              variant="text"
              onClick={handleOpenBonus}
              disabled={bonusAwarded || submitted}
            >
              {bonusAwarded ? 'Bonus Claimed' : 'Play Bonus Game (+5)'}
            </Button>
          </Stack>
        ) : null}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
        </Box>
        <Grid container spacing={4}>
          {currentPageQuestions.map(({ question, unstructuredanswer, answers }) => (
            <Grid key={question.id} xs={12}>
              <Card>
                <CardHeader
                  title={`Question ${question.number.toString()}`}
                  subheader={
                    <Stack direction="row" spacing='6px' sx={{ alignItems: 'center', pt: 0.5 }}>
                      <Typography variant="body2">{question.max_score}</Typography>
                      <Points height={18} />
                    </Stack>
                  }
                  action={submitted && (question.answers.some(a => a.reason) || question.unstructuredanswer) ? (
                      <Button
                        startIcon={showExplanation[question.id] ? <EyeClosedIcon /> : <EyeIcon />}
                        onClick={() => { toggleExplanation(question.id); }}
                      >
                        {showExplanation[question.id] ? 'Hide Explanation' : 'Show Explanation'}
                      </Button>
                    ) : null
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12}>
                      <Typography variant="subtitle1">
                        {parseKaTeX(question.text)}
                      </Typography>
                      {question.hint ? (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => { markHintUsed(question.id); }}
                          disabled={answers ? answers.some(a => a.hint_used) : unstructuredanswer?.hint_used}
                          sx={{ mt: 1, px: 0 }}
                        >
                          {answers ? answers.some(a => a.hint_used) ? 'Hint Used (-5 points)' : 'Show Hint (-5 points)' : unstructuredanswer?.hint_used ? 'Hint Used (-5 points)' : 'Show Hint (-5 points)'}
                        </Button>
                      ) : null}
                      {question.hint && (answers?.some(a => a.hint_used) || unstructuredanswer?.hint_used) ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {parseKaTeX(question.hint)}
                        </Typography>
                      ) : null}
                    </Grid>
                    {
                      question.question_type === 'short_ans' || question.question_type === 'latex_short_ans' ?
                      <>
                        <Grid key={unstructuredanswer?.unstructuredanswer.id} md={6} xs={12}>
                            <Stack spacing={1}>
                              <FormControl
                                fullWidth
                                required
                              >
                                <TextField
                                    value={unstructuredanswer?.text ?? ''}
                                    variant='outlined'
                                    multiline
                                    rows={3}
                                    onChange={(e) => { handleTextFieldChange(unstructuredanswer?.id ?? -1, unstructuredanswer?.unstructuredanswer?.id ?? -1, e.currentTarget.value); }}
                                    disabled={submitted}
                                  />
                              </FormControl>
                              {submitted ? (
                                <Stack direction="row" spacing={1} sx={{ mt: -0.5 }}>
                                  <Chip 
                                    size="small" 
                                    color={unstructuredanswer?.score_achieved === question.max_score ? "success" : unstructuredanswer && unstructuredanswer?.score_achieved >= (question.max_score/2) ? "warning" : "error"} 
                                    label={unstructuredanswer?.score_achieved === question.max_score ? 'Correct Answer' : unstructuredanswer && unstructuredanswer?.score_achieved >= (question.max_score/2) ? "Partially Correct" : 'Wrong Answer'}
                                  />
                                </Stack>
                              ) : null}
                              {showExplanation[question.id ?? -1] && unstructuredanswer?.unstructuredanswer.reason ? (
                                <Typography variant="body2" mt={0.5}>
                                  {parseKaTeX(unstructuredanswer?.unstructuredanswer.reason)}
                                </Typography>
                              ) : null}
                            </Stack>
                          </Grid>
                      </>
                      :
                      <>
                        {answers?.map((attempt) => {
                        const isCorrect = Boolean(attempt.answer.is_correct);
                        const isSelected = Boolean(attempt.is_selected);
                        const statusLabel = isCorrect
                          ? 'Correct Answer'
                          : isSelected
                            ? 'Wrong Answer'
                            : 'Not Correct';
                        return (
                          <Grid key={attempt.answer.id} md={6} xs={12}>
                            <Stack spacing={1}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={attempt.is_selected}
                                    onChange={(e) => { handleCheckboxChange(attempt.id, attempt.answer.id, e.target.checked); }}
                                    disabled={submitted}
                                  />
                                }
                                label={parseKaTeX(attempt.answer.text)}
                              />
                              {submitted ? (
                                <Stack direction="row" spacing={1} sx={{ mt: -0.5 }}>
                                  <Chip size="small" color={isCorrect ? "success" : isSelected ? "error" : "default"} label={statusLabel} />
                                </Stack>
                              ) : null}
                              {showExplanation[attempt.question.id] && attempt.answer.reason ? (
                                <Typography variant="body2" mt={0.5}>
                                  {parseKaTeX(attempt.answer.reason)}
                                </Typography>
                              ) : null}
                            </Stack>
                          </Grid>
                        );
                        })}
                      </>
                    }
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Stack direction="row" pl={2}>
                    { submitted ?
                      <Typography variant="subtitle2">
                        Score Achieved: {answers?.reduce((acc, curr) => acc + curr.score_achieved, 0).toFixed(2)} / {question.max_score}
                      </Typography> : null
                    }
                      </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<FloppyDiskIcon />}
                      variant="outlined"
                      onClick={handleSave}
                      disabled={submitted}
                    >
                      Save All
                    </Button>
                    <Button
                      endIcon={<PaperPlaneTiltIcon />}
                      type="submit"
                      variant="contained"
                      disabled={submitted}
                    >
                      Submit All
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {status ? <Alert severity={status.type} sx={{ marginTop: 2 }}>
            {status.message}
          </Alert> : null}
      </FormGroup>
      <Dialog open={bonusOpen} onClose={handleCloseBonus} fullWidth maxWidth="sm">
        <DialogTitle>Bonus Game (+5 Points)</DialogTitle>
        <DialogContent>
          {bonusLoading ? (
            <Stack spacing={1.5} sx={{ py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Generating bonus game...
              </Typography>
              <LinearProgress variant="determinate" value={bonusLoadingProgress} />
              <Typography variant="caption" color="text.secondary">
                This can take a few seconds.
              </Typography>
            </Stack>
          ) : bonusGame ? (
            <Stack spacing={2}>
              <Typography variant="subtitle1">{bonusGame.prompt}</Typography>
              {bonusGame.hint ? (
                <Typography variant="body2" color="text.secondary">Hint: {bonusGame.hint}</Typography>
              ) : null}
              {bonusGame.game_type === 'matching' ? (
                <Stack spacing={2}>
                  {bonusGame.pairs.map((pair, index) => (
                    <Stack key={`pair-${String(index)}`} direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" sx={{ minWidth: '40%' }}>{pair.left}</Typography>
                      <Select
                        size="small"
                        value={matchingSelections[index] || ''}
                        onChange={(event) => { handleMatchChange(index, event.target.value); }}
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>Select match</em>
                        </MenuItem>
                        {matchingOptions.map((option) => (
                          <MenuItem key={`option-${option}`} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Stack spacing={1}>
                  {orderingItems.map((item, index) => (
                    <Stack key={`order-${item}`} direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>{item}</Typography>
                      <Button size="small" onClick={() => { moveOrderingItem(index, 'up'); }} disabled={index === 0}>
                        <CaretUpIcon />
                      </Button>
                      <Button size="small" onClick={() => { moveOrderingItem(index, 'down'); }} disabled={index === orderingItems.length - 1}>
                        <CaretDownIcon />
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              )}
              {bonusStatus ? (
                <Alert severity={bonusStatus.type}>{bonusStatus.message}</Alert>
              ) : null}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">No bonus game available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBonus}>Close</Button>
          <Button variant="contained" onClick={handleBonusSubmit} disabled={!bonusGame || bonusLoading}>
            Submit Bonus
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
