import { all } from "redux-saga/effects";
import { authWatcher } from "../components/authentication/auth.redux";
import { settingWatcher } from "../pages/setting/index.redux";
import { logInWatcher } from "../pages/login/index.redux";
import { lessonManagementWatcher } from "../pages/lesson_management/index.redux";
import { fileManagementWatcher } from "../pages/file_management/index.redux";
import { userManagementWatcher } from "../pages/user_management/index.redux";
import { courseManagementWatcher } from "../pages/course_management/index.redux";

export function* rootSaga() {
  yield all([
    authWatcher(),
    settingWatcher(),
    logInWatcher(),
    lessonManagementWatcher(),
    fileManagementWatcher(),
    userManagementWatcher(),
    courseManagementWatcher(),
  ]);
}
