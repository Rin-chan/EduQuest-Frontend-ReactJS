import type { TestScore, UserTestScore } from "@/types/test-score";
import apiService from "@/api/api-service";

export const getTestScores = async (): Promise<TestScore[]> => {
  const response = await apiService.get<TestScore[]>('/api/test-scores/');
  return response.data;
}

export const getTestScoresByCourseGroup = async (id: String): Promise<TestScore[]> => {
  const response = await apiService.get<TestScore[]>(`/api/test-scores/by_course_group/?course_group_id=${id}`);
  return response.data;
}

export const importTestScore = async (testImportFormData: FormData): Promise<TestScore> => {
    const response = await apiService.post<TestScore>(`/api/test-scores/import_test_score/`, testImportFormData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return response.data
}

export const updateTestScoreWeightage = async (id: String, weightage: number): Promise<TestScore> => {
    const response = await apiService.post<TestScore>(`/api/test-scores/update_test_score_weightage/?id=${id}&weightage=${weightage}`);
    return response.data;
}

export const deleteTestScore = async(id: String): Promise<TestScore> => {
    const response = await apiService.delete(`/api/test-scores/${id}/`);
    return response.data;
}

export const getUserTestScores = async (): Promise<UserTestScore[]> => {
  const response = await apiService.get<UserTestScore[]>('/api/user-test-scores/');
  return response.data;
}

export const getUserTestScoresByTest = async (id: String): Promise<UserTestScore[]> => {
  const response = await apiService.get<UserTestScore[]>(`/api/user-test-scores/by_test/?test_id=${id}`);
  return response.data;
}

export const getUserTestScoresByUser = async (id: String): Promise<UserTestScore[]> => {
  const response = await apiService.get<UserTestScore[]>(`/api/user-test-scores/by_user/?user_id=${id}`);
  return response.data;
}

export const getUserTestScoresByTestAndUser = async (test_id: String, user_id: String): Promise<UserTestScore[]> => {
  const response = await apiService.get<UserTestScore[]>(`/api/user-test-scores/by_test_and_user/?test_id=${test_id}&user_id=${user_id}`);
  return response.data;
}

export const deleteUserTestScore = async(id: String): Promise<UserTestScore> => {
    const response = await apiService.delete(`/api/user-test-scores/${id}/`);
    return response.data;
}

export const updateUserTestScores = async (testScoreList: UserTestScore[]): Promise<TestScore> => {
    const response = await apiService.post<TestScore>(`/api/user-test-scores/update_user_test_scores/`, testScoreList);
    return response.data;
}