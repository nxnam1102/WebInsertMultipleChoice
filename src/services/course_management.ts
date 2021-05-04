import { AppLogging } from "../helpers/utilities";
import { AddNewData } from "../pages/course_management/index.interface";
import { courseData } from "./fake_data/fakeDataCourse";
import { stageData } from "./fake_data/fakeDataStage";

export const CourseManagementService = {
  getCourseData: async (params: string | undefined) => {
    try {
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          let resultData = courseData.filter((x) => x.school === params);
          reslove(resultData);
        }, 200);
      });
      await result;
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  getStageData: async (params: string | undefined) => {
    try {
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          let resultData = stageData;
          reslove(resultData);
        }, 200);
      });
      await result;
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  AddNewData: async (data: AddNewData | undefined, currentSchoolId: any) => {
    try {
      if (!data) {
        throw new Error("Dữ liệu rỗng");
      }
      courseData.push(data);
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          let resultData = courseData.filter(
            (x) => x.school === currentSchoolId
          );
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
