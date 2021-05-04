import { DataLogging } from "../interface/app_log";
import { Request } from "./http_client.helper";

const instance = Request("AppLogging");

export const CommonService = {
  WriteLog: async (data: DataLogging): Promise<any> => {
    try {
      let result = await instance.postAsync("WriteLog", data);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
