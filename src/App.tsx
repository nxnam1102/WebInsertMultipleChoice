import { loadMessages, locale } from "devextreme/localization";
import enMessage from "devextreme/localization/messages/en.json";
import viMessage from "devextreme/localization/messages/vi.json";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import SideBar from "./components/app_meu_bar";
import { Actions } from "./components/authentication/auth.redux";
import Loading from "./components/loading";
import NotFound from "./components/not_found";
import { AppLogging } from "./helpers/utilities";
import { Namespace } from "./constants/language";
import AppStorage from "./local_storage";
import CourseManagement from "./pages/course_management";
import FileManagement from "./pages/file_management";
import LessonManagement from "./pages/lesson_management";
import Login from "./pages/login/index";
import { Actions as LoginActions } from "./pages/login/index.redux";
import SchedureFile from "./pages/schedure_file";
import Setting from "./pages/setting";
import UserManagement from "./pages/user_management";
import { AppState } from "./store/root_reducer";

function App() {
  //Use Effect
  const dispatch = useDispatch();
  useEffect(() => {
    async function authCheck() {
      dispatch(Actions.authCheck());
    }
    authCheck();
  }, [dispatch]);

  //Get state redux
  // const { auth } = useSelector((store: AppState) => store.authReducer);
  // const auth = AppStorage.get("auth") === "true" ? true : false;

  //load language devextreme
  loadMessages(viMessage);
  loadMessages(enMessage);
  let language = localStorage.getItem("i18nextLng");
  language = language ? language : "vi";
  locale(language);
  //
  const AppRoute = () => {
    const { t } = useTranslation(Namespace.page_login);
    const { updateStatus } = useSelector(
      (store: AppState) => store.logInReducer
    );

    useEffect(() => {
      if (updateStatus !== "") {
        AppLogging.success(
          updateStatus === "SUCCEEDED" ? t("login_succeed") : ""
        );
        dispatch(
          LoginActions.setState({ updateStatus: "", updateMessage: "" })
        );
      }
    }, [updateStatus, t]);
    return (
      <Switch>
        <Route path="/user_manage">
          <UserManagement />
        </Route>
        <Route path="/course_manage">
          <CourseManagement />
        </Route>
        <Route exact path="/file_manage">
          <LessonManagement />
        </Route>
        <Route exact path="/file_manage/:id">
          <FileManagement />
        </Route>
        <Route path="/setting">
          <Setting />
        </Route>
        <Route path="/schedure_file">
          <SchedureFile />
        </Route>
        <Route exact path="/">
          <Setting />
        </Route>
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    );
  };

  return (
    <div className="app">
      <BrowserRouter>
        <Loading />
        <Switch>
          <Route exact path={"/login_page"} render={() => <Login />} />
          <Route
            path={"/"}
            render={() => {
              return (AppStorage.get("auth") === "true" ? true : false) ===
                true ? (
                <div className={"main-app"}>
                  <SideBar />
                  <div id={"main-view"}>
                    <AppRoute />
                  </div>
                </div>
              ) : (
                <Redirect to="/login_page" />
              );
            }}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
