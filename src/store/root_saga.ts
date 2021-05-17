import { all } from "redux-saga/effects";
import { authWatcher } from "../components/authentication/auth.redux";
import { logInWatcher } from "../pages/login/index.redux";
import { userWatcher } from "../pages/user/index.redux";
import { categoryWatcher } from "../pages/category/index.redux";
import { setWatcher } from "../pages/set/index.redux";
import { questionWatcher } from "../pages/question/index.redux";

export function* rootSaga() {
  yield all([
    authWatcher(),
    logInWatcher(),
    userWatcher(),
    categoryWatcher(),
    setWatcher(),
    questionWatcher(),
  ]);
}
