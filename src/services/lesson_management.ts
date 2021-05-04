import { AppLogging } from "../helpers/utilities";
import { LessonData } from "../pages/lesson_management/index.interface";
import { lessonData } from "./fake_data/fakeLessonData";
import { Request } from "./http_client.helper";

const controller: string = "ManageLesson";

export const LessonManagementService = {
  GetLessonData: async () => {
    try {
      //   return await Request(controller).getAsync("GetLessons", {});
      // Create fake response
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          reslove(lessonData);
        }, 0);
      });
      await result;
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  UpdateLessonData: async (values: LessonData) => {
    try {
      return await Request(controller).postAsync("UpdateLesson", values);
    } catch (error) {
      AppLogging.error(error);
    }
  },
  DeleteLessonData: async (id: string) => {
    try {
      return await Request(controller).postAsync("UpdateList", { id });
    } catch (error) {
      AppLogging.error(error);
    }
  },
};
