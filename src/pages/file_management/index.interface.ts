import { ReduxStateBase } from "../../interface/redux";
import { LessonData, Skill } from "../lesson_management/index.interface";

export interface Props {}
export interface FileManagementState extends ReduxStateBase {
  selectId?: string,
  selectItem?: LessonData,
  uploadFile?: any,
  listSkill?: Skill[],
  listFile?: FileData[],
}

export interface FileData {
  id?: string,
  fileName?: string,
  filePath?: string,
  fileType?: string,
  uploader?: string,
  createDate?: string,
  updateDate?: string,
  phrase?: string,
}
