import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import ActionTypes from "../../store/actions";
import i18n from "i18next";

//#Redux Action ---------------------------------------------------------------------------
const { SET_STATE } = ActionTypes.Auth();
export interface LoadingState extends ReduxStateBase {
  isLoading?: boolean;
  loadingMessage?: string;
}
//#Redux Action Creators-------------------------------------------------------------------
export const ActionsLoading = {
  setState: (values: LoadingState): ActionPayload<LoadingState> => ({
    type: SET_STATE,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: LoadingState = {
  isLoading: false,
  loadingMessage: i18n.isInitialized ? i18n.t("common:loading") : "loading...",
};

export function loadingReducer(
  state: LoadingState = INITIAL_STATE,
  action: ActionPayload<LoadingState>
): LoadingState {
  switch (action.type) {
    case SET_STATE:
      return {
        ...state,
        loadingMessage: i18n.isInitialized
          ? i18n.t("common:loading")
          : "loading...",
        ...action.payload,
      };
    default:
      return state;
  }
}
