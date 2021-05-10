import { combineReducers } from "redux";
import { authReducer } from "../components/authentication/auth.redux";
import { loadingReducer } from "../components/loading/loading.redux";
import { logInReducer } from "../pages/login/index.redux";
import { userReducer } from "../pages/user/index.redux";
import { categoryReducer } from "../pages/category/index.redux";
import { setReducer } from "../pages/set/index.redux";

const allReducer = combineReducers({
  authReducer,
  logInReducer,
  loadingReducer,
  userReducer,
  categoryReducer,
  setReducer,
});
export type AppState = ReturnType<typeof allReducer>;
export const rootReducer = (state: any, action: any) => {
  return allReducer(state, action);
};
