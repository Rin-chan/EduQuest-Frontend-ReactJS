import type {UserQuestAttempt} from "@/types/user-quest-attempt";
import type {Question} from "@/types/question";
import type {Answer, UnstructuredAnswer} from "@/types/answer";


export interface UserAnswerAttempt {
  id: number
  user_quest_attempt_id: UserQuestAttempt['id']
  question: Question
  answer: Answer
  is_selected: boolean
  hint_used?: boolean
  score_achieved: number
}

export interface UserShortAnswerAttempt {
  id: number
  user_quest_attempt_id: UserQuestAttempt['id']
  question: Question
  unstructuredanswer: UnstructuredAnswer
  text: string
  hint_used?: boolean
  score_achieved: number
}


export interface UserAnswerAttemptUpdateForm {
  id: number
  is_selected?: boolean
  hint_used?: boolean
  score_achieved?: number
}

export interface UserShortAnswerAttemptUpdateForm {
  id: number
  text: string
  hint_used?: boolean
  score_achieved?: number
}