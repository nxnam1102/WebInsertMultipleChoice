export interface AddNewData {
  school: string;
  course_code: string;
  course_name: string;
  status: "a" | "s";
  curriculum: string;
  effect_date: Date;
  create_date: Date;
  grade: number;
  tag: any[];
}
export interface AddNewDataParam {
  callback: () => void;
  currentSchoolId: any;
  addNewData: AddNewData;
}
