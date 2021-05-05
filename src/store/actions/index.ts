import NAMESPACE from "./index.namespace";

import Authentication from "./types/auth";
import LessonManagement from "./types/lesson_management";
import FileManagement from "./types/file_management";
import UserManagemnt from "./types/user_management";
import Setting from "./types/setting";
import Login from "./types/login";
import CourseManagement from "./types/course_management";
import User from "./types/user";

const TypesDefault = ["FETCH", "SET_STATE"];
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
  UserManagement: () =>
    GetActionTypes(NAMESPACE.USER_MANAGEMENT, UserManagemnt),
  LessonManagement: () =>
    GetActionTypes(NAMESPACE.LESSON_MANAGEMENT, LessonManagement),
  FileManagement: () =>
    GetActionTypes(NAMESPACE.FILE_MANAGEMENT, FileManagement),
  Setting: () => GetActionTypes(NAMESPACE.SETTING, Setting),
  Login: () => GetActionTypes(NAMESPACE.LOGIN, Login),
  CourseManagement: () =>
    GetActionTypes(NAMESPACE.COURSE_MANAGEMENT, CourseManagement),
  User: () => GetActionTypes(NAMESPACE.USER, User),
};

export default Index;
