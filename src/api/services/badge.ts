import apiService from "@/api/api-service";
import type { Badge, BadgePayload, BadgeUpdatePayload } from "@/types/badge";
import type { UserQuestBadge} from "@/types/user-quest-badge";
import type { UserCourseBadge } from "@/types/user-course-badge";
import type { UserOtherBadge } from '@/types/user-other-badge';

export const getBadges = async (): Promise<Badge[]> => {
  const response = await apiService.get<Badge[]>('/api/badges/');
  return response.data;
}

export const createBadge = async (payload: BadgePayload): Promise<Badge> => {
  const response = await apiService.post<Badge>('/api/badges/', payload);
  return response.data;
}

export const updateBadge = async (id: number, payload: BadgeUpdatePayload): Promise<Badge> => {
  const response = await apiService.patch<Badge>(`/api/badges/${String(id)}/`, payload);
  return response.data;
}

export const deleteBadge = async (id: number): Promise<void> => {
  await apiService.delete(`/api/badges/${String(id)}/`);
}

export const getUserQuestBadges = async (): Promise<UserQuestBadge[]> => {
  const response = await apiService.get<UserQuestBadge[]>('/api/user-quest-badges/');
  return response.data;
}

export const getUserQuestBadgesByUser = async (userId: string): Promise<UserQuestBadge[]> => {
  const response = await apiService.get<UserQuestBadge[]>(`/api/user-quest-badges/by_user/?user_id=${userId}`);
  return response.data;
}

export const getUserCourseBadges = async (): Promise<UserCourseBadge[]> => {
  const response = await apiService.get<UserCourseBadge[]>('/api/user-course-badges/');
  return response.data;
}

export const getUserCourseBadgesByUser = async (userId: string): Promise<UserCourseBadge[]> => {
  const response = await apiService.get<UserCourseBadge[]>(`/api/user-course-badges/by_user/?user_id=${userId}`);
  return response.data;
}

export const getUserOtherBadges = async (): Promise<UserOtherBadge[]> => {
  const response = await apiService.get<UserOtherBadge[]>('/api/user-other-badges/');
  return response.data;
}

export const getUserOtherBadgesByUser = async (userId: string): Promise<UserOtherBadge[]> => {
  const response = await apiService.get<UserOtherBadge[]>(`/api/user-other-badges/by_user/?user_id=${userId}`);
  return response.data;
}

export const getUserAllBadgesByUser = async (userId: string): Promise<Badge[]> => {
  const response = await apiService.get<Badge[]>(`/api/user-all-badges/by_user/?user_id=${userId}`);
  return response.data;
}