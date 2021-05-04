import { AppLogging } from "../helpers/utilities";
import { FileData } from "../pages/file_management/index.interface";
import { filesData } from "./fake_data/fakeFilesData";
import { Request } from "./http_client.helper";

const controller: string = "ManageFile";

export const FileManagementService = {
  GetFilesData: async (lessonId: string | undefined) => {
    try {
      console.log(lessonId);
      //   return await Request(controller).getAsync("GetFiles", { lessonId });
      // Create Fake response
      let result = new Promise<any>((reslove) => {
        setTimeout(() => {
          reslove(filesData);
        }, 0);
      });
      await result;
      return result;
    } catch (error) {
      AppLogging.error(error);
    }
  },
  GetUploadKey: async (sessionId: string | undefined) => {
    try {
      return await Request(controller).getAsync("GetUploadKey", { sessionId });
    } catch (error) {
      AppLogging.error(error);
    }
  },
  UpdateFileData: async (values: FileData) => {
    try {
      return await Request(controller).postAsync("UpdateFile", values);
    } catch (error) {
      AppLogging.error(error);
    }
  },
  DeleteFileData: async (id: string) => {
    try {
      return await Request(controller).postAsync("UpdateList", { id });
    } catch (error) {
      AppLogging.error(error);
    }
  },
  UploadFileData: async (file: any) => {
    try {
      return await Request("Files").postFileAsync("UploadFile", file);
    } catch (error) {
      AppLogging.error(error);
    }
  },
  DownloadFile: async (fileName: string) => {
    try {
      return await Request("Files").getAsync("Download", {
        filename: fileName,
      });
    } catch (error) {
      AppLogging.error(error);
    }
  },
};
