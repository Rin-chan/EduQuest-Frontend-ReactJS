import apiService from "@/api/api-service";
import type { UserData } from '@/types/leaderboard';

export const getCourseLeaderboard = async (courseId: string): Promise<Record<number, UserData>> => {
  const response = await apiService.get<Record<number, UserData>>(`/api/course-leaderboard?course_id=${courseId}`);
  return response.data;
}

export const getQuestLeaderboard = async (questId: string): Promise<Record<number, UserData>> => {
  const response = await apiService.get<Record<number, UserData>>(`/api/quest-leaderboard?quest_id=${questId}`);
  return response.data;
}
