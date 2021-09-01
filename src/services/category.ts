import { cloneDeep } from "lodash";
import {
  AppLogging,
  get_url_extension,
  isNotEmpty,
} from "../helpers/utilities";
import { Request } from "./http_client.helper";

const instance = Request("GetData");

export const GetDataService = {
  GetDataCategory: async (): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListCategory");
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  GetDataSet: async (categoryId: any): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListSet", { categoryId });
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  GetDataQuestion: async (categoryId: any, setId: any): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListQuestion", {
        categoryId,
        setId,
      });
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  //save question
  SaveQuestion: async (data: any): Promise<any> => {
    try {
      let result = await Request("Question").postAsync("SaveQuestion", [data]);
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  //save answer
  SaveAnswer: async (data: any): Promise<any> => {
    try {
      let result = await Request("Question").postAsync("SaveAnswer", data);
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  SaveFile: async (data: any): Promise<any> => {
    try {
      let result = {
        Message: "Notfound error",
        MessageCode: 401,
        Content: null,
      };
      let dataSave = cloneDeep(data?.data);
      let dataFile = cloneDeep(data?.file);
      if (dataSave?.Type === "server") {
        let resultUpload = await Request("File").postFileAsync(
          "UploadFile",
          Array.isArray(dataFile) && dataFile.length > 0
            ? dataFile[0]
            : dataFile
        );
        if (
          resultUpload &&
          typeof resultUpload === "object" &&
          "Message" in resultUpload
        ) {
          if (isNotEmpty(resultUpload.Message)) {
            return resultUpload;
          } else {
            dataSave.Type = resultUpload.Content?.Type;
            dataSave.Path = resultUpload.Content?.Path;
            result = await Request("Question").postAsync("SaveFile", [
              dataSave,
            ]);
          }
        } else {
          return result;
        }
      } else if (dataSave?.Type === "url") {
        let ext = get_url_extension(dataSave?.Path);
        if (dataSave.SelectionType === "image") {
          dataSave.Type = "image/url";
        } else if (dataSave.SelectionType === "audio") {
          dataSave.Type = "audio/url";
        } else {
          if (
            ext === "jpg" ||
            ext === "jpeg" ||
            ext === "png" ||
            ext === "gif" ||
            ext === "webp" ||
            ext === "svg"
          ) {
            dataSave.Type = "image/url";
          } else if (
            ext === "3gp" ||
            ext === "mp3" ||
            ext === "mp4" ||
            ext === "au"
          ) {
            dataSave.Type = "audio/url";
          } else {
            dataSave.Type = "image/url";
          }
        }
        result = await Request("Question").postAsync("SaveFile", [dataSave]);
      } else {
        result = await Request("Question").postAsync("SaveFile", [dataSave]);
      }
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  SaveCategory: async (data: any): Promise<any> => {
    try {
      let result = await Request("Question").postAsync("SaveCategory", [data]);
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  SaveSet: async (data: any): Promise<any> => {
    try {
      let result = await Request("Question").postAsync("SaveSet", [data]);
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
};
