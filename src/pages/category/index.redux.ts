import { all, call, put, takeLatest } from "redux-saga/effects";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging, isNotEmpty } from "../../helpers/utilities";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import { ResponseData } from "../../interface/service";
import { GetDataService } from "../../services/category";
import ActionTypes from "../../store/actions";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE, FETCH_DONE, SAVE_DATA } = ActionTypes.Category();
export interface CategoryState extends ReduxStateBase {
  isLoading?: boolean;
  data?: any[];
}
//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (): ActionPayload<any> => ({
    type: FETCH,
  }),
  fetchDone: (): ActionPayload<any> => ({
    type: FETCH_DONE,
  }),
  setState: (values: CategoryState): ActionPayload<CategoryState> => ({
    type: SET_STATE,
    payload: values,
  }),
  SaveData: (data: any): ActionPayload<any> => ({
    type: SAVE_DATA,
    payload: data,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: CategoryState = {
  data: [],
};
export function categoryReducer(
  state: CategoryState = INITIAL_STATE,
  action: ActionPayload<CategoryState>
): CategoryState {
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
    const result: ResponseData<any> = yield call(
      GetDataService.GetDataCategory
    );
    if (result && typeof result == "object" && "MessageCode" in result) {
      if (isNotEmpty(result.Message)) {
        AppLogging.error(result.Message);
      } else {
        data = result.Content;
      }
    } else {
      AppLogging.error("Notfound get category");
    }
    yield put(Actions.setState({ data }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(Actions.fetchDone());
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}
function* saveData(action: ActionPayload<any>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    let params = action.payload;
    const result: ResponseData<any> = yield call(
      GetDataService.SaveCategory,
      params
    );
    if (result && typeof result == "object" && "MessageCode" in result) {
      if (isNotEmpty(result.Message)) {
        AppLogging.error(result.Message);
      } else {
        AppLogging.success("Thành công");
        var reloadData: any[] = [];
        const resultReload: ResponseData<any> = yield call(
          GetDataService.GetDataCategory
        );
        if (
          resultReload &&
          typeof resultReload == "object" &&
          "MessageCode" in resultReload
        ) {
          if (isNotEmpty(resultReload.Message)) {
            AppLogging.error(resultReload.Message);
          } else {
            reloadData = resultReload.Content;
          }
        } else {
          AppLogging.error("Notfound get category");
        }
        yield put(Actions.setState({ data: reloadData }));
      }
    } else {
      AppLogging.error("Notfound save category");
    }
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}
//#Redux Saga Watcher --------------------------------------------------------------------
export function* categoryWatcher() {
  yield all([takeLatest(FETCH, fetchData), takeLatest(SAVE_DATA, saveData)]);
}
