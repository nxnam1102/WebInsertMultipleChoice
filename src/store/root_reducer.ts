import { combineReducers } from "redux";
import { authReducer } from "../components/authentication/auth.redux";
import { settingReducer } from "../pages/setting/index.redux";
import { logInReducer } from "../pages/login/index.redux";
import { userManagementReducer } from "../pages/user_management/index.redux";
import { loadingReducer } from "../components/loading/loading.redux";
import { lessonManagementReducer } from "../pages/lesson_management/index.redux";
import { fileManagementReducer } from "../pages/file_management/index.redux";
import { courseManagementReducer } from "../pages/course_management/index.redux";

const allReducer = combineReducers({
  authReducer,
  settingReducer,
  logInReducer,
  lessonManagementReducer,
  fileManagementReducer,
  userManagementReducer,
  loadingReducer,
  courseManagementReducer,
});
export type AppState = ReturnType<typeof allReducer>;
export const rootReducer = (state: any, action: any) => {
  return allReducer(state, action);
};
