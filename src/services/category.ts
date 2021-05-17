import { Request } from "./http_client.helper";

const instance = Request("GetData");

export const GetDataService = {
  GetDataCategory: async (): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListCategory");
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  GetDataSet: async (categoryId: any): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListSet", { categoryId });
      return result;
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  },
};
