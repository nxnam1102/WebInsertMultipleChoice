import { put, all, takeLatest } from "redux-saga/effects";
import APP_CONSTANTS from "../../constants/app";
// import Utils from "../../helpers/utilities";
import { ActionPayload } from "../../interface/redux";
import ActionTypes from "../../store/actions";
import AppStorage from "../../local_storage";

//#Redux Action ---------------------------------------------------------------------------
const {
  AUTH_SIGNIN,
  AUTH_SIGNOUT,
  AUTH_ISLOADING,
  AUTH_TOKEN_EXPIRE,
  AUTH_CHECK,
  AUTH_TOKEN_VALID,
  AUTH_TOKEN_EXPIRE_CLOSE,
} = ActionTypes.Auth();

//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  authSignin: (): ActionPayload<AuthState> => ({
    type: AUTH_SIGNIN,
  }),
  authSignOut: (): ActionPayload<AuthState> => ({
    type: AUTH_SIGNOUT,
  }),
  authIsLoading: (value: AuthState): ActionPayload<AuthState> => ({
    type: AUTH_ISLOADING,
    payload: value,
  }),
  authTokenExpire: (): ActionPayload<AuthState> => ({
    type: AUTH_TOKEN_EXPIRE,
  }),
  authTokenExpireClose: (): ActionPayload<AuthState> => ({
    type: AUTH_TOKEN_EXPIRE_CLOSE,
  }),
  authCheck: (): ActionPayload<AuthState> => ({
    type: AUTH_CHECK,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------
export interface AuthState {
  isLoading?: boolean;
  auth?: boolean;
  tokenExpire?: boolean;
  updateDataStatus?: string;
  updateDataMessage?: string;
}

const INITIAL_STATE: AuthState = {
  isLoading: false,
  auth: false,
  tokenExpire: false,
  updateDataStatus: "",
  updateDataMessage: "",
};

export function authReducer(
  state: AuthState = INITIAL_STATE,
  action: ActionPayload<AuthState>
): AuthState {
  switch (action.type) {
    case AUTH_SIGNIN:
      return { isLoading: false, auth: true, tokenExpire: false };
    case AUTH_SIGNOUT:
      return { isLoading: false, auth: false, tokenExpire: false };
    case AUTH_ISLOADING:
      return { ...state, isLoading: action.payload!.isLoading };
    case AUTH_TOKEN_EXPIRE:
      return { isLoading: false, auth: false, tokenExpire: true };
    case AUTH_TOKEN_VALID:
      return { isLoading: false, auth: true, tokenExpire: false };
    case AUTH_TOKEN_EXPIRE_CLOSE:
      return { ...state, tokenExpire: false };
    default:
      return state;
  }
}

//#Redux Saga Action ---------------------------------------------------------------------
function* authCheck() {
  try {
    yield put({
      type: AUTH_ISLOADING,
      payload: true,
    });
    const auth = AppStorage.get("auth");
    if (auth === "true") {
      yield put({ type: AUTH_TOKEN_VALID });
    } else {
      yield put({ type: AUTH_SIGNOUT });
    }
    //get token
    // const token: string = yield AppStorage.get(APP_CONSTANTS.JWT);
    // if (token !== "") {
    //check token valid
    /*   const result = yield AccountService.CheckValidToken({ tokenId: token });
      if (result.MsgCode === 200) {
        if (result.Content.toString().toUpperCase() === "TRUE") {
          yield put({
            type: AUTH_TOKEN_VALID,
          });
        } else {
          yield put({
            type: AUTH_TOKEN_EXPIRE,
          });
        }
      }  */

    //   yield put({
    //     type: AUTH_TOKEN_VALID,
    //   });
    // } else {
    //   yield put({
    //     type: AUTH_SIGNOUT,
    //   });
    // }
  } catch (error) {
    // Utils.logError(error);
    console.warn(error);
  }
}

function* signOut() {
  //remove localdata
  yield AppStorage.remove(APP_CONSTANTS.JWT);
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* authWatcher() {
  yield all([
    takeLatest(AUTH_CHECK, authCheck),
    takeLatest(AUTH_SIGNOUT, signOut),
  ]);
}
