import { AppLogging } from "../helpers/utilities";
import { Request } from "./http_client.helper";

const controller = "Account";

interface Account {
  username?: string;
  password?: string;
}

interface AccountData {
  username?: string;
  password?: string;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
}

export const AccountService = {
  Login: async (values: Account) => {
    try {
      return await Request(controller).getAsync("Login", values);
    } catch (error) {
      AppLogging.error(error);
    }
  },
  Register: async (values: AccountData) => {
    try {
      return await Request(controller).postAsync("Register", values);
    } catch (error) {
      AppLogging.error(error);
    }
  },
};
