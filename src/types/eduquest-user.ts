import { Badge } from "./badge";
import { Cosmetic } from "./cosmetic";
import { Image } from "./image";

export interface UserGoals {
  id: number;
  task: number;
  complete: number;
  target: number;
}

export interface EduquestUser extends EduquestUserSummary {
  first_name: string;
  last_name: string;
  username: string;
  last_login: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
  is_superuser: boolean;
  is_active: boolean;
  is_staff: boolean;
  total_points: number;
  current_points: number;
  daily_checkin_streak: number;
  daily_checkin_longest_streak: number;
  daily_checkin_last_date: string | null;
  daily_goals: UserGoals[];
}

export interface EduquestUserSummary {
  id: number;
  email: string;
  nickname: string;
}

export interface EduquestUserUpdateForm {
  nickname: string;
}

export interface DailyCheckInResult {
  checked_in: boolean;
  already_checked_in: boolean;
  daily_points_awarded: number;
  streak_bonus_awarded: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
  current_points: number;
}

export interface CalendarDailyCheckInResult {
  checkin_dates: string[];
}

export interface EduquestUserCosmeticResult {
  profile_picture: Image;
  profile_background: string;
  profile_border: Image;
  banner: Image | null;
  displayed_badges: Badge[];
  about_me: string;
  owns: Cosmetic[];
}