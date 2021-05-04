import { all } from "redux-saga/effects";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import ActionTypes from "../../store/actions";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE, CHANGE_LANGUAGE } = ActionTypes.Setting();

//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (): ActionPayload<any> => ({
    type: FETCH,
  }),
  setState: (values: ReduxStateBase): ActionPayload<any> => ({
    type: SET_STATE,
    payload: values,
  }),
  changeLanguage: (values: { newLanguage: string }): ActionPayload<any> => ({
    type: CHANGE_LANGUAGE,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------
export interface SettingState extends ReduxStateBase {}
const INITIAL_STATE: SettingState = {};
export function settingReducer(
  state: SettingState = INITIAL_STATE,
  action: ActionPayload<any>
): SettingState {
  switch (action.type) {
    case FETCH:
      return { ...state, isLoading: true };
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return { ...state };
  }
}

//#Redux Saga Action ---------------------------------------------------------------------
//#Function Private ----------------------------------------------------------------------
//function otherFunction() {}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* settingWatcher() {
  yield all([]);
}
