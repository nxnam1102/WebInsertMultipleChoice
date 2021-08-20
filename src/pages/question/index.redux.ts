import { cloneDeep } from "lodash";
import { all, call, put, select, take, takeLatest } from "redux-saga/effects";
import { ActionsLoading } from "../../components/loading/loading.redux";
import { AppLogging, isNotEmpty } from "../../helpers/utilities";
import { ActionPayload, ReduxStateBase } from "../../interface/redux";
import { ResponseData } from "../../interface/service";
import { GetDataService } from "../../services/category";
import ActionTypes from "../../store/actions";
import { AppState } from "../../store/root_reducer";

//#Redux Action ---------------------------------------------------------------------------
const {
  FETCH,
  SET_STATE,
  FETCH_DONE,
  CHANGE_CATEGORY_ID,
  CHANGE_SET_ID,
  SAVE_DATA,
} = ActionTypes.Question();
export interface QuestionState extends ReduxStateBase {
  isLoading?: boolean;
  dataQuestion?: any[];
  dataAnswer?: any[];
  allAnswer?: any[];
  categorySelectedValue?: any[];
  setSelectedValue?: any[];
  questionSelectedValue?: any[];
  allFile?: any[];
  dataFile?: any;
  dataFileAnswer?: any;
  answerSelectedValue?: any[];
}
interface LoadDataByIdParams {
  categoryId?: number;
  setId?: number;
  categorySelectedValue?: any;
  setSelectedValue?: any;
}
interface SaveDataParams {
  type: "question" | "answer" | "file";
  callback?: Function;
  data?: any;
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
  save: (params: SaveDataParams): ActionPayload<SaveDataParams> => ({
    type: SAVE_DATA,
    payload: params,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------

const INITIAL_STATE: QuestionState = {
  dataQuestion: [],
  dataAnswer: [],
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
      let dataFile = [];
      if (
        Array.isArray(result.Content.allFile) &&
        result.Content.allFile.length > 0
      ) {
        dataFile = result.Content.allFile.filter(
          (x: any) => x.QuestionId === questionId && x.UseType === "Question"
        );
      }
      let answerId =
        Array.isArray(dataAnswer) && dataAnswer.length > 0
          ? dataAnswer[0].AnswerId
          : -1;
      let dataFileAnswer = [];
      if (
        Array.isArray(result.Content.allFile) &&
        result.Content.allFile.length > 0
      ) {
        dataFileAnswer = result.Content.allFile.filter(
          (x: any) =>
            x.QuestionId === questionId &&
            x.UseType === "Answer" &&
            x.AnswerId === answerId
        );
      }
      let categorySelectedValue =
        categoryData.length > 0 ? [categoryData[0]] : [];
      let setSelectedValue = setData.length > 0 ? [setData[0]] : [];
      let questionSelectedValue =
        result.Content.allQuestion.length > 0
          ? [result.Content.allQuestion[0]]
          : [];
      let answerSelectedValue =
        Array.isArray(dataAnswer) && dataAnswer.length > 0
          ? [dataAnswer[0]]
          : [];
      yield put(
        Actions.setState({
          dataQuestion: result.Content.allQuestion,
          dataAnswer: dataAnswer,
          allAnswer: result.Content.allAnswer,
          dataFile: dataFile,
          allFile: result.Content.allFile,
          categorySelectedValue,
          setSelectedValue,
          questionSelectedValue,
          answerSelectedValue,
          dataFileAnswer: dataFileAnswer,
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
    yield put({
      type: ActionTypes.Set().GET_DATA_BY_CATEGORY_ID,
      payload: action.payload?.categoryId,
    });
    yield take(ActionTypes.Set().FETCH_DONE);
    const setData: any[] = yield select(
      (state: AppState) => state.setReducer.data
    );
    // if (action.payload?.categorySelectedValue) {
    //   yield put(
    //     Actions.setState({
    //       categorySelectedValue: action.payload?.categorySelectedValue,
    //     })
    //   );
    // }
    // if (action.payload?.setSelectedValue) {
    //   yield put(
    //     Actions.setState({
    //       setSelectedValue: action.payload?.setSelectedValue,
    //     })
    //   );
    // }
    //console.log(setData);
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
      let dataFile = [];
      if (
        Array.isArray(result.Content.allFile) &&
        result.Content.allFile.length > 0
      ) {
        dataFile = result.Content.allFile.filter(
          (x: any) => x.QuestionId === questionId && x.UseType === "Question"
        );
      }
      let answerId =
        Array.isArray(dataAnswer) && dataAnswer.length > 0
          ? dataAnswer[0].AnswerId
          : -1;
      let dataFileAnswer = [];
      if (
        Array.isArray(result.Content.allFile) &&
        result.Content.allFile.length > 0
      ) {
        dataFileAnswer = result.Content.allFile.filter(
          (x: any) =>
            x.QuestionId === questionId &&
            x.UseType === "Answer" &&
            x.AnswerId === answerId
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
      let answerSelectedValue =
        Array.isArray(dataAnswer) && dataAnswer.length > 0
          ? [dataAnswer[0]]
          : [];
      yield put(
        Actions.setState({
          categorySelectedValue,
          setSelectedValue,
          dataQuestion: result.Content.allQuestion,
          dataAnswer: dataAnswer,
          allAnswer: result.Content.allAnswer,
          dataFile: dataFile,
          allFile: result.Content.allFile,
          questionSelectedValue,
          answerSelectedValue,
          dataFileAnswer: dataFileAnswer,
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
function* saveSaga(action: ActionPayload<SaveDataParams>) {
  try {
    yield put(
      ActionsLoading.setState({
        isLoading: true,
      })
    );
    let type = action.payload?.type;
    let result: ResponseData<any> = {
      Message: "Notfound error",
      MessageCode: 401,
      Content: null,
    };
    let saveData = cloneDeep(action.payload?.data);
    if (type === "question") {
      result = yield call(GetDataService.SaveQuestion, saveData);
    } else if (type === "answer") {
      result = yield call(GetDataService.SaveAnswer, saveData);
    } else if (type === "file") {
      result = yield call(GetDataService.SaveFile, saveData);
    }
    if (result && typeof result === "object" && "Message" in result) {
      if (isNotEmpty(result.Message) === false) {
        AppLogging.success("Thành công");
        if (typeof action.payload?.callback === "function") {
          action.payload.callback();
        }
        //================reload data==============
        let resultReload: ResponseData<any> = {
          Message: "Notfound error",
          MessageCode: 401,
          Content: [],
        };
        resultReload = yield call(
          GetDataService.GetDataQuestion,
          type === "file" ? saveData.data.CategoryId : saveData.CategoryId,
          type === "file" ? saveData.data.SetId : saveData.SetId
        );
        if (
          resultReload &&
          typeof resultReload === "object" &&
          "Message" in resultReload
        ) {
          if (isNotEmpty(resultReload.Message) === false) {
            if (type === "question") {
              yield put(
                Actions.setState({
                  dataQuestion: cloneDeep(resultReload.Content.allQuestion),
                })
              );
            } else if (type === "answer") {
              let dataAnswer = resultReload.Content.allAnswer.filter(
                (x: any) => x.QuestionId === saveData.QuestionId
              );
              yield put(
                Actions.setState({
                  dataAnswer: cloneDeep(dataAnswer),
                })
              );
            } else if (type === "file") {
              if (saveData.data.UseType === "Answer") {
                let dataFile = resultReload.Content.allFile.filter(
                  (x: any) =>
                    x.QuestionId === saveData.data.QuestionId &&
                    x.UseType === "Answer" &&
                    x.AnswerId === saveData.data.AnswerId
                );
                yield put(
                  Actions.setState({
                    dataFileAnswer: cloneDeep(dataFile),
                    allFile: cloneDeep(resultReload.Content.allFile),
                  })
                );
              } else {
                let dataFile = resultReload.Content.allFile.filter(
                  (x: any) =>
                    x.QuestionId === saveData.data.QuestionId &&
                    x.UseType === "Question"
                );
                yield put(
                  Actions.setState({
                    dataFile: cloneDeep(dataFile),
                    allFile: cloneDeep(resultReload.Content.allFile),
                  })
                );
              }
            }
          } else {
            AppLogging.error(result.Message);
          }
        } else {
          AppLogging.error("Notfound error reload");
        }
      } else {
        AppLogging.error(result.Message);
      }
    } else {
      AppLogging.error("Notfound error");
    }

    //yield put(Actions.setState({ data }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put(ActionsLoading.setState({ isLoading: false }));
  }
}
//#Redux Saga Watcher --------------------------------------------------------------------
export function* questionWatcher() {
  yield all([
    takeLatest(FETCH, fetchData),
    takeLatest(CHANGE_CATEGORY_ID, changeCategoryIdSaga),
    takeLatest(SAVE_DATA, saveSaga),
  ]);
}
