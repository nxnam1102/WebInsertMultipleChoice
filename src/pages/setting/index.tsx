import { SelectBox } from "devextreme-react/select-box";
import { locale } from "devextreme/localization";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch } from "react-redux";
import { AppLogging } from "../../helpers/utilities";
import { Namespace } from "../../constants/language";
import { Actions } from "./index.redux";
import "./index.scss";
import themes from "devextreme/ui/themes";
import { ThemeList } from "../../constants/theme";

const Setting = () => {
  const { t, i18n } = useTranslation(Namespace.common);
  const tSetting = useTranslation(Namespace.setting).t;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, [i18n, dispatch, t, tSetting]);
  const themeSource = [
    { name: t("dark_theme"), value: ThemeList.dark },
    { name: t("light_theme"), value: ThemeList.light },
  ];
  const [theme, setTheme] = useState(
    localStorage.getItem("dx-theme") || ThemeList.light
  );
  const onChangeLanguage = (value: any) => {
    try {
      i18n.changeLanguage(value.itemData.value);
      locale(value.itemData.value);
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const onChangeTheme = (value: any) => {
    try {
      let currentTheme = value.itemData.value;
      if (theme !== currentTheme) {
        localStorage.setItem("dx-theme", currentTheme);
        themes.current(currentTheme);
        setTheme(currentTheme);
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  return (
    <div className="dx-fieldset">
      <div className="row-item">
        <div>
          <div className={"dx-field-label"}>{t("language")}</div>
          <div className={"dx-field-value"}>
            <SelectBox
              className={"select-box"}
              onItemClick={onChangeLanguage}
              dataSource={[
                { name: t("vi"), value: "vi" },
                { name: t("en"), value: "en" },
              ]}
              displayExpr="name"
              valueExpr={"value"}
              searchEnabled={true}
              searchTimeout={200}
              value={i18n.language}
            />
          </div>
        </div>
        <div id={"theme"}>
          <div className={"dx-field-label"}>{t("theme")}</div>
          <div className={"dx-field-value"}>
            <SelectBox
              className={"select-box"}
              onItemClick={onChangeTheme}
              dataSource={themeSource}
              displayExpr="name"
              valueExpr={"value"}
              searchEnabled={true}
              searchTimeout={200}
              value={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Setting;
