import { put, all, takeLatest, call, delay } from "redux-saga/effects";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import ActionTypes from "../../store/actions";
import { CourseManagementService } from "../../services/course_management";
import { UserManagementService } from "../../services/user_management";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging } from "../../helpers/utilities";
import { AddNewDataParam } from "./index.interface";

//#Redux Action ---------------------------------------------------------------------------
const {
  FETCH,
  SET_STATE,
  ADD_NEW,
  GET_DATA_STAGE,
} = ActionTypes.CourseManagement();
export interface CourseManagementState extends ReduxStateBase {
  isLoading?: boolean;
  dataSchool?: any[];
  dataCourse?: any[];
  dataStage?: any[];
}
//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (params: string | undefined): ActionPayload<string> => ({
    type: FETCH,
    payload: params,
  }),
  setState: (
    values: CourseManagementState
  ): ActionPayload<CourseManagementState> => ({
    type: SET_STATE,
    payload: values,
  }),
  addNew: (addNewData: AddNewDataParam): ActionPayload<AddNewDataParam> => ({
    type: ADD_NEW,
    payload: addNewData,
  }),
  getDataStage: (stageParams: string): ActionPayload<string> => ({
    type: GET_DATA_STAGE,
    payload: stageParams,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: CourseManagementState = {
  dataSchool: [],
  dataCourse: [],
  dataStage: [],
};
export function courseManagementReducer(
  state: CourseManagementState = INITIAL_STATE,
  action: ActionPayload<CourseManagementState>
): CourseManagementState {
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
function* fetchDataSaga(action: ActionPayload<string>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    const dataSchool: any[] = yield call(UserManagementService.GetSchoolData);
    const dataCourse: any[] = yield call(
      CourseManagementService.getCourseData,
      !action.payload && dataSchool.length > 0
        ? dataSchool[0].id
        : action.payload
    );
    yield put(Actions.setState({ dataSchool, dataCourse }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}
//get data stage
function* fetchDataStageSaga(action: ActionPayload<string>) {
  try {
    yield put(
      Actions.setState({
        isLoading: true,
      })
    );
    const dataStage: any[] = yield call(
      CourseManagementService.getStageData,
      undefined
    );
    yield put(Actions.setState({ dataStage }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(Actions.setState({ isLoading: false }));
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
    const dataCourse: any[] = yield call(
      CourseManagementService.AddNewData,
      action.payload?.addNewData,
      action.payload?.currentSchoolId
    );
    let callback = action.payload?.callback;
    if (callback && typeof callback == "function") {
      callback();
    }
    yield put(Actions.setState({ dataCourse }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* courseManagementWatcher() {
  yield all([
    takeLatest(FETCH, fetchDataSaga),
    takeLatest(GET_DATA_STAGE, fetchDataStageSaga),
    takeLatest(ADD_NEW, addNewDataSaga),
  ]);
}
