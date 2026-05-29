import apiService from "@/api/api-service";
import type {
  CalendarDailyCheckInResult,
  DailyCheckInResult,
  EduquestUser,
  EduquestUserUpdateForm,
  UserGoals,
} from "@/types/eduquest-user";


export const getEduquestUser = async (id: string): Promise<EduquestUser> => {
    const response = await apiService.get<EduquestUser>(`/api/eduquest-users/${id}/`);
    return response.data;
}

export const getAllEduquestUsers = async (): Promise<EduquestUser[]> => {
  const response = await apiService.get<EduquestUser[]>('/api/eduquest-users/');
  return response.data;
}

export const getAdminEduquestUsers = async (): Promise<EduquestUser[]> => {
  const response = await apiService.get<EduquestUser[]>('/api/eduquest-users/by_admin/');
  return response.data;
}

export const getStudentEduquestUsers = async (): Promise<EduquestUser[]> => {
  const response = await apiService.get<EduquestUser[]>('/api/eduquest-users/by_student/');
  return response.data;
}

export const updateEduquestUser = async (id: string, eduquestUserUpdateForm: EduquestUserUpdateForm ): Promise<EduquestUser> => {
  const response = await apiService.patch<EduquestUser>(`/api/eduquest-users/${id}/`, eduquestUserUpdateForm);
  return response.data;
}

export const dailyCheckIn = async (): Promise<DailyCheckInResult> => {
  const response = await apiService.post<DailyCheckInResult>('/api/eduquest-users/daily-check-in/');
  return response.data;
}

export const getCalendarDailyCheckIn = async (): Promise<CalendarDailyCheckInResult> => {
  const response = await apiService.post<CalendarDailyCheckInResult>('/api/eduquest-users/calendar-daily-check-in/');
  return response.data;
}

export const updateDailyGoals = async (dailyGoals: UserGoals[]): Promise<UserGoals[]> => {
  const response = await apiService.post<UserGoals[]>('/api/eduquest-users/update-daily-goals/', { daily_goals: dailyGoals });
  return response.data;
}