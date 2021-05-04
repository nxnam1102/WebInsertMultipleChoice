import i18n from "i18next";
import { put, all, takeLatest, select, delay } from "redux-saga/effects";
import { ActionPayload } from "../../interface/redux";
import { AppState } from "../../store/root_reducer";
import ActionTypes from "../../store/actions";
import { LogInState } from "./index.interface";
import AppStorage from "../../local_storage/index";
import { AppLogging } from "../../helpers/utilities";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE, LOGIN } = ActionTypes.Login();

//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  //   fetchData: (): ActionPayload<SignInState> => ({
  //     type: FETCH,
  //   }),
  setState: (values: LogInState): ActionPayload<LogInState> => ({
    type: SET_STATE,
    payload: values,
  }),
  login: (values: any): ActionPayload<LogInState> => ({
    type: LOGIN,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------
const INITIAL_STATE: LogInState = {
  isLoading: false,
  updateStatus: "",
  updateMessage: "",
  succeed: false,
  error: false,
  username: "",
  password: "",
};

export function logInReducer(
  state: LogInState = INITIAL_STATE,
  action: ActionPayload<LogInState>
): LogInState {
  switch (action.type) {
    case FETCH:
      return { ...state };
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

//#Redux Saga Action ---------------------------------------------------------------------
function* fetchData() {
  yield put(
    Actions.setState({
      isLoading: true,
    })
  );
  try {
  } catch (error) {}
  yield put(
    Actions.setState({
      isLoading: false,
    })
  );
}

function* login(action: any) {
  let { updateStatus, updateMessage }: LogInState = yield select(
    (state: AppState) => state.logInReducer
  );
  yield put({
    type: ActionTypes.Auth().SET_STATE,
    payload: { isLoading: true },
  });

  try {
    if (
      action.payload.username === "admin" &&
      action.payload.password === "1"
    ) {
      console.log(1);
      yield delay(1000);
      yield put({
        type: ActionTypes.Auth().SET_STATE,
        payload: { isLoading: false },
      });
      AppStorage.set("auth", "true");
      AppLogging.success(i18n.t("page_login:login_succeed"));
      // localStorage.setItem("SecretApiUpload", process.env.SecretApiUpload!);
      yield put({ type: ActionTypes.Auth().AUTH_SIGNIN });
    } else {
      console.log(2);
      yield delay(1000);
      yield put({
        type: ActionTypes.Auth().SET_STATE,
        payload: { isLoading: false },
      });
      AppStorage.set("auth", "false");
      AppLogging.error(i18n.t("page_login:login_fail"));
      yield put({ type: ActionTypes.Auth().AUTH_SIGNOUT });
    }
    // const cmp = listCompany!.find((x) => x.code === company);
    // yield AppStorage.set(APP_CONSTANTS.JWT, "OK");
    // yield AppStorage.set(APP_CONSTANTS.COMPANY_CODE, cmp!.code);
    // yield AppStorage.set(APP_CONSTANTS.COMPANY_NAME, cmp!.name);
    // yield AppStorage.set(
    //   APP_CONSTANTS.USER_MENU_FAVORITES,
    //   "SALES_ORDER;SALES_DELIVERY"
    // );
    /*  const result = yield AccountService.Login({
      username: action.payload.username,
      password: action.payload.password,
    });
    if (result.msgCode === 200) {
       yield AppStorage.set(CONSTANTS.JWT, result.content.token);
      yield AppStorage.set(CONSTANTS.USER_ID, result.content.info.userId);
      yield AppStorage.set(CONSTANTS.USER_NAME, result.content.info.username);
      yield AppStorage.set(CONSTANTS.USER_ROLE, result.content.info.role);
      yield AppStorage.set(
        CONSTANTS.USER_EMPLOYEE_ID,
        result.content.info.employeeId
      ); 
      yield put(ActionAuth.authSignin());
    } else {
      updateStatus = MESSAGE.WARNING;
      updateMessage = i18n.t("message_code_api." + result.msgCode);
    }  */
    // yield Utils.threadDelay(1000);
    // yield put(ActionAuth.authSignin());
  } catch (error) {
    // Utils.logError(error);
    console.warn(error);
  }
  yield put(
    Actions.setState({
      isLoading: false,
      password: "",
      updateStatus,
      updateMessage,
    })
  );
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* logInWatcher() {
  yield all([takeLatest(FETCH, fetchData), takeLatest(LOGIN, login)]);
}

// const COMPANY_DATA: CompanyData[] = [
//   { code: "APZ1", name: "APZON IRS VIET NAM" },
//   { code: "APZ2", name: "APZON IRS VIET NAM TEST" },
// ];
