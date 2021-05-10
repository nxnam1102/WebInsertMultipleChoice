export interface AddNewData {
  school: string;
  name: string;
  email: string;
  grade: number;
  phone_number: string;
  course: string;
  user_name: string;
  password: string;
  identity_card_number: string;
  status: string;
  create_date: Date;
  login_date: Date;
}
export interface AddNewDataParam {
  callback: () => void;
  currentSchoolId: any;
  addNewData: AddNewData;
}
