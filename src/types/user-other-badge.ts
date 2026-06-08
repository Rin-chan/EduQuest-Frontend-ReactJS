import type { Badge } from "@/types/badge";
import {type EduquestUser} from "@/types/eduquest-user";

export interface UserOtherBadge {
  id: number;
  badge: Badge;
  user: EduquestUser;
  awarded_date: string; // ISO 8601 datetime string
}
