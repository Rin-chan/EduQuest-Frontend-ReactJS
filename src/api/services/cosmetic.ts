import apiService from "@/api/api-service";
import type {
  Cosmetic,
} from "@/types/cosmetic";


export const getAllCosmetic = async (): Promise<Cosmetic[]> => {
    const response = await apiService.get<Cosmetic[]>(`/api/cosmetics/`);
    return response.data;
}

export const buyCosmeticId = async (cosmetic: Cosmetic): Promise<Cosmetic> => {
    const response = await apiService.post<Cosmetic>(`/api/cosmetics/buy_cosmetic_id/`, cosmetic);
    return response.data;
}