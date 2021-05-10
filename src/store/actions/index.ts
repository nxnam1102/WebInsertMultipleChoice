import NAMESPACE from "./index.namespace";
import Authentication from "./types/auth";
import Login from "./types/login";
import User from "./types/user";
import Category from "./types/category";
import Set from "./types/set";
import Question from "./types/question";
import File from "./types/file";

const TypesDefault = ["FETCH", "SET_STATE", "FETCH_DONE"];
const GetActionTypes = (ns: string, array: string[]) => {
  array.push(...TypesDefault);
  return array.reduce((obj, item) => {
    obj[item] = ns + "." + item;
    return obj;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, <Record<string, any>>{});
};

const Index = {
  Auth: () => GetActionTypes(NAMESPACE.AUTHENTICATION, Authentication),
  Login: () => GetActionTypes(NAMESPACE.LOGIN, Login),
  User: () => GetActionTypes(NAMESPACE.USER, User),
  Category: () => GetActionTypes(NAMESPACE.CATEGORY, Category),
  Set: () => GetActionTypes(NAMESPACE.SET, Set),
  Question: () => GetActionTypes(NAMESPACE.QUESTION, Question),
  File: () => GetActionTypes(NAMESPACE.FILE, File),
};

export default Index;
