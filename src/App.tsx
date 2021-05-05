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
import Login from "./pages/login/index";
import { Actions as LoginActions } from "./pages/login/index.redux";
import { AppState } from "./store/root_reducer";
import User from "./pages/user";

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
        <Route path="/user">
          <User />
        </Route>
        <Route path="/question">
          <div />
        </Route>
        <Route exact path="/set">
          <div />
        </Route>
        <Route exact path="/category">
          <div />
        </Route>
        <Route exact path="/">
          <div />
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
