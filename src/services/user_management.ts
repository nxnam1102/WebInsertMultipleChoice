import { AddNewData } from "../pages/user_management/index.interface";
import { schoolData } from "./fake_data/fakeDataSchool";
import { userData } from "./fake_data/fakeDataUser";

export const UserManagementService = {
  GetSchoolData: async (): Promise<any> => {
    try {
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          reslove(schoolData);
        }, 0);
      });
      await result;
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  GetUserData: async (params: string) => {
    try {
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          let resultData = userData.filter((x) => x.school === params);
          reslove(resultData);
        }, 100);
      });
      await result;
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  AddNewData: async (data: AddNewData | undefined, currentSchoolId: any) => {
    try {
      console.log(data);
      if (!data) {
        throw new Error("Dữ liệu rỗng");
      }
      userData.push(data);
      console.log(userData);
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          let resultData = userData.filter((x) => x.school === currentSchoolId);
          reslove(resultData);
        }, 100);
      });
      await result;
      return result;
    } catch (error) {
      throw new Error(error);
    }
  },
};
