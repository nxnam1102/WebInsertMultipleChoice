import { all, call, put, takeLatest } from "redux-saga/effects";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging } from "../../helpers/utilities";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import { ResponseData } from "../../interface/service";
import { UserService } from "../../services/user";
import ActionTypes from "../../store/actions";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE } = ActionTypes.User();
export interface UserState extends ReduxStateBase {
  isLoading?: boolean;
  data?: any[];
}
//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (): ActionPayload<any> => ({
    type: FETCH,
  }),
  setState: (values: UserState): ActionPayload<UserState> => ({
    type: SET_STATE,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: UserState = {
  data: [],
};
export function userReducer(
  state: UserState = INITIAL_STATE,
  action: ActionPayload<UserState>
): UserState {
  switch (action.type) {
    case FETCH:
      return { ...state };
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

//#Redux Saga Action ---------------------------------------------------------------------
function* fetchData(action: ActionPayload<ReduxStateBase>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    var data: any[] = [];
    const result: ResponseData<any> = yield call(UserService.GetData);
    if (result && typeof result == "object" && "MessageCode" in result) {
      data = result.Content;
    } else {
      AppLogging.error(result.Message);
    }
    yield put(Actions.setState({ data }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* userWatcher() {
  yield all([takeLatest(FETCH, fetchData)]);
}
