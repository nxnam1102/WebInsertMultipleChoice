import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging } from "../../helpers/utilities";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import { UserManagementService } from "../../services/user_management";
import ActionTypes from "../../store/actions";
import { AddNewDataParam } from "./index.interface";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE, ADD_NEW } = ActionTypes.UserManagement();
export interface DashboardState extends ReduxStateBase {
  isLoading?: boolean;
  dataSchool?: any[];
  dataUser?: any[];
}
//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (params: string | undefined): ActionPayload<string> => ({
    type: FETCH,
    payload: params,
  }),
  setState: (values: DashboardState): ActionPayload<DashboardState> => ({
    type: SET_STATE,
    payload: values,
  }),
  addNew: (addNewData: AddNewDataParam): ActionPayload<AddNewDataParam> => ({
    type: ADD_NEW,
    payload: addNewData,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: DashboardState = {
  dataSchool: [],
  dataUser: [],
};
export function userManagementReducer(
  state: DashboardState = INITIAL_STATE,
  action: ActionPayload<DashboardState>
): DashboardState {
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
    const dataSchool: any[] = yield call(UserManagementService.GetSchoolData);
    const dataUser: any[] = yield call(
      UserManagementService.GetUserData,
      !action.payload && dataSchool.length > 0
        ? dataSchool[0].id
        : action.payload
    );
    yield put(Actions.setState({ dataSchool, dataUser }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}
//add new
function* addNewDataSaga(action: ActionPayload<AddNewDataParam>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    yield delay(300);
    console.log(action.payload?.addNewData);
    const dataUser: any[] = yield call(
      UserManagementService.AddNewData,
      action.payload?.addNewData,
      action.payload?.currentSchoolId
    );
    let callback = action.payload?.callback;
    if (callback && typeof callback == "function") {
      callback();
    }
    yield put(Actions.setState({ dataUser }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* userManagementWatcher() {
  yield all([
    takeLatest(FETCH, fetchData),
    takeLatest(ADD_NEW, addNewDataSaga),
  ]);
}
