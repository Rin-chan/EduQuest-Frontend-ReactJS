
export interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
  reason: string | null;
}

export interface AnswerNewForm {
  text: string;
  is_correct: boolean;
  reason: string | null;
}

export interface UnstructuredAnswer {
  id: number;
  text: string;
  reason: string | null;
}