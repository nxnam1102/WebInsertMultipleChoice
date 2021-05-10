import { Request } from "./http_client.helper";

const instance = Request("GetData");

export const GetDataService = {
  GetDataCategory: async (): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListCategory");
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  GetDataSet: async (categoryId: any): Promise<any> => {
    try {
      let result = await instance.getAsync("GetListSet", { categoryId });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
