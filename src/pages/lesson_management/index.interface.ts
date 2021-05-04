import { ReduxStateBase } from "../../interface/redux";

export interface Props {}
export interface LessonManagementState extends ReduxStateBase {
  selectId?: string,
  selectItem?: LessonData,
  lessonId?: string,
  lessonName?: string,
  status?: string,
  grade?: string,
  tags?: string [],
  note?: string,
  phrase?: string,
  listGrade?: Grade[],
  listStatus?: Status[],
  listSkill?: Skill[],
  listLesson?: LessonData[],
}

export interface LessonData {
  id?: string,
  lessonName?: string,
  status?: string,
  creator?: string,
  createDate?: string,
  updateDate?: string,
  grade?: string,
  tags?: string[],
  note?: string,
  phrase?: string,
  skill?: string,
}

export interface Status {
  id?: string,
  status?: string
}

export interface Grade {
  id?: string,
  grade?: string
}

export interface Skill {
  id?: string,
  skill?: string
}
