import type { CourseGroup } from "./course-group"
import type { EduquestUser } from "./eduquest-user";

export interface TestScore {
    id: number;
    course_group: CourseGroup;
    name: string;
    organiser: EduquestUser
    weightage: number;
}

export interface UserTestScore{
    id: number;
    test: TestScore;
    student: EduquestUser
    score: number;
}