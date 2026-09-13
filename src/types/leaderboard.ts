import type { EduquestUser, EduquestUserCosmeticResult } from "./eduquest-user";

export interface UserData {
    user: EduquestUser;
    cosmetic: EduquestUserCosmeticResult | null;
    score: number;
}