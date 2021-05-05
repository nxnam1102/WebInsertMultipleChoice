import { Button } from "devextreme-react/button";
import SelectBox from "devextreme-react/select-box";
import React, { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import logoPanel from "../../assets/images/teachLogo.jpg";
import AppTextBox from "../../components/controls/text_box/index";
import LoadingPanel from "../../components/loading/index";
import { Namespace } from "../../constants/language";
import AppStorage from "../../local_storage";
import { AppState } from "../../store/root_reducer";
import { Props } from "./index.interface";
//Styles
import styles from "./index.module.scss";
//Components
import { Actions } from "./index.redux";



//Pages
const Index: FC<Props> = (props) => {
  //Clear hook
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(Namespace.page_login);
  const tcommon = useTranslation(Namespace.common).t;
  const auth = AppStorage.get("auth") === "true" ? true : false;

  //Create State Local

  //Get State from redux
  const { updateStatus, username, password } = useSelector(
    (store: AppState) => store.logInReducer
  );

  //Run Effect
  useEffect(() => {
    let language = localStorage.getItem("i18nextLng");
    language = language ? language : "vi";
    i18n.changeLanguage(language);
  }, [i18n]);

  //Event on Screen
  const onSubmit = useCallback(() => {
    if (username!.length > 0 && password!.length > 0) {
      console.log(`run`);
      dispatch(Actions.login({ username, password }));
    }
  }, [dispatch, username, password]);
  const onChangeLanguage = (value: any) => {
    if (value.value !== value.previousValue) {
      localStorage.setItem("i18nextLng", value.value);
      i18n.changeLanguage(value.value);
    }
  };

  //Render View on Screen
  return auth ? (
    <Redirect to="/" />
  ) : (
    <div className={styles.login_box}>
      <LoadingPanel />
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <img src={logoPanel} alt="logo_panel" />
        </div>
        <div className={styles.right}>
          <h1>{t("login")}</h1>
          <div className={styles.form}>
            <div className={styles.title}>{t("username")}</div>
            <AppTextBox
              showClearButton={true}
              tabIndex={1}
              mode="text"
              onValueChange={(value) =>
                dispatch(Actions.setState({ username: value }))
              }
              onEnterKey={onSubmit}
              required={true}
              className={styles.input}
            />
            <div className={styles.title}>{t("password")}</div>
            <AppTextBox
              showClearButton={true}
              tabIndex={1}
              mode="password"
              onValueChange={(value) =>
                dispatch(Actions.setState({ password: value }))
              }
              onEnterKey={onSubmit}
              required={true}
              className={styles.input}
            />
            <div className={styles.title}>{t("language")}</div>
            <div className={"row-item"}>
              <SelectBox
                className={"select-box"}
                dataSource={[
                  { name: tcommon("vi"), value: "vi" },
                  { name: tcommon("en"), value: "en" },
                ]}
                onValueChanged={onChangeLanguage}
                displayExpr="name"
                valueExpr={"value"}
                searchTimeout={200}
                value={i18n.language}
              />
            </div>
            <Button
              onClick={onSubmit}
              useSubmitBehavior={true}
              className={styles.login_btn}
            >
              {t("login_btn")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Index);
