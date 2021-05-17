import { all, call, put, select, take, takeLatest } from "redux-saga/effects";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging } from "../../helpers/utilities";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import { ResponseData } from "../../interface/service";
import { GetDataService } from "../../services/category";
import ActionTypes from "../../store/actions";
import { AppState } from "../../store/root_reducer";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, SET_STATE, FETCH_DONE, CHANGE_CATEGORY_ID, CHANGE_SET_ID } =
  ActionTypes.Question();
export interface QuestionState extends ReduxStateBase {
  isLoading?: boolean;
  dataQuestion?: any[];
  dataAnswer?: any[];
  allAnswer?: any[];
  categorySelectedValue?: any[];
  setSelectedValue?: any[];
  questionSelectedValue?: any[];
  focusedRowIndex?: number;
}
interface LoadDataByIdParams {
  categoryId?: number;
  setId?: number;
  categorySelectedValue?: any;
}
//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (): ActionPayload<any> => ({
    type: FETCH,
  }),
  setState: (values: QuestionState): ActionPayload<QuestionState> => ({
    type: SET_STATE,
    payload: values,
  }),
  fetchDone: (): ActionPayload<any> => ({
    type: FETCH_DONE,
  }),
  changeCategoryId: (
    param: LoadDataByIdParams
  ): ActionPayload<LoadDataByIdParams> => ({
    type: CHANGE_CATEGORY_ID,
    payload: param,
  }),
  changeSetId: (
    param: LoadDataByIdParams
  ): ActionPayload<LoadDataByIdParams> => ({
    type: CHANGE_SET_ID,
    payload: param,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: QuestionState = {
  dataQuestion: [],
  dataAnswer: [],
  focusedRowIndex: 0,
};
export function questionReducer(
  state: QuestionState = INITIAL_STATE,
  action: ActionPayload<QuestionState>
): QuestionState {
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
    let categoryId =
      Array.isArray(categoryData) && categoryData.length > 0
        ? categoryData[0].CategoryId
        : -1;
    yield put({
      type: ActionTypes.Set().GET_DATA_BY_CATEGORY_ID,
      payload: categoryId,
    });
    yield take(ActionTypes.Set().FETCH_DONE);
    const setData: any[] = yield select(
      (state: AppState) => state.setReducer.data
    );
    let setId =
      Array.isArray(setData) && setData.length > 0 ? setData[0].SetId : -1;
    const result: ResponseData<any> = yield call(
      GetDataService.GetDataQuestion,
      categoryId,
      setId
    );
    if (result && typeof result == "object" && "MessageCode" in result) {
      let questionId =
        Array.isArray(result.Content.allQuestion) &&
        result.Content.allQuestion.length > 0
          ? result.Content.allQuestion[0].QuestionId
          : -1;
      let dataAnswer = [];
      if (
        Array.isArray(result.Content.allAnswer) &&
        result.Content.allAnswer.length > 0
      ) {
        dataAnswer = result.Content.allAnswer.filter(
          (x: any) => x.QuestionId === questionId
        );
      }
      let categorySelectedValue =
        categoryData.length > 0 ? [categoryData[0]] : [];
      let setSelectedValue = setData.length > 0 ? [setData[0]] : [];
      let questionSelectedValue =
        result.Content.allQuestion.length > 0
          ? [result.Content.allQuestion[0]]
          : [];
      yield put(
        Actions.setState({
          dataAnswer: dataAnswer,
          dataQuestion: result.Content.allQuestion,
          allAnswer: result.Content.allAnswer,
          categorySelectedValue,
          setSelectedValue,
          questionSelectedValue,
        })
      );
    } else {
      AppLogging.error(result.Message);
    }
    //yield put(Actions.setState({ data }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
    yield put(Actions.fetchDone());
  }
}

// change category id
function* changeCategoryIdSaga(action: ActionPayload<LoadDataByIdParams>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    var data: any[] = [];

    yield put({
      type: ActionTypes.Set().GET_DATA_BY_CATEGORY_ID,
      payload: action.payload?.categoryId,
    });
    yield take(ActionTypes.Set().FETCH_DONE);
    const setData: any[] = yield select(
      (state: AppState) => state.setReducer.data
    );
    yield put(
      Actions.setState({
        categorySelectedValue: action.payload?.categorySelectedValue,
      })
    );
    console.log(setData);
    let setId =
      action.payload?.setId !== undefined
        ? action.payload?.setId
        : Array.isArray(setData) && setData.length > 0
        ? setData[0].SetId
        : -1;
    const result: ResponseData<any> = yield call(
      GetDataService.GetDataQuestion,
      action.payload?.categoryId,
      setId
    );
    if (result && typeof result == "object" && "MessageCode" in result) {
      let questionId =
        Array.isArray(result.Content.allQuestion) &&
        result.Content.allQuestion.length > 0
          ? result.Content.allQuestion[0].QuestionId
          : -1;
      let dataAnswer = [];
      if (
        Array.isArray(result.Content.allAnswer) &&
        result.Content.allAnswer.length > 0
      ) {
        dataAnswer = result.Content.allAnswer.filter(
          (x: any) => x.QuestionId === questionId
        );
      }
      const categoryData: any[] = yield select(
        (state: AppState) => state.categoryReducer.data
      );
      let categorySelectedValue =
        categoryData.length > 0
          ? [
              categoryData.find(
                (x) => x.CategoryId === action.payload?.categoryId
              ),
            ]
          : [];
      let setSelectedValue =
        setData.length > 0 ? [setData.find((x) => x.SetId === setId)] : [];
      let questionSelectedValue =
        result.Content.allQuestion.length > 0
          ? [result.Content.allQuestion[0]]
          : [];
      yield put(
        Actions.setState({
          dataAnswer: dataAnswer,
          dataQuestion: result.Content.allQuestion,
          allAnswer: result.Content.allAnswer,
          categorySelectedValue,
          setSelectedValue,
          questionSelectedValue,
        })
      );
    } else {
      AppLogging.error(result.Message);
    }
    //yield put(Actions.setState({ data }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
    yield put(Actions.fetchDone());
  }
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* questionWatcher() {
  yield all([
    takeLatest(FETCH, fetchData),
    takeLatest(CHANGE_CATEGORY_ID, changeCategoryIdSaga),
  ]);
}
