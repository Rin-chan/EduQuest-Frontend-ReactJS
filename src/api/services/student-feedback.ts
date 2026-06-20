import apiService from '@/api/api-service';
import microService from '@/api/micro-service';
import { getUserAnswerAttemptByUserQuestAttempt, getUserShortAnswerAttemptByUserQuestAttempt } from '@/api/services/user-answer-attempt';
import type { StudentFeedback } from '@/types/student-feedback';
import type { UserAnswerAttempt, UserShortAnswerAttempt } from '@/types/user-answer-attempt';
import { getQuestionsByQuest } from '@/api/services/question';

export const getStudentFeedbackByAttempt = async (attemptId: string): Promise<StudentFeedback | null> => {
  const response = await apiService.get<StudentFeedback | Record<string, never>>(
    `/api/student-feedback/by_attempt/?user_quest_attempt_id=${attemptId}`
  );

  if (!response.data || !('id' in response.data)) {
    return null;
  }

  return response.data as StudentFeedback;
};

export interface FeedbackPayload {
  quest_summary?: {
    overall_bloom_rating?: number;
    overall_bloom_level?: string;
    summary?: string;
  };
  subtopic_feedback?: {
    subtopic: string;
    bloom_rating: number;
    bloom_level: string;
    evidence?: string;
    improvement_focus?: string;
  }[];
  study_tips?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string;
  question_feedback?: Record<string, unknown>;
}

interface AttemptPayload {
  student_id: number;
  quest_id: number;
  answers: {
    question_id: number;
    question_text: string;
    cognitive_level: string;
    topic: string;
    selected_answer: string;
    is_selected: boolean;
    answer_is_correct: boolean;
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
  }[];
}

interface ShortAnsAttemptPayload {
  student_id: number;
  quest_id: number;
  answers: {
    question_id: number;
    question_text: string;
    cognitive_level: string;
    topic: string;
    answer: string;
    score_achieved: number;
    explanation: string;
  }[];
}

const buildAttemptPayload = (attemptId: string, userId: number, answerAttempts: UserAnswerAttempt[], questId: number): AttemptPayload => {
  if (!answerAttempts.length) {
    throw new Error('No answers found for this attempt.');
  }
  const answers = answerAttempts.map((attempt) => {
    const question = attempt.question;
    const questionMeta = question as unknown as { cognitive_level?: string; topic?: string };
    const correctAnswer = question.answers.find((answer) => answer.is_correct);
    return {
      question_id: question.id,
      question_text: question.text,
      cognitive_level: questionMeta.cognitive_level ?? 'Understand',
      topic: questionMeta.topic ?? 'General',
      selected_answer: attempt.answer.text,
      is_selected: attempt.is_selected,
      answer_is_correct: attempt.answer.is_correct,
      is_correct: attempt.is_selected && attempt.answer.is_correct,
      correct_answer: correctAnswer?.text ?? '',
      explanation: attempt.answer.reason ?? ''
    };
  });

  return {
    student_id: userId,
    quest_id: questId,
    answers
  };
};

const buildShortAnsAttemptPayload = (attemptId: string, userId: number, answerAttempts: UserShortAnswerAttempt[], questId: number): ShortAnsAttemptPayload => {
  if (!answerAttempts.length) {
    throw new Error('No answers found for this attempt.');
  }
  const answers = answerAttempts.map((attempt) => {
    const question = attempt.question;
    const questionMeta = question as unknown as { cognitive_level?: string; topic?: string };
    return {
      question_id: question.id,
      question_text: question.text,
      cognitive_level: questionMeta.cognitive_level ?? 'Understand',
      topic: questionMeta.topic ?? 'General',
      answer: attempt.text,
      score_achieved: attempt.score_achieved,
      explanation: attempt.unstructuredanswer.reason ?? ''
    };
  });

  return {
    student_id: userId,
    quest_id: questId,
    answers
  };
};

export const generateFeedbackFromMicroservice = async (attemptId: string, userId: number, questId: number): Promise<FeedbackPayload> => {
  const question = await getQuestionsByQuest(questId.toString());
  if (question && (question[0].question_type === 'short_ans' || question[0].question_type === 'latex_short_ans')) {
    const answerAttempts = await getUserShortAnswerAttemptByUserQuestAttempt(attemptId);
    const payload = buildShortAnsAttemptPayload(attemptId, userId, answerAttempts, questId);
    const response = await microService.post<FeedbackPayload>('/generate_shortans_feedback', payload);
    return response.data;
  }
  else {
    const answerAttempts = await getUserAnswerAttemptByUserQuestAttempt(attemptId);
    const payload = buildAttemptPayload(attemptId, userId, answerAttempts, questId);
    const response = await microService.post<FeedbackPayload>('/generate_feedback', payload);
    return response.data;
  }
};

export const saveStudentFeedback = async (attemptId: string, feedback: FeedbackPayload): Promise<StudentFeedback> => {
  const response = await apiService.post<StudentFeedback>('/api/student-feedback/save/', {
    user_quest_attempt_id: Number(attemptId),
    ...feedback
  });
  return response.data;
};
