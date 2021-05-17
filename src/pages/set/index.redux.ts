import { all, call, put, select, take, takeLatest } from "redux-saga/effects";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging } from "../../helpers/utilities";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import { ResponseData } from "../../interface/service";
import { GetDataService } from "../../services/category";
import ActionTypes from "../../store/actions";
import { AppState } from "../../store/root_reducer";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE, GET_DATA_BY_CATEGORY_ID, FETCH_DONE } =
  ActionTypes.Set();
export interface SetState extends ReduxStateBase {
  isLoading?: boolean;
  data?: any[];
  categorySelectedValue: number;
}
//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (): ActionPayload<any> => ({
    type: FETCH,
  }),
  fetchDone: (): ActionPayload<any> => {
    return {
      type: FETCH_DONE,
    };
  },
  getDataByCategoryId: (categoryId: any): ActionPayload<any> => ({
    type: GET_DATA_BY_CATEGORY_ID,
    payload: categoryId,
  }),
  setState: (values: SetState): ActionPayload<SetState> => ({
    type: SET_STATE,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: SetState = {
  data: [],
  categorySelectedValue: -1,
};
export function setReducer(
  state: SetState = INITIAL_STATE,
  action: ActionPayload<SetState>
): SetState {
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
    yield put({ type: ActionTypes.Category().FETCH });
    yield take(ActionTypes.Category().FETCH_DONE);
    const categoryData: any[] = yield select(
      (state: AppState) => state.categoryReducer.data
    );
    if ((Array.isArray(categoryData) && categoryData.length > 0) == false) {
      AppLogging.error("Không có dữ liệu danh mục. Vui lòng thêm mới danh mục");
      return;
    }
    const result: ResponseData<any> = yield call(
      GetDataService.GetDataSet,
      categoryData[0].CategoryId
    );
    if (result && typeof result == "object" && "MessageCode" in result) {
      data = result.Content;
    } else {
      AppLogging.error(result.Message);
    }
    yield put(
      Actions.setState({
        data,
        categorySelectedValue: categoryData[0].CategoryId,
      })
    );
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
    yield put(Actions.fetchDone());
  }
}
//get by categoryId
export function* getDataByCategoryIdSaga(action: ActionPayload<any>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    var data: any[] = [];
    let categoryId = action.payload;
    const result: ResponseData<any> = yield call(
      GetDataService.GetDataSet,
      categoryId
    );
    if (result && typeof result == "object" && "MessageCode" in result) {
      data = result.Content;
    } else {
      AppLogging.error(result.Message);
    }
    let selectedCategory = categoryId ? categoryId : -1;
    yield put(
      Actions.setState({ data, categorySelectedValue: selectedCategory })
    );
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(Actions.fetchDone());
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}
//#Redux Saga Watcher --------------------------------------------------------------------
export function* setWatcher() {
  yield all([
    takeLatest(FETCH, fetchData),
    takeLatest(GET_DATA_BY_CATEGORY_ID, getDataByCategoryIdSaga),
  ]);
}
