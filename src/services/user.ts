import { Request } from "./http_client.helper";

const instance = Request("Insert");

export const UserService = {
    GetData: async (): Promise<any> => {
        try {
            let result = await instance.getAsync("GetDataUser");
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
    },
};
