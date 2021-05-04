import i18n from "i18next";
import moment from "moment";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import APP_CONSTANTS from "../../constants/app";
import { AppLogging } from "../../helpers/utilities";
import { ActionPayload } from "../../interface/redux";
import { FileManagementService } from "../../services/files_management";
import { LessonManagementService } from "../../services/lesson_management";
import ActionTypes from "../../store/actions/index";
import { AppState } from "../../store/root_reducer";
import { LessonData } from "../lesson_management/index.interface";
import { FileManagementState, FileData } from "./index.interface";
import { ResponseData } from "../../interface/service";

//#Redux Action ---------------------------------------------------------------------------
const { FETCH, UPLOAD_FILE, SET_STATE } = ActionTypes.FileManagement();

//#Redux Action Creators-------------------------------------------------------------------
export const Actions = {
  fetchData: (
    lesson: FileManagementState
  ): ActionPayload<FileManagementState> => ({
    type: FETCH,
    payload: lesson,
  }),
  uploadFile: (
    file: FileManagementState
  ): ActionPayload<FileManagementState> => ({
    type: UPLOAD_FILE,
    payload: file,
  }),
  setState: (
    values: FileManagementState
  ): ActionPayload<FileManagementState> => ({
    type: SET_STATE,
    payload: values,
  }),
};

//#Redux Reducer --------------------------------------------------------------------------
const INITIAL_STATE: FileManagementState = {
  listSkill: [
    { id: "1", skill: "1" },
    { id: "2", skill: "2" },
    { id: "3", skill: "3" },
  ],
  listFile: [],
  updateStatus: "",
  updateMessage: "",
};

export function fileManagementReducer(
  state: FileManagementState = INITIAL_STATE,
  action: ActionPayload<FileManagementState>
): FileManagementState {
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
function* fetchData(action: any) {
  yield put({
    type: ActionTypes.Auth().SET_STATE,
    payload: { isLoading: true },
  });
  try {
    //Lấy Id lesson trong payload dể request list Files của lesson
    let lessonId: string = action.payload.selectId!;

    //Request detail info of item
    let { selectItem }: FileManagementState = yield select(
      (state: AppState) => state.fileManagementReducer
    );

    const lessonData: any[] = yield call(LessonManagementService.GetLessonData);

    let filterList = lessonData?.filter(
      (item: LessonData) => item.lessonName === action.payload.selectId
    );
    selectItem = filterList?.length === 1 ? filterList[0] : {};

    const filesData: any[] = yield call(
      FileManagementService.GetFilesData,
      lessonId
    );

    yield put(Actions.setState({ listFile: filesData, selectItem }));
  } catch (error) {
    AppLogging.error(error);
  } finally {
    yield put({
      type: ActionTypes.Auth().SET_STATE,
      payload: { isLoading: false },
    });
  }
}

function* uploadFile(action: any) {
  yield put({
    type: ActionTypes.Auth().SET_STATE,
    payload: { isLoading: true },
  });
  const newFile = action.payload.uploadFile!;
  let {
    listFile,
    updateStatus,
    updateMessage,
  }: FileManagementState = yield select(
    (state: AppState) => state.fileManagementReducer
  );
  try {
    let newId: number = 0;
    if (listFile && listFile?.length > 0) {
      let latestItemId: any = listFile[listFile.length - 1].id;
      newId = +latestItemId + 1;
    }
    //lấy upload key từ database
    //let sessionId = "";
    // const data : any[] = yield call(FileManagementService.GetUploadKey, sessionId);
    APP_CONSTANTS.CONSTVALUE.SECRETKEYAPIUPLOAD = ""; // set key to global value

    //Upload file lên file server và lấy path về cho item mới
    const result: ResponseData<FileData> = yield call(
      FileManagementService.UploadFileData,
      newFile
    );

    if (newFile !== undefined && result.message === "file upload success") {
      let fileName = newFile.name.split(".");
      listFile?.push({
        id: newId?.toString(),
        fileName: fileName[0],
        filePath:
          "https://172.16.9.69:44367/api/v1/Files/Download?filename=" +
          newFile.name,
        fileType: fileName[1],
        createDate: getCurrentDate(),
        updateDate: getCurrentDate(),
        phrase: "1",
        uploader: "admin",
      });
      AppLogging.success(i18n.t("file_management:upload_succeeded"));
      updateStatus = "Upload Succeeded";
    } else {
      AppLogging.error(i18n.t("file_management:upload_failed"));
      updateStatus = "Upload Failed";
    }
    yield put(
      Actions.setState({
        listFile: listFile ? [...listFile] : [],
        updateStatus,
        updateMessage,
      })
    );
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
export function* fileManagementWatcher() {
  yield all([
    takeLatest(FETCH, fetchData),
    takeLatest(UPLOAD_FILE, uploadFile),
  ]);
}
