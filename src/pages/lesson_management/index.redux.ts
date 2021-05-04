import i18n from "i18next";
import { cloneDeep } from "lodash";
import moment from "moment";
import { all, call, delay, put, select, takeLatest } from "redux-saga/effects";
import { AppLogging } from "../../helpers/utilities";
import { ActionPayload } from "../../interface/redux";
import { LessonManagementService } from "../../services/lesson_management";
import ActionTypes from "../../store/actions/index";
import { AppState } from "../../store/root_reducer";
import { LessonData, LessonManagementState } from "./index.interface";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, ADD_LESSON, SET_STATE } = ActionTypes.LessonManagement();

//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (): ActionPayload<LessonManagementState> => ({
    type: FETCH,
  }),
  addLesson: (values: LessonData): ActionPayload<LessonManagementState> => ({
    type: ADD_LESSON,
    payload: values,
  }),
  setState: (
    values: LessonManagementState
  ): ActionPayload<LessonManagementState> => ({
    type: SET_STATE,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------
const INITIAL_STATE: LessonManagementState = {
  isLoading: false,
  lessonId: "",
  lessonName: "",
  status: "",
  phrase: "",
  grade: "",
  note: "",
  tags: []!,
  listStatus: [
    { id: "1", status: "active" },
    { id: "2", status: "inactive" },
    { id: "3", status: "draft" },
  ],
  listGrade: [
    { id: "1", grade: "1" },
    { id: "2", grade: "2" },
    { id: "3", grade: "3" },
  ],
  listSkill: [
    { id: "1", skill: "1" },
    { id: "2", skill: "2" },
    { id: "3", skill: "3" },
  ],
  listLesson: [],
  updateStatus: "",
  updateMessage: "",
};

export function lessonManagementReducer(
  state: LessonManagementState = INITIAL_STATE,
  action: ActionPayload<LessonManagementState>
): LessonManagementState {
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
function* fetchData() {
  yield put({
    type: ActionTypes.Auth().SET_STATE,
    payload: { isLoading: true },
  });
  let { listStatus }: LessonManagementState = yield select(
    (state: AppState) => state.lessonManagementReducer
  );
  try {
    const lessonData: any[] = yield call(LessonManagementService.GetLessonData);
    let cloneList = cloneDeep(lessonData);
    for (let item of cloneList) {
      for (let status of listStatus!) {
        if (item.status === status.id) {
          item.status = status.status;
        }
      }
    }
    yield put(Actions.setState({ listLesson: cloneList }));
  } catch (err: any) {
    AppLogging.error(err);
  } finally {
    yield put({
      type: ActionTypes.Auth().SET_STATE,
      payload: { isLoading: false },
    });
  }
}

function* addLesson(action: any) {
  yield put({
    type: ActionTypes.Auth().SET_STATE,
    payload: { isLoading: true },
  });
  let { listLesson, updateStatus }: LessonManagementState = yield select(
    (state: AppState) => state.lessonManagementReducer
  );
  let cloneList = cloneDeep(listLesson);
  try {
    yield delay(1000);
    let newLesson = { ...action.payload };
    if (newLesson !== undefined) {
      cloneList?.push({
        id: newLesson.id,
        lessonName: newLesson.lessonName,
        status: newLesson.status,
        grade: newLesson.grade,
        tags: newLesson.tags,
        note: newLesson.note,
        phrase: newLesson.phrase,
        createDate: getCurrentDate(),
        updateDate: getCurrentDate(),
        skill: "1",
      });
      AppLogging.success(i18n.t("file_management:add_lesson_succeeded"));
      updateStatus = "Add Lesson Succeeded";
    } else {
      AppLogging.error(i18n.t("file_management:add_lesson_failed"));
      updateStatus = "Add Lesson Failed";
    }
    yield put(Actions.setState({ listLesson: cloneList, updateStatus }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put({
      type: ActionTypes.Auth().SET_STATE,
      payload: { isLoading: false },
    });
  }
}

//#Function Private ----------------------------------------------------------------------
function getCurrentDate() {
  let date = moment().format("DD/MM/YYYY");
  return date;
}

//#Redux Saga Watcher --------------------------------------------------------------------
export function* lessonManagementWatcher() {
  yield all([takeLatest(FETCH, fetchData), takeLatest(ADD_LESSON, addLesson)]);
}
